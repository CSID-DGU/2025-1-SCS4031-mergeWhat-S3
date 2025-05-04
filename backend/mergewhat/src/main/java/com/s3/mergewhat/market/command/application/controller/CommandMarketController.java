package com.s3.mergewhat.market.command.application.controller;

import com.s3.mergewhat.common.ResponseDTO;
import com.s3.mergewhat.market.command.application.dto.MarketDTO;
import com.s3.mergewhat.market.command.application.service.CommandMarketService;
import com.s3.mergewhat.market.command.domain.repository.MarketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/markets")
public class CommandMarketController {

    private final CommandMarketService commandMarketService;
    private final MarketRepository marketRepository;

    // 시장 추가
    @PostMapping
    public ResponseDTO<?> createMarket(@RequestBody MarketDTO marketDTO) {
        return ResponseDTO.ok(commandMarketService.create(marketDTO));
    }

    // 시장 업데이트
    @PutMapping("/update/{id}")
    public ResponseDTO<?> updateMarket(@PathVariable Long id, @RequestBody MarketDTO marketDTO) {
        return ResponseDTO.ok(commandMarketService.update(id, marketDTO));
    }

    // 시장 삭제
    @DeleteMapping("/delete/{id}")
    public ResponseDTO<?> deleteMarket(@PathVariable Long id) {
        commandMarketService.delete(id);
        return ResponseDTO.ok(null);
    }
}
