package com.s3.mergewhat.storereview.query.controller;

import com.s3.mergewhat.common.ResponseDTO;
import com.s3.mergewhat.storereview.query.service.QueryStoreReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class QueryStoreReviewController {

    private final QueryStoreReviewService queryStoreReviewService;

    @GetMapping("/store/{store_id}")
    public ResponseDTO<?> getReviewsByStore(@PathVariable("store_id") Long storeId) {
        return ResponseDTO.ok(queryStoreReviewService.getReviewsByStoreId(storeId));
    }

}
