package com.s3.mergewhat.store.command.domain.repository;

import com.s3.mergewhat.store.command.domain.aggregate.entity.StoreProduct;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoreProductRepository extends JpaRepository<StoreProduct, Long> {
}
