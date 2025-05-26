package com.s3.mergewhat.market.query.service;

import com.s3.mergewhat.market.command.application.dto.MarketDTO;
import com.s3.mergewhat.market.command.domain.vo.ResponseMarketVO;

import java.util.List;

public interface QueryMarketService {

    ResponseMarketVO getById(Long id);
    List<ResponseMarketVO> getMarketsByName(String name);
}
