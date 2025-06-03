package com.s3.mergewhat.market.query.service;

import com.s3.mergewhat.common.exception.CommonException;
import com.s3.mergewhat.common.exception.ErrorCode;
import com.s3.mergewhat.market.command.domain.vo.ResponseMarketVO;
import com.s3.mergewhat.market.query.mapper.MarketMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QueryMarketServiceImpl implements QueryMarketService {

    private final MarketMapper marketMapper;

    @Override
    public ResponseMarketVO getById(Long id) {
        return marketMapper.selectMarketById(id)
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_MARKET));
    }

    @Override
    public List<ResponseMarketVO> getMarketsByName(String name) {
        return marketMapper.selectMarketsByName(name);
    }
}
