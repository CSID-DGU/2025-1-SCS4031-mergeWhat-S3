package com.s3.mergewhat.storereview.query.mapper;

import com.s3.mergewhat.storereview.command.domain.vo.ResponseStoreReviewVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface QueryStoreReviewMapper {

    List<ResponseStoreReviewVO> findReviewsByStoreId(@Param("storeId") Long storeId);

}
