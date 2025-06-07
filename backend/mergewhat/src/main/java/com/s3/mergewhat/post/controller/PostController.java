package com.s3.mergewhat.post.controller;

import com.s3.mergewhat.common.ResponseDTO;
import com.s3.mergewhat.post.service.PostService;
import com.s3.mergewhat.post.domain.aggregate.BoardType;
import com.s3.mergewhat.post.domain.vo.RequestPostVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    @GetMapping("/by-category")
    public ResponseDTO<?> getPostsByCategory(@RequestParam BoardType boardType) {
        return ResponseDTO.ok(postService.getPostsByCategory(boardType));
    }

    @PostMapping("/write")
    public ResponseDTO<?> create(@RequestBody RequestPostVO request) {
        return ResponseDTO.ok(postService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseDTO<?> update(@PathVariable Long id, @RequestBody RequestPostVO request) {
        return ResponseDTO.ok(postService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseDTO<?> delete(@PathVariable Long id) {
        return ResponseDTO.ok(postService.delete(id));
    }

}
