package com.s3.mergewhat.market.query.service;

import com.s3.mergewhat.market.command.application.dto.MarketDTO;

import java.util.List;

public interface QueryMarketService {
    MarketDTO getById(Long id);

    List<MarketDTO> getMarketsByName(String name);
}
