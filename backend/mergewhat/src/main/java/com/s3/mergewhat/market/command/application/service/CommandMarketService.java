package com.s3.mergewhat.market.command.application.service;

import com.s3.mergewhat.market.command.application.dto.MarketDTO;

public interface CommandMarketService {
    MarketDTO create(MarketDTO marketDTO);

    MarketDTO update(Long id, MarketDTO marketDTO);

    void delete(Long id);
}
