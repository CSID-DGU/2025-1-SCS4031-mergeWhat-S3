package com.s3.mergewhat.storereview.command.domain.repository;

import com.s3.mergewhat.storereview.command.domain.aggregate.entity.StoreReview;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StoreReviewRepository extends JpaRepository<StoreReview, Long> {
}
