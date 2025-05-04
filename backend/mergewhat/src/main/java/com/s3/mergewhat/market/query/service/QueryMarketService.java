package com.s3.mergewhat.market.query.service;

import com.s3.mergewhat.market.command.application.dto.MarketDTO;

public interface QueryMarketService {
    MarketDTO getById(Long id);
}
