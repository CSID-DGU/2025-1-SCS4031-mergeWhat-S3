package com.s3.mergewhat.store.domain.repository;

import com.s3.mergewhat.store.dto.StoreKeyword;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KeywordRepository extends JpaRepository<StoreKeyword, Long> {
    List<StoreKeyword> findByStoreId(Long storeId);
}
