package com.s3.mergewhat.store.service;

import com.s3.mergewhat.store.domain.repository.KeywordRepository;
import com.s3.mergewhat.store.dto.KeywordResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KeywordService {
    private final KeywordRepository keywordRepository;

    public List<KeywordResponseDTO> getKeywordsByStoreId(Long storeId) {
        return keywordRepository.findByStoreId(storeId).stream()
                .map(k -> new KeywordResponseDTO(k.getKeyword(), k.getFrequency()))
                .collect(Collectors.toList());
    }
}
