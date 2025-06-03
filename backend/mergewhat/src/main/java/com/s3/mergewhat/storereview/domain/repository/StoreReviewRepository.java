package com.s3.mergewhat.storereview.domain.repository;

import com.s3.mergewhat.storereview.domain.aggregate.entity.StoreReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StoreReviewRepository extends JpaRepository<StoreReview, Long> {
    List<StoreReview> findAllByMemberIdOrderByCreatedAtDesc(Long memberId);

    List<StoreReview> findByMemberId(Long userId);

    List<StoreReview> findByStoreIdOrderByCreatedAtDesc(Long storeId);
}
