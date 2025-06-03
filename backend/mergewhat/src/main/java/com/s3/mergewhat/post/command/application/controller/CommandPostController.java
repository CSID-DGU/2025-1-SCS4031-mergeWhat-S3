package com.s3.mergewhat.post.command.application.controller;

import com.s3.mergewhat.common.ResponseDTO;
import com.s3.mergewhat.post.command.application.service.CommandPostService;
import com.s3.mergewhat.post.command.domain.vo.RequestPostVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/posts")
public class CommandPostController {

    private final CommandPostService commandPostService;

    @PostMapping("/write")
    public ResponseDTO<?> create(@RequestBody RequestPostVO request) {
        return ResponseDTO.ok(commandPostService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseDTO<?> update(@PathVariable Long id, @RequestBody RequestPostVO request) {
        return ResponseDTO.ok(commandPostService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseDTO<?> delete(@PathVariable Long id) {
        return ResponseDTO.ok(commandPostService.delete(id));
    }

}
