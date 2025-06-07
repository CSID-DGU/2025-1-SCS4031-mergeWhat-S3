package com.s3.mergewhat.post.service;

import com.s3.mergewhat.common.exception.CommonException;
import com.s3.mergewhat.common.exception.ErrorCode;
import com.s3.mergewhat.member.command.domain.aggregate.entity.Member;
import com.s3.mergewhat.member.command.domain.aggregate.entity.repository.MemberRepository;
import com.s3.mergewhat.post.domain.aggregate.Post;
import com.s3.mergewhat.post.domain.aggregate.PostComment;
import com.s3.mergewhat.post.domain.repository.PostCommentRepository;
import com.s3.mergewhat.post.domain.repository.PostRepository;
import com.s3.mergewhat.post.domain.vo.RequestPostCommentVO;
import com.s3.mergewhat.post.domain.vo.ResponsePostCommentVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostCommentServiceImpl implements PostCommentService {

    private final PostCommentRepository postCommentRepository;
    private final MemberRepository memberRepository;
    private final PostRepository postRepository;


    @Override
    @Transactional
    public ResponsePostCommentVO createComment(RequestPostCommentVO request) {
        Member member = memberRepository.findById(request.getUserId())
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_MEMBER));

        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_POST));

        PostComment postComment = PostComment.builder()
                .post(post)
                .member(member)
                .content(request.getContent())
                .build();

        PostComment savedPostComment = postCommentRepository.save(postComment);
        return new ResponsePostCommentVO(savedPostComment);
    }

    @Override
    public List<ResponsePostCommentVO> getCommentsByPostId(Long postId) {
        postRepository.findById(postId)
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_POST));

        List<PostComment> postComments = postCommentRepository.findByPostId(postId);
        return postComments.stream()
                .map(ResponsePostCommentVO::new)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ResponsePostCommentVO updateComment(Long commentId, RequestPostCommentVO request) {
        PostComment postComment = postCommentRepository.findById(commentId)
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_COMMENT));

        postComment.updateComment(request.getContent());
        return new ResponsePostCommentVO(postComment);
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId) {
        PostComment postComment = postCommentRepository.findById(commentId)
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_COMMENT));

        postCommentRepository.delete(postComment);
    }

    @Override
    public ResponsePostCommentVO getCommentById(Long commentId) {
        PostComment postComment = postCommentRepository.findById(commentId)
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_COMMENT));

        return new ResponsePostCommentVO(postComment);
    }
}
