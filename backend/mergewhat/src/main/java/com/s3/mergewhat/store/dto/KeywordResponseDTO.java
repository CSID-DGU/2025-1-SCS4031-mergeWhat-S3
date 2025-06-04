package com.s3.mergewhat.store.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class KeywordResponseDTO {
    private String keyword;
    private int frequency;
}
