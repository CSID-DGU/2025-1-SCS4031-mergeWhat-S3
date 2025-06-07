package com.s3.mergewhat.store.domain.repository;

import com.s3.mergewhat.store.domain.aggregate.entity.BusinessHour;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BusinessHourRepository extends JpaRepository<BusinessHour, Long> {
    List<BusinessHour> findByStoreId(Long id);
}
