package com.s3.mergewhat.post.command.domain.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.s3.mergewhat.post.command.domain.aggregate.BoardType;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
public class ResponsePostAndImageVO {

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

    @JsonProperty("image_url")
    private List<String> imageUrls;

}
