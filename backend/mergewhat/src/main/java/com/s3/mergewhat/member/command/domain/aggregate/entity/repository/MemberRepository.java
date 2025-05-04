package com.s3.mergewhat.member.command.domain.aggregate.entity.repository;

import com.s3.mergewhat.member.command.domain.aggregate.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
    Optional findBySocialIdAndSocialType(String socialId, String upperCase);
}
