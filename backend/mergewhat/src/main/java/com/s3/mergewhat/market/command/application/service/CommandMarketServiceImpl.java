package com.s3.mergewhat.market.command.application.service;

import com.s3.mergewhat.common.exception.CommonException;
import com.s3.mergewhat.common.exception.ErrorCode;
import com.s3.mergewhat.market.command.application.dto.MarketDTO;
import com.s3.mergewhat.market.command.domain.aggregate.entity.Market;
import com.s3.mergewhat.market.command.domain.repository.CategoryRepository;
import com.s3.mergewhat.market.command.domain.repository.MarketRepository;
import com.s3.mergewhat.market.command.domain.vo.ResponseMarketVO;
import com.s3.mergewhat.store.command.domain.repository.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommandMarketServiceImpl implements CommandMarketService {

    private final MarketRepository marketRepository;

    // 시장 생성
    @Override
    public ResponseMarketVO createMarket(String name, String field) {
        Market market = Market.builder().name(name).field(field).build();
        Market savedMarket = marketRepository.save(market);
        return new ResponseMarketVO(savedMarket.getId(), savedMarket.getName(), savedMarket.getField());
    }

    // 시장 삭제
    @Override
    public ResponseMarketVO deleteMarket(Long id) {
        Market market = marketRepository.findById(id)
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_MARKET));
        marketRepository.delete(market);
        return new ResponseMarketVO(market.getId(), market.getName(), market.getField());
    }

    // 시장 수정
    @Override
    public ResponseMarketVO updateMarket(Long id, String name, String field) {
        Market market = marketRepository.findById(id)
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_MARKET));
        market.update(name, field);
        Market updated = marketRepository.save(market);
        return new ResponseMarketVO(updated.getId(), updated.getName(), updated.getField());
    }
}
