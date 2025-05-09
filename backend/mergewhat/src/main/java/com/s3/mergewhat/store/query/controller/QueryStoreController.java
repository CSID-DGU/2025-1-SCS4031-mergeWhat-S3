package com.s3.mergewhat.store.query.controller;

import com.s3.mergewhat.common.ResponseDTO;
import com.s3.mergewhat.store.query.service.QueryStoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/stores")
public class QueryStoreController {

    private final QueryStoreService queryStoreService;

    // pk로 조회
    @GetMapping("/{id}")
    public ResponseDTO<?> getStoreDetail(@PathVariable Long id) {
        return ResponseDTO.ok(queryStoreService.getStoreDetail(id));
    }

    // 상점 이름으로 조회
    @GetMapping("/search")
    public ResponseDTO<?> getStoresByName(@RequestParam String name,
                                          @RequestParam int page,
                                          @RequestParam int size) {
        int offset = page * size;
        return ResponseDTO.ok(queryStoreService.getStoresByName(name, size, offset));
    }




}
