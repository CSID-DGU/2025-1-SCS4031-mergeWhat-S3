package com.s3.mergewhat.store.service;

import com.s3.mergewhat.store.vo.BusinessHourVO;
import com.s3.mergewhat.store.vo.RequestStoreVO;
import com.s3.mergewhat.store.vo.ResponseStoreVO;
import com.s3.mergewhat.store.vo.StoreProductVO;

import java.util.List;

public interface StoreService {

    ResponseStoreVO create(RequestStoreVO request);
    ResponseStoreVO update(Long id, RequestStoreVO request);
    ResponseStoreVO delete(Long id);

    List<ResponseStoreVO> getAllStores();
    List<ResponseStoreVO> getStoresByName(String storeName);
    List<ResponseStoreVO> getStoresByNameAndCategory(String storeName, String category);

    List<BusinessHourVO> getBusinessHours(Long id);
    List<StoreProductVO> getProducts(Long id);
}
