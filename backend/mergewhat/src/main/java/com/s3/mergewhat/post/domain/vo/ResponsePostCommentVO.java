package com.s3.mergewhat.post.domain.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.s3.mergewhat.member.command.domain.aggregate.entity.Member;
import com.s3.mergewhat.post.domain.aggregate.Post;
import com.s3.mergewhat.post.domain.aggregate.PostComment;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Optional;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ResponsePostCommentVO {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("user_nickname")
    private String nickname;

    @JsonProperty("post_id")
    private Long postId;

    @JsonProperty("content")
    private String content;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    public ResponsePostCommentVO(PostComment postComment) {
        this.id = postComment.getId();
        this.userId = Optional.ofNullable(postComment.getMember()).map(Member::getId).orElse(null);
        this.nickname = Optional.ofNullable(postComment.getMember()).map(Member::getNickname).orElse(null);
        this.postId = Optional.ofNullable(postComment.getPost()).map(Post::getId).orElse(null);
        this.content = postComment.getContent();
        this.createdAt = postComment.getCreatedAt();
    }

}
