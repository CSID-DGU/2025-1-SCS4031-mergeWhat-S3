package com.s3.mergewhat.member.command.domain.aggregate.entity.repository;

import com.s3.mergewhat.member.command.domain.aggregate.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long> {
    Member findBySocialIdAndSocialType(String socialId, String upperCase);
}
