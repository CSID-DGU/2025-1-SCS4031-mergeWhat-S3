package com.s3.mergewhat.post.command.domain.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.s3.mergewhat.post.command.domain.aggregate.BoardType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RequestPostVO {

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("title")
    private String title;

    @JsonProperty("content")
    private String content;

    @JsonProperty("board_type")
    private BoardType boardType;

}
