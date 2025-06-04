package com.s3.mergewhat.post.domain.repository;

import com.s3.mergewhat.post.domain.aggregate.PostComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostCommentRepository extends JpaRepository<PostComment, Long> {
    List<PostComment> findByPostId(Long postId);
}
