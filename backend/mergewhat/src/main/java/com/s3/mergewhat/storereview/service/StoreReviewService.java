package com.s3.mergewhat.storereview.service;

import com.s3.mergewhat.storereview.vo.RequestStoreReviewVO;
import com.s3.mergewhat.storereview.vo.ResponseStoreReviewVO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface StoreReviewService {

    ResponseStoreReviewVO create(RequestStoreReviewVO request, List<MultipartFile> images);

    ResponseStoreReviewVO update(Long id, RequestStoreReviewVO request);

    void delete(Long id);

    List<ResponseStoreReviewVO> getReviewByStoreId(Long storeId);
}
