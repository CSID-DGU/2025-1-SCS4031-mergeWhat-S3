package com.s3.mergewhat.market.query.service;

import com.s3.mergewhat.common.exception.CommonException;
import com.s3.mergewhat.common.exception.ErrorCode;
import com.s3.mergewhat.market.command.application.dto.MarketDTO;
import com.s3.mergewhat.market.command.domain.repository.MarketRepository;
import com.s3.mergewhat.market.query.repository.MarketMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QueryMarketServiceImpl implements QueryMarketService {

    private final MarketMapper marketMapper;

    @Override
    public MarketDTO getById(Long id) {
        return marketMapper.selectMarketById(id)
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_MARKET));
    }
}
