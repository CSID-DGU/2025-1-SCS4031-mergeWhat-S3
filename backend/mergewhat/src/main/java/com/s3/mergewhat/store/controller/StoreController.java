package com.s3.mergewhat.store.controller;

import com.s3.mergewhat.common.ResponseDTO;
import com.s3.mergewhat.store.service.StoreService;
import com.s3.mergewhat.store.vo.RequestStoreVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/stores")
public class StoreController {

    private final StoreService storeService;


    @GetMapping("/all")
    public ResponseDTO<?> getAll() {
        return ResponseDTO.ok(storeService.getAllStores());
    }

    @GetMapping("/search")
    public ResponseDTO<?> search(@RequestParam String name) {
        return ResponseDTO.ok(storeService.getStoresByName(name));
    }

    @GetMapping(value = "/search", params = {"marketName", "category"})
    public ResponseDTO<?> searchByName(@RequestParam String name, @RequestParam String category) {
        return ResponseDTO.ok(storeService.getStoresByNameAndCategory(name, category));
    }

    // 상점별 영업시간 조회
    @GetMapping("/{storeId}/business-hour")
    public ResponseDTO<?> getBusinessHours(@PathVariable Long storeId) {
        return ResponseDTO.ok(storeService.getBusinessHours(storeId));
    }

    // 상점별 판매 품목 조회
    @GetMapping("/{storeId}/products")
    public ResponseDTO<?> getStoreProducts(@PathVariable Long storeId) {
        return ResponseDTO.ok(storeService.getProducts(storeId));
    }

    @PostMapping
    public ResponseDTO<?> createStore(@RequestBody RequestStoreVO request) {
        return ResponseDTO.ok(storeService.create(request));
    }

    @PutMapping("/update/{id}")
    public ResponseDTO<?> updateStore(@PathVariable Long id, @RequestBody RequestStoreVO request) {
        return ResponseDTO.ok(storeService.update(id, request));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseDTO<?> deleteStore(@PathVariable Long id) {
        return ResponseDTO.ok(storeService.delete(id));
    }

}
