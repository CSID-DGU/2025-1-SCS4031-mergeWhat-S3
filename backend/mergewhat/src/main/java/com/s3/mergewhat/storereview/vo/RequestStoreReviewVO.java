package com.s3.mergewhat.storereview.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RequestStoreReviewVO {

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("store_id")
    private Long storeId;

    @JsonProperty("rating")
    private Integer rating;

    @JsonProperty("comment")
    private String comment;
}
