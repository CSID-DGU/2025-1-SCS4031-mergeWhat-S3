package com.s3.mergewhat.market.query.repository;

import com.s3.mergewhat.market.command.application.dto.MarketDTO;
import com.s3.mergewhat.market.command.domain.vo.ResponseMarketVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface MarketMapper {
    Optional<ResponseMarketVO> selectMarketById(Long id);

    List<ResponseMarketVO> selectMarketsByName(@Param("name") String name);
}
