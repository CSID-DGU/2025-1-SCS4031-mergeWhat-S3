package com.s3.mergewhat.market.query.controller;

import com.s3.mergewhat.common.ResponseDTO;
import com.s3.mergewhat.market.query.service.QueryMarketService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/markets")
public class QueryMarketController {

    private final QueryMarketService queryMarketService;

    // id로 조회
    @GetMapping("/query/{id}")
    public ResponseDTO<?> getMarket(@PathVariable Long id) {
        return ResponseDTO.ok(queryMarketService.getById(id));
    }

    // 시장명 조회
    @GetMapping("/search")
    public ResponseDTO<?> getMarketsByName(@RequestParam String name) {
        return ResponseDTO.ok(queryMarketService.getMarketsByName(name));
    }

}
