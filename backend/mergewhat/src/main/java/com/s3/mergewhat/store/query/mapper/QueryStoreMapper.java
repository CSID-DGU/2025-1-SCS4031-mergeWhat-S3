package com.s3.mergewhat.store.query.mapper;

import com.s3.mergewhat.store.command.application.dto.StoreDetailDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface QueryStoreMapper {
    List<StoreDetailDTO> selectStoreDetailsByName(@Param("name") String name,
                                                  @Param("limit") int limit,
                                                  @Param("offset") int offset);
}
