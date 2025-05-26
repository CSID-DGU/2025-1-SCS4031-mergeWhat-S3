package com.s3.mergewhat.market.command.application.service;

import com.s3.mergewhat.market.command.application.dto.MarketDTO;
import com.s3.mergewhat.market.command.domain.vo.ResponseMarketVO;

public interface CommandMarketService {

    ResponseMarketVO createMarket(String name, String field);
    ResponseMarketVO deleteMarket(Long id);
    ResponseMarketVO updateMarket(Long id, String name, String field);

}
