package com.s3.mergewhat.storereview.query.service;

import com.s3.mergewhat.storereview.command.domain.vo.ResponseStoreReviewVO;

import java.util.List;

public interface QueryStoreReviewService {
    List<ResponseStoreReviewVO> getReviewsByStoreId(Long storeId);
}
