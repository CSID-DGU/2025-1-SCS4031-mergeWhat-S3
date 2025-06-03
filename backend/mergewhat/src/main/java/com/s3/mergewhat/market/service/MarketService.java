package com.s3.mergewhat.market.service;

import com.s3.mergewhat.market.vo.ResponseMarketVO;

import java.util.List;

public interface MarketService {

    ResponseMarketVO createMarket(String name, String field);
    ResponseMarketVO deleteMarket(Long id);
    ResponseMarketVO updateMarket(Long id, String name, String field);

    List<ResponseMarketVO> findAllMarkets();
    List<ResponseMarketVO> getMarketsByName(String name);
    ResponseMarketVO getById(Long id);
}
