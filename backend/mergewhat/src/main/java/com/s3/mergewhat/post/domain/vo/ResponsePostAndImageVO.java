package com.s3.mergewhat.post.domain.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.s3.mergewhat.post.domain.aggregate.BoardType;
import com.s3.mergewhat.post.domain.aggregate.Post;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

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

    // 변환 생성자 추가
    public ResponsePostAndImageVO(Post post) {
        this.id = post.getId();
        this.userId = post.getMember().getId();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.createdAt = post.getCreatedAt();
        this.boardType = post.getBoardType();
        this.imageUrls = post.getPostImages().stream()
                .map(img -> img.getPostImageUrl())
                .collect(Collectors.toList());
    }

}
