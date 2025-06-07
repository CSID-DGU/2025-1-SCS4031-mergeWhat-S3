package com.s3.mergewhat.store.domain.repository;

import com.s3.mergewhat.store.domain.aggregate.entity.StoreProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface StoreProductRepository extends JpaRepository<StoreProduct, Long> {
    List<StoreProduct> findByStoreId(Long id);
}
