package com.s3.mergewhat.mypage.controller;

import com.s3.mergewhat.common.ResponseDTO;
import com.s3.mergewhat.mypage.service.MyPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users/me")
public class MyPageController {

    private final MyPageService myPageService;

    @GetMapping
    public ResponseDTO<?> getMyProfile(@AuthenticationPrincipal Long userId) {
        return ResponseDTO.ok(myPageService.getMyProfile(userId));
    }

    @GetMapping("/posts")
    public ResponseDTO<?> getPosts(@AuthenticationPrincipal Long userId) {
        return ResponseDTO.ok(myPageService.getMyPosts(userId));
    }

    @GetMapping("/reviews")
    public ResponseDTO<?> getReviews(@AuthenticationPrincipal Long userId) {
        return ResponseDTO.ok(myPageService.getMyReviews(userId));
    }

}
