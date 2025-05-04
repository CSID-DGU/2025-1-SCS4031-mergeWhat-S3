package com.s3.mergewhat.market.command.application.service;

import com.s3.mergewhat.common.exception.CommonException;
import com.s3.mergewhat.common.exception.ErrorCode;
import com.s3.mergewhat.market.command.application.dto.MarketDTO;
import com.s3.mergewhat.market.command.domain.aggregate.entity.Market;
import com.s3.mergewhat.market.command.domain.repository.MarketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommandMarketServiceImpl implements CommandMarketService {

    private final MarketRepository marketRepository;

    @Override
    public MarketDTO create(MarketDTO marketDTO) {
        Market market = Market.builder()
                .name(marketDTO.getName())
                .field(marketDTO.getField())
                .build();
        return MarketDTO.fromEntity(marketRepository.save(market));
    }

    @Override
    public MarketDTO update(Long id, MarketDTO marketDTO) {
        Market market = marketRepository.findById(id).orElseThrow(
                () -> new CommonException(ErrorCode.NOT_FOUND_MARKET));
        market.setName(marketDTO.getName());
        market.setField(marketDTO.getField());
        return MarketDTO.fromEntity(marketRepository.save(market));
    }

    @Override
    public void delete(Long id) {
        marketRepository.deleteById(id);
    }
}
