package com.s3.mergewhat.store.query.controller;

import com.s3.mergewhat.common.ResponseDTO;
import com.s3.mergewhat.store.query.mapper.QueryStoreMapper;
import com.s3.mergewhat.store.query.service.QueryStoreService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/stores")
public class QueryStoreController {

    private final QueryStoreMapper queryStoreMapper;

    // 전체 조회
    @GetMapping("/all")
    public ResponseDTO<?> getAllStores() {
        return ResponseDTO.ok(queryStoreMapper.findAllStores());
    }

    // 상점 이름으로 조회
    @GetMapping("/search")
    public ResponseDTO<?> getStoresByName(@RequestParam String name) {
        return ResponseDTO.ok(queryStoreMapper.findStoresByName(name));
    }

    // 상점별 영업시간 조회
    @GetMapping("/{id}/business-hour")
    public ResponseDTO<?> getBusinessHour(@PathVariable Long id) {
        return ResponseDTO.ok(queryStoreMapper.findBusinessHoursById(id));
    }

    // 상점별 카테고리 필터
    @GetMapping("/search/filter")
    public ResponseDTO<?> getStoresByNameAndCategory(@RequestParam String name, @RequestParam String category) {
        return ResponseDTO.ok(queryStoreMapper.findStoresByNameAndCategory(name, category));
    }

    // 상점별 상품 목록 조회
    @GetMapping("/{id}/products")
    public ResponseDTO<?> getProducts(@PathVariable Long id) {
        return ResponseDTO.ok(queryStoreMapper.findProductsById(id));
    }




}
