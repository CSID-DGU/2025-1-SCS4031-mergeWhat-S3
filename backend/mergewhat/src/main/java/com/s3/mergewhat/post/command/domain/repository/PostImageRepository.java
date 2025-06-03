package com.s3.mergewhat.post.command.domain.repository;

import com.s3.mergewhat.post.command.domain.aggregate.PostImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostImageRepository extends JpaRepository<PostImage, Long> {
}
