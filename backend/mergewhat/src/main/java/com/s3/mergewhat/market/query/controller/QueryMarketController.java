package com.s3.mergewhat.market.query.controller;

import com.s3.mergewhat.common.ResponseDTO;
import com.s3.mergewhat.market.query.service.QueryMarketService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/markets")
public class QueryMarketController {

    private final QueryMarketService queryMarketService;

    // id로 조회
    @GetMapping("/{id}")
    public ResponseDTO<?> getMarket(@PathVariable Long id) {
        return ResponseDTO.ok(queryMarketService.getById(id));
    }

}
