package com.s3.mergewhat.post.command.application.controller;

import com.s3.mergewhat.common.ResponseDTO;
import com.s3.mergewhat.common.S3Uploader;
import com.s3.mergewhat.common.exception.CommonException;
import com.s3.mergewhat.common.exception.ErrorCode;
import com.s3.mergewhat.post.command.domain.aggregate.Post;
import com.s3.mergewhat.post.command.domain.aggregate.PostImage;
import com.s3.mergewhat.post.command.domain.repository.PostImageRepository;
import com.s3.mergewhat.post.command.domain.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/post-images")
public class PostImageController {

    private final S3Uploader s3Uploader;
    private final PostImageRepository postImageRepository;
    private final PostRepository postRepository;

    @PostMapping("/{postId}")
    public ResponseDTO<?> uploadPostImage(@PathVariable Long postId,
                                          @RequestParam("file") List<MultipartFile> images) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_POST));

        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile image : images) {
            String imageUrl = s3Uploader.upload(image, "post");
            imageUrls.add(imageUrl);
            postImageRepository.save(
                    PostImage.builder()
                            .post(post)
                            .postImageUrl(imageUrl)
                            .build()
            );
        }
        return ResponseDTO.ok(imageUrls);
    }

}
