package com.s3.mergewhat.market.command.application.controller;

import com.s3.mergewhat.common.ResponseDTO;
import com.s3.mergewhat.market.command.application.dto.MarketDTO;
import com.s3.mergewhat.market.command.application.service.CommandMarketService;
import com.s3.mergewhat.market.command.domain.repository.MarketRepository;
import com.s3.mergewhat.market.command.domain.vo.RequestMarketVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/markets")
public class CommandMarketController {

    private final CommandMarketService commandMarketService;

    // 시장 추가
    @PostMapping
    public ResponseDTO<?> createMarket(@RequestBody RequestMarketVO request) {
        return ResponseDTO.ok(commandMarketService.createMarket(request.getName(), request.getField()));
    }

    // 시장 수정
    @PutMapping("/update/{id}")
    public ResponseDTO<?> updateMarket(@PathVariable Long id, @RequestBody RequestMarketVO request) {
        return ResponseDTO.ok(commandMarketService.updateMarket(id, request.getName(), request.getField()));
    }

    // 시장 삭제
    @DeleteMapping("/delete/{id}")
    public ResponseDTO<?> deleteMarket(@PathVariable Long id) {
        return ResponseDTO.ok(commandMarketService.deleteMarket(id));
    }
}
