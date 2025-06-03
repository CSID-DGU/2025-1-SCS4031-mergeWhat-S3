package com.s3.mergewhat.store.domain.repository;

import com.s3.mergewhat.store.domain.aggregate.entity.Store;
import org.apache.ibatis.annotations.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface StoreRepository extends JpaRepository<Store, Long> {

    @Query("SELECT s FROM Store s JOIN FETCH s.category c JOIN FETCH s.market m")
    List<Store> findAllWithMarketAndCategory();

    @Query("SELECT s FROM Store s JOIN FETCH s.category c JOIN FETCH s.market m WHERE s.name LIKE %:name%")
    List<Store> findByNameContainingWithJoin(@Param("name") String name);

    @Query("SELECT s FROM Store s JOIN FETCH s.category c JOIN FETCH s.market m WHERE s.name LIKE %:name% AND c.name = :category")
    List<Store> findByNameAndCategory(@Param("name") String name, @Param("category") String category);


}
