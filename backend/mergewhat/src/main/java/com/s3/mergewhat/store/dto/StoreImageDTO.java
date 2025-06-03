package com.s3.mergewhat.store.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreImageDTO {
    private Long id;
    private Long storeId;
    private String imageUrl;
}
