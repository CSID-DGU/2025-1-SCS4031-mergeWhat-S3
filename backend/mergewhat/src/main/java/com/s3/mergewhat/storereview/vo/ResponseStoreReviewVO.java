package com.s3.mergewhat.storereview.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.s3.mergewhat.storereview.domain.aggregate.entity.StoreReview;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Setter
public class ResponseStoreReviewVO {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("store_id")
    private Long storeId;

    @JsonProperty("rating")
    private Integer rating;

    @JsonProperty("comment")
    private String comment;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @JsonProperty("image_url")
    private List<String> imageUrls;

    // 변환 생성자 추가
    public ResponseStoreReviewVO(StoreReview review) {
        this.id = review.getId();
        this.userId = review.getMember().getId();
        this.storeId = review.getStore().getId();
        this.rating = review.getRating();
        this.comment = review.getComment();
        this.createdAt = review.getCreatedAt();
        this.imageUrls = review.getReviewImages().stream()
                .map(image -> image.getImageUrl())
                .collect(Collectors.toList());
    }

}
