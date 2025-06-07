package com.s3.mergewhat.post.domain.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.s3.mergewhat.post.domain.aggregate.BoardType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ResponsePostVO {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("title")
    private String title;

    @JsonProperty("content")
    private String content;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @JsonProperty("board_type")
    private BoardType boardType;

}
