package com.s3.mergewhat.mypage.query.controller;

import com.s3.mergewhat.common.ResponseDTO;
import com.s3.mergewhat.member.command.domain.vo.response.ResponseUserProfileVO;
import com.s3.mergewhat.mypage.query.mapper.QueryUserMapper;
import com.s3.mergewhat.post.command.domain.vo.ResponsePostAndImageVO;
import com.s3.mergewhat.storereview.command.domain.vo.ResponseStoreReviewVO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users/me")
public class QueryUserController {

    private final QueryUserMapper queryUserMapper;

    @GetMapping
    public ResponseDTO<?> getMyProfile(@AuthenticationPrincipal Long userId) {
        ResponseUserProfileVO result = queryUserMapper.findUserProfile(userId);
        return ResponseDTO.ok(result);
    }

    @GetMapping("/posts")
    public ResponseDTO<?> getPosts(@AuthenticationPrincipal Long userId) {
        List<ResponsePostAndImageVO> result = queryUserMapper.findMyPosts(userId);
        return ResponseDTO.ok(result);
    }

    @GetMapping("/reviews")
    public ResponseDTO<?> getReviews(@AuthenticationPrincipal Long userId) {
        List<ResponseStoreReviewVO> result = queryUserMapper.findMyReviews(userId);
        return ResponseDTO.ok(result);
    }

}
