package com.s3.mergewhat.storereview.controller;

import com.s3.mergewhat.common.ResponseDTO;
import com.s3.mergewhat.storereview.service.StoreReviewService;
import com.s3.mergewhat.storereview.vo.RequestStoreReviewVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final StoreReviewService storeReviewService;

    // 상점별 리뷰 조회
    @GetMapping("/store/{store_id}")
    public ResponseDTO<?> getReviewsByStoreId(@PathVariable("store_id") long storeId) {
        return ResponseDTO.ok(storeReviewService.getReviewByStoreId(storeId));
    }

    // 작성
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseDTO<?> createReview(@RequestPart RequestStoreReviewVO request,
                                       @RequestPart List<MultipartFile> images) {
        return ResponseDTO.ok(storeReviewService.create(request, images));
    }

    @PutMapping("/{id}")
    public ResponseDTO<?> updateReview(@RequestBody RequestStoreReviewVO request, @PathVariable Long id) {
        return ResponseDTO.ok(storeReviewService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseDTO<?> deleteReview(@PathVariable Long id) {
        storeReviewService.delete(id);
        return ResponseDTO.ok(null);
    }


}
