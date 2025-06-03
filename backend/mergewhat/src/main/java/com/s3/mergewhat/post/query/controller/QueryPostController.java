package com.s3.mergewhat.post.query.controller;

import com.s3.mergewhat.common.ResponseDTO;
import com.s3.mergewhat.post.command.domain.vo.ResponsePostVO;
import com.s3.mergewhat.post.query.mapper.QueryPostMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class QueryPostController {

    private final QueryPostMapper queryPostMapper;

    @GetMapping("/by-category")
    public ResponseDTO<?> getPostsByBoardType(@RequestParam String boardType) {
        return ResponseDTO.ok(queryPostMapper.findPostsByBoardType(boardType));
    }

    @GetMapping("/{postId}")
    public ResponseDTO<?> getPostById(@PathVariable Long postId) {
        return ResponseDTO.ok(queryPostMapper.findPostById(postId));
    }

}
