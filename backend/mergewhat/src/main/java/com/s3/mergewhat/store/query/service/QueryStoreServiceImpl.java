package com.s3.mergewhat.store.query.service;

import com.s3.mergewhat.store.command.application.dto.StoreDetailDTO;
import com.s3.mergewhat.store.query.mapper.QueryStoreMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class QueryStoreServiceImpl implements QueryStoreService {

    private final QueryStoreMapper queryStoreMapper;

    @Override
    public StoreDetailDTO getStoreDetail(Long id) {
        return null;
    }

    @Override
    public List<StoreDetailDTO> getStoresByName(String name, int limit, int offset) {
        return queryStoreMapper.selectStoreDetailsByName(name, limit, offset);
    }


}
