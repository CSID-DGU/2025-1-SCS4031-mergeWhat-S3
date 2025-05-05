package com.s3.mergewhat.store.command.domain.repository;

import com.s3.mergewhat.store.command.domain.aggregate.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoreRepository extends JpaRepository<Store, Long> {
}
