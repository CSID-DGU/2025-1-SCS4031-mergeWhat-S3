package com.s3.mergewhat.post.service;

import com.s3.mergewhat.post.domain.vo.RequestPostCommentVO;
import com.s3.mergewhat.post.domain.vo.ResponsePostCommentVO;

import java.util.List;

public interface PostCommentService {
    ResponsePostCommentVO createComment(RequestPostCommentVO request);
    List<ResponsePostCommentVO> getCommentsByPostId(Long postId);
    ResponsePostCommentVO updateComment(Long commentId, RequestPostCommentVO request);
    void deleteComment(Long commentId);
    ResponsePostCommentVO getCommentById(Long commentId);
}
