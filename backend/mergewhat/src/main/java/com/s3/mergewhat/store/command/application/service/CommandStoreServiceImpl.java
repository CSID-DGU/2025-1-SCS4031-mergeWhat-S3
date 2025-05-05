package com.s3.mergewhat.store.command.application.service;

import com.s3.mergewhat.store.command.application.dto.StoreDetailDTO;
import com.s3.mergewhat.store.command.domain.aggregate.entity.BusinessHour;
import com.s3.mergewhat.store.command.domain.aggregate.entity.Store;
import com.s3.mergewhat.store.command.domain.aggregate.entity.StoreImage;
import com.s3.mergewhat.store.command.domain.aggregate.entity.StoreProduct;
import com.s3.mergewhat.store.command.domain.repository.BusinessHourRepository;
import com.s3.mergewhat.store.command.domain.repository.StoreImageRepository;
import com.s3.mergewhat.store.command.domain.repository.StoreProductRepository;
import com.s3.mergewhat.store.command.domain.repository.StoreRepository;
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
    private final StoreImageRepository storeImageRepository;
    private final StoreProductRepository storeProductRepository;
    private final BusinessHourRepository businessHourRepository;

    @Override
    @Transactional
    public StoreDetailDTO create(StoreDetailDTO dto) {
        Store store = storeRepository.save(Store.builder()
                .name(dto.getName())
                .address(dto.getName())
                .contact(dto.getContact())
                .isAffiliate(dto.isAffiliate())
                .marketId(dto.getMarketId())
                .categoryId(dto.getCategoryId())
                .build());

        List<StoreImage> storeImages = dto.getImages().stream()
                .map(i -> StoreImage.builder().store(store).imageUrl(i.getImageUrl()).build())
                .toList();
        storeImageRepository.saveAll(storeImages);

        List<StoreProduct> storeProducts = dto.getProducts().stream()
                .map(p -> StoreProduct.builder().store(store).name(p.getName()).price(p.getPrice()).build())
                .toList();
        storeProductRepository.saveAll(storeProducts);

        List<BusinessHour> businessHours = dto.getBusinessHours().stream()
                .map(b -> BusinessHour.builder().store(store)
                        .day(b.getDay())
                        .openTime(b.getOpenTime())
                        .closeTime(b.getCloseTime())
                        .isClosed(b.isClosed())
                        .build())
                .toList();
        businessHourRepository.saveAll(businessHours);

        dto.setId(store.getId());
        return dto;
    }

//    @Override
//    @Transactional
//    public StoreDetailDTO update(Long id, StoreDetailDTO dto) {
//        Store store = storeRepository.findById(id).orElseThrow();
//        store.updateBasicInfo(
//                dto.getName(),
//                dto.getAddress(),
//                dto.getContact(),
//                dto.isAffiliate(),
//                dto.getMarketId(),
//                dto.getCategoryId()
//        );
//
//        storeImageRepository.deleteByStoreId(id);
//        storeProductRepository.deleteByStoreId(id);
//        businessHourRepository.deleteByStoreId(id);
//
//        return create(dto); // 재생성 방식으로 처리
//    }
//
//    @Override
//    public void delete(Long id) {
//        storeImageRepository.deleteByStoreId(id);
//        storeProductRepository.deleteByStoreId(id);
//        businessHourRepository.deleteByStoreId(id);
//        storeRepository.deleteById(id);
//    }
}
