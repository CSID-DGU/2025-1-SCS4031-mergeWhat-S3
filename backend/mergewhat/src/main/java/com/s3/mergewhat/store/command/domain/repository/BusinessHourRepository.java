package com.s3.mergewhat.store.command.domain.repository;

import com.s3.mergewhat.store.command.domain.aggregate.entity.BusinessHour;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusinessHourRepository extends JpaRepository<BusinessHour, Long> {
}
