package com.s3.mergewhat.member.command.domain.aggregate.entity.repository;

import com.s3.mergewhat.member.command.domain.aggregate.entity.MemberLoginHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberLoginHistoryRepository extends JpaRepository<MemberLoginHistory, Long> {
}
