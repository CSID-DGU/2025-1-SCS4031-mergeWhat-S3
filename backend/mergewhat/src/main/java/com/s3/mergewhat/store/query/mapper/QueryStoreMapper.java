package com.s3.mergewhat.store.query.mapper;

import com.s3.mergewhat.store.command.application.dto.BusinessHourDTO;
import com.s3.mergewhat.store.command.application.dto.StoreDetailDTO;
import com.s3.mergewhat.store.command.domain.vo.ResponseProductVO;
import com.s3.mergewhat.store.command.domain.vo.ResponseStoreVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface QueryStoreMapper {

    List<ResponseStoreVO> findAllStores();
    List<ResponseStoreVO> findStoresByName(@Param("name") String name);
    List<ResponseStoreVO> findStoresByNameAndCategory(@Param("name") String name, @Param("category") String category);
    BusinessHourDTO findBusinessHoursById(Long id);
    List<ResponseProductVO>findProductsById(Long storeId);
}
