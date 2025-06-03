package com.s3.mergewhat.store.service;

import com.s3.mergewhat.common.exception.CommonException;
import com.s3.mergewhat.common.exception.ErrorCode;
import com.s3.mergewhat.market.domain.aggregate.entity.Market;
import com.s3.mergewhat.market.domain.repository.CategoryRepository;
import com.s3.mergewhat.market.domain.repository.MarketRepository;
import com.s3.mergewhat.store.domain.aggregate.entity.Category;
import com.s3.mergewhat.store.domain.aggregate.entity.Store;
import com.s3.mergewhat.store.domain.repository.BusinessHourRepository;
import com.s3.mergewhat.store.domain.repository.StoreProductRepository;
import com.s3.mergewhat.store.domain.repository.StoreRepository;
import com.s3.mergewhat.store.vo.BusinessHourVO;
import com.s3.mergewhat.store.vo.RequestStoreVO;
import com.s3.mergewhat.store.vo.ResponseStoreVO;
import com.s3.mergewhat.store.vo.StoreProductVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;


@Service
@Slf4j
@RequiredArgsConstructor
public class StoreServiceImpl implements StoreService {

    private final StoreRepository storeRepository;
    private final MarketRepository marketRepository;
    private final CategoryRepository categoryRepository;
    private final BusinessHourRepository businessHourRepository;
    private final StoreProductRepository storeProductRepository;

    // 전체 상점 조회
    @Override
    public List<ResponseStoreVO> getAllStores() {
        return storeRepository.findAllWithMarketAndCategory()
                .stream().map(this::toVO).toList();
    }

    // 이름으로 상점 조회
    @Override
    public List<ResponseStoreVO> getStoresByName(String storeName) {
        return storeRepository.findByNameContainingWithJoin(storeName)
                .stream().map(this::toVO).toList();
    }

    // 이름과 카테고리로 검색
    @Override
    public List<ResponseStoreVO> getStoresByNameAndCategory(String storeName, String category) {
        return storeRepository.findByNameAndCategory(storeName, category)
                .stream().map(this::toVO).toList();
    }

    // 영업 시간 조회
    @Override
    public List<BusinessHourVO> getBusinessHours(Long id) {
        return businessHourRepository.findByStoreId(id)
                .stream().map(BusinessHourVO::fromEntity).toList();
    }

    // 상점별 품목 조회
    @Override
    public List<StoreProductVO> getProducts(Long id) {
        return storeProductRepository.findByStoreId(id)
                .stream().map(StoreProductVO::fromEntity).toList();
    }

    @Override
    @Transactional
    public ResponseStoreVO create(RequestStoreVO request) {

        Market market = marketRepository.findById(request.getMarketId())
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_MARKET));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_CATEGORY));

        Store store = Store.builder()
                .market(market)
                .category(category)
                .name(request.getName())
                .address(request.getAddress())
                .contact(request.getContact())
                .isAffiliate(request.isAffiliate())
                .indoorName(request.getIndoorName())
                .build();

        storeRepository.save(store);

        return toVO(store);
    }

    @Override
    @Transactional
    public ResponseStoreVO update(Long id, RequestStoreVO request) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_STORE));

        Market market = marketRepository.findById(request.getMarketId())
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_MARKET));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_CATEGORY));

        store.update(
                market,
                category,
                request.getName(),
                request.getAddress(),
                request.getContact(),
                request.isAffiliate(),
                request.getIndoorName()
        );
        return toVO(store);
    }

    @Override
    @Transactional
    public ResponseStoreVO delete(Long id) {
        Store store = storeRepository.findById(id)
                .orElseThrow(() -> new CommonException(ErrorCode.NOT_FOUND_STORE));
        storeRepository.delete(store);
        return toVO(store);
    }

    private ResponseStoreVO toVO(Store store) {
        return new ResponseStoreVO(
                store.getId(),
                store.getMarket().getId(),
                store.getCategory().getId(),
                store.getName(),
                store.getAddress(),
                store.getContact(),
                store.getIsAffiliate(),
                store.getIndoorName()
        );
    }

}
