package com.s3.mergewhat.post.command.domain.repository;

import com.s3.mergewhat.post.command.domain.aggregate.Post;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
}
