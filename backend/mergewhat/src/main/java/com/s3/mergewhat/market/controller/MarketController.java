package com.s3.mergewhat.market.controller;

import com.s3.mergewhat.common.ResponseDTO;
import com.s3.mergewhat.market.service.MarketService;
import com.s3.mergewhat.market.vo.RequestMarketVO;
import com.s3.mergewhat.market.vo.ResponseMarketVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/markets")
public class MarketController {

    private final MarketService marketService;

    // 시장 전체 조회
    @GetMapping
    public ResponseDTO<?> getMarkets() {
        List<ResponseMarketVO> result = marketService.findAllMarkets();
        System.out.println("👉 result = " + result);
        ResponseDTO<?> response = ResponseDTO.ok(result);
        System.out.println("👉 response = " + response);
        return response;
    }


    // 시장명으로 조회
    @GetMapping("/search")
    public ResponseDTO<?> searchMarkets(@RequestParam String name) {
        return ResponseDTO.ok(marketService.getMarketsByName(name));
    }

    // id로 조회
    @GetMapping("/{id}")
    public ResponseDTO<?> getMarketById(@PathVariable Long id) {
        return ResponseDTO.ok(marketService.getById(id));
    }

    // 시장 추가
    @PostMapping
    public ResponseDTO<?> createMarket(@RequestBody RequestMarketVO request) {
        return ResponseDTO.ok(marketService.createMarket(request.getName(), request.getField()));
    }

    // 시장 수정
    @PutMapping("/update/{id}")
    public ResponseDTO<?> updateMarket(@PathVariable Long id, @RequestBody RequestMarketVO request) {
        return ResponseDTO.ok(marketService.updateMarket(id, request.getName(), request.getField()));
    }

    // 시장 삭제
    @DeleteMapping("/delete/{id}")
    public ResponseDTO<?> deleteMarket(@PathVariable Long id) {
        return ResponseDTO.ok(marketService.deleteMarket(id));
    }
}
