package com.s3.mergewhat.member.command.domain.aggregate.entity.repository;

import com.s3.mergewhat.member.command.domain.aggregate.entity.MerchantLoginHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MerchantLoginHistoryRepository extends JpaRepository<MerchantLoginHistory, Long> {
}
