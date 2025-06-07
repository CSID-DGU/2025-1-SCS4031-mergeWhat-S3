package com.s3.mergewhat.post.domain.repository;

import com.s3.mergewhat.post.domain.aggregate.BoardType;
import com.s3.mergewhat.post.domain.aggregate.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByMemberIdOrderByCreatedAtDesc(Long memberId);

    List<Post> findByMemberId(Long userId);

    List<Post> findByBoardType(BoardType boardType);
}
