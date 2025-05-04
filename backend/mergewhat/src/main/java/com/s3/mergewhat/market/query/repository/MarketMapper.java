package com.s3.mergewhat.market.query.repository;

import com.s3.mergewhat.market.command.application.dto.MarketDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.Optional;

@Mapper
public interface MarketMapper {
    Optional<MarketDTO> selectMarketById(Long id);
}
