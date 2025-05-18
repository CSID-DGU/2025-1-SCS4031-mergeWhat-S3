package com.s3.mergewhat.review.command.application.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ReviewDTO {

    private Long id;
    private Long userId;
    private Long storeId;
    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

}
