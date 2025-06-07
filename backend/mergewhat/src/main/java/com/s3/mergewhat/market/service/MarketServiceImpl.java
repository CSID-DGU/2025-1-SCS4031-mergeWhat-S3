package com.s3.mergewhat.market.service;

import com.s3.mergewhat.common.exception.CommonException;
import com.s3.mergewhat.common.exception.ErrorCode;
import com.s3.mergewhat.market.domain.aggregate.entity.Market;
import com.s3.mergewhat.market.domain.repository.MarketRepository;
import com.s3.mergewhat.market.vo.ResponseMarketVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MarketServiceImpl implements MarketService {

    private final MarketRepository marketRepository;

    // 시장 전체조회
    @Override
    public List<ResponseMarketVO> findAllMarkets() {
        return marketRepository.findAll()
                .stream()
                .map(market -> new ResponseMarketVO(market.getId(), market.getField(), market.getName()))
                .toList();
    }

    // 이름으로 시장 조회
    @Override
    public List<ResponseMarketVO> getMarketsByName(String name) {
        return marketRepository.findByNameContaining(name)
                .stream()
                .map(market -> new ResponseMarketVO(market.getId(), market.getField(), market.getName()))
                .toList();
    }

    // id로 시장조회
    @Override
    public ResponseMarketVO getById(Long id) {
        Market market = marketRepository.findById(id)
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_MARKET));
        return new ResponseMarketVO(market.getId(), market.getField(), market.getName());
    }

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
