package com.s3.mergewhat.store.command.application.service;

import com.s3.mergewhat.store.command.application.dto.StoreDetailDTO;
import com.s3.mergewhat.store.command.domain.vo.RequestStoreVO;
import com.s3.mergewhat.store.command.domain.vo.ResponseStoreVO;

public interface CommandStoreService {

    ResponseStoreVO create(RequestStoreVO request);

    ResponseStoreVO update(Long id, RequestStoreVO request);

    ResponseStoreVO delete(Long id);
}
