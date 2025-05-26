package com.s3.mergewhat.store.command.application.service;

import com.s3.mergewhat.common.exception.CommonException;
import com.s3.mergewhat.common.exception.ErrorCode;
import com.s3.mergewhat.market.command.domain.aggregate.entity.Market;
import com.s3.mergewhat.market.command.domain.repository.CategoryRepository;
import com.s3.mergewhat.market.command.domain.repository.MarketRepository;
import com.s3.mergewhat.store.command.application.dto.StoreDetailDTO;
import com.s3.mergewhat.store.command.domain.aggregate.entity.*;
import com.s3.mergewhat.store.command.domain.repository.BusinessHourRepository;
import com.s3.mergewhat.store.command.domain.repository.StoreImageRepository;
import com.s3.mergewhat.store.command.domain.repository.StoreProductRepository;
import com.s3.mergewhat.store.command.domain.repository.StoreRepository;
import com.s3.mergewhat.store.command.domain.vo.RequestStoreVO;
import com.s3.mergewhat.store.command.domain.vo.ResponseStoreVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class CommandStoreServiceImpl implements CommandStoreService {

    private final StoreRepository storeRepository;
    private final MarketRepository marketRepository;
    private final CategoryRepository categoryRepository;

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
