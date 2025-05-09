package com.s3.mergewhat.store.query.service;

import com.s3.mergewhat.store.command.application.dto.StoreDetailDTO;

import java.util.List;

public interface QueryStoreService {


    StoreDetailDTO getStoreDetail(Long id);

    List<StoreDetailDTO> getStoresByName(String name, int limit, int offset);
}
