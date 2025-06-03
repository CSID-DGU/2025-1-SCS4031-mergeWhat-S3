package com.s3.mergewhat.storereview.command.application.service;

import com.s3.mergewhat.storereview.command.domain.vo.RequestStoreReviewVO;
import com.s3.mergewhat.storereview.command.domain.vo.ResponseStoreReviewVO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CommandStoreReviewService {

    ResponseStoreReviewVO create(RequestStoreReviewVO request, List<MultipartFile> images);

    ResponseStoreReviewVO update(Long id, RequestStoreReviewVO request);

    void delete(Long id);
}
