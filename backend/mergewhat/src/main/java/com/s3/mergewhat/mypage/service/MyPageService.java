package com.s3.mergewhat.mypage.service;

import com.s3.mergewhat.common.exception.CommonException;
import com.s3.mergewhat.common.exception.ErrorCode;
import com.s3.mergewhat.member.command.domain.aggregate.entity.Member;
import com.s3.mergewhat.member.command.domain.aggregate.entity.repository.MemberRepository;
import com.s3.mergewhat.member.command.domain.vo.response.ResponseUserProfileVO;
import com.s3.mergewhat.post.domain.repository.PostRepository;
import com.s3.mergewhat.post.domain.vo.ResponsePostAndImageVO;
import com.s3.mergewhat.storereview.domain.repository.StoreReviewRepository;
import com.s3.mergewhat.storereview.vo.ResponseStoreReviewVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MyPageService {

    private final MemberRepository memberRepository;
    private final PostRepository postRepository;
    private final StoreReviewRepository storeReviewRepository;

    public ResponseUserProfileVO getMyProfile(Long userId) {
        Member member = memberRepository.findById(userId)
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_MEMBER));
        return new ResponseUserProfileVO(member.getId(), member.getEmail(), member.getNickname(), member.getProfileUrl());
    }

    public List<ResponsePostAndImageVO> getMyPosts (Long userId) {
        return postRepository.findByMemberId(userId).stream()
                .map(ResponsePostAndImageVO::new)
                .toList();
    }

    public List<ResponseStoreReviewVO> getMyReviews(Long userId) {
        return storeReviewRepository.findByMemberId(userId).stream()
                .map(ResponseStoreReviewVO::new)
                .toList();
    }
}
