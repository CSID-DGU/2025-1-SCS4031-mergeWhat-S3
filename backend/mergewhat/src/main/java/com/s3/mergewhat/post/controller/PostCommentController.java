package com.s3.mergewhat.post.controller;

import com.s3.mergewhat.common.ResponseDTO;
import com.s3.mergewhat.post.domain.aggregate.PostComment;
import com.s3.mergewhat.post.domain.vo.RequestPostCommentVO;
import com.s3.mergewhat.post.domain.vo.ResponsePostCommentVO;
import com.s3.mergewhat.post.service.PostCommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comments")
public class PostCommentController {

    private final PostCommentService postCommentService;

    @PostMapping
    public ResponseDTO<?> postComment(@RequestBody RequestPostCommentVO request) {
        ResponsePostCommentVO response = postCommentService.createComment(request);
        return ResponseDTO.ok(response);
    }

    @GetMapping("/post/{post_id}")
    public ResponseDTO<?> getCommentsByPostId(@PathVariable("post_id") Long postId) {
        List<ResponsePostCommentVO> responses = postCommentService.getCommentsByPostId(postId);
        return ResponseDTO.ok(responses);
    }

    @GetMapping("/{comment_id}")
    public ResponseDTO<?> getCommentById(@PathVariable("comment_id") Long commentId) {
        ResponsePostCommentVO response = postCommentService.getCommentById(commentId);
        return ResponseDTO.ok(response);
    }

    @PutMapping("/{comment_id}")
    public ResponseDTO<?> updateComment(@PathVariable("comment_id") Long commentId, @RequestBody RequestPostCommentVO request) {
        ResponsePostCommentVO response = postCommentService.updateComment(commentId, request);
        return ResponseDTO.ok(response);
    }

    @DeleteMapping("/{comment_id}")
    public ResponseDTO<?> deleteComment(@PathVariable("comment_id") Long commentId) {
        postCommentService.deleteComment(commentId);
        return ResponseDTO.ok(null);
    }

}
