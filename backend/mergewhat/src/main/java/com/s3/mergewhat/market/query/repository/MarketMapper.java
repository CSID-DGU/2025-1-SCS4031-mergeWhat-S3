package com.s3.mergewhat.market.query.repository;

import com.s3.mergewhat.market.command.application.dto.MarketDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface MarketMapper {
    Optional<MarketDTO> selectMarketById(Long id);

    List<MarketDTO> selectMarketsByName(@Param("name") String name);
}
