package com.s3.mergewhat.post.service;

import com.s3.mergewhat.common.exception.CommonException;
import com.s3.mergewhat.common.exception.ErrorCode;
import com.s3.mergewhat.member.command.domain.aggregate.entity.Member;
import com.s3.mergewhat.member.command.domain.aggregate.entity.repository.MemberRepository;
import com.s3.mergewhat.post.domain.aggregate.BoardType;
import com.s3.mergewhat.post.domain.aggregate.Post;
import com.s3.mergewhat.post.domain.repository.PostRepository;
import com.s3.mergewhat.post.domain.vo.RequestPostVO;
import com.s3.mergewhat.post.domain.vo.ResponsePostAndImageVO;
import com.s3.mergewhat.post.domain.vo.ResponsePostVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final MemberRepository memberRepository;

    @Override
    public List<ResponsePostAndImageVO> getPostsByCategory(BoardType boardType) {
        List<Post> posts = postRepository.findByBoardType(boardType);
        return posts.stream()
                .map(ResponsePostAndImageVO::new)
                .toList();
    }

    @Override
    public ResponsePostVO create(RequestPostVO request) {
        Member user = memberRepository.findById(request.getUserId())
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_MEMBER));

        Post post = Post.builder()
                .member(user)
                .title(request.getTitle())
                .content(request.getContent())
                .boardType(BoardType.valueOf(request.getBoardType()))
                .createdAt(LocalDateTime.now())
                .build();

        Post saved = postRepository.save(post);
        return toVO(saved);

    }

    @Override
    public ResponsePostVO update(Long id, RequestPostVO request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_POST));
        post.update(request.getTitle(), request.getContent());
        return toVO(post);
    }

    @Override
    public ResponsePostVO delete(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_POST));
        postRepository.delete(post);
        return toVO(post);
    }

    private ResponsePostVO toVO(Post post) {
        return new ResponsePostVO(
                post.getId(),
                post.getMember().getId(),
                post.getTitle(),
                post.getContent(),
                post.getCreatedAt(),
                post.getBoardType()
        );
    }
}
