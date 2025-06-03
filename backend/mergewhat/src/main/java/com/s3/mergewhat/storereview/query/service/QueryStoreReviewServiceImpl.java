package com.s3.mergewhat.storereview.query.service;

import com.s3.mergewhat.storereview.command.domain.vo.ResponseStoreReviewVO;
import com.s3.mergewhat.storereview.query.mapper.QueryStoreReviewMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QueryStoreReviewServiceImpl implements QueryStoreReviewService {

    private final QueryStoreReviewMapper queryStoreReviewMapper;

    @Override
    public List<ResponseStoreReviewVO> getReviewsByStoreId(Long storeId) {
        return queryStoreReviewMapper.findReviewsByStoreId(storeId);
    }
}
