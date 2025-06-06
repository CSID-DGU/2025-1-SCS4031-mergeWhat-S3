package com.s3.mergewhat.storereview.domain.repository;

import com.s3.mergewhat.storereview.domain.aggregate.entity.ReviewImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StoreReviewImageRepository extends JpaRepository<ReviewImage, Long> {

    List<ReviewImage> findAllByReviewId(Long reviewId);
}
