package com.s3.mergewhat.store.command.application.service;

import com.s3.mergewhat.store.command.application.dto.StoreDetailDTO;

public interface CommandStoreService {

    StoreDetailDTO create(StoreDetailDTO dto);

//    StoreDetailDTO update(Long id, StoreDetailDTO dto);
//
//    void delete(Long id);
}
