package com.s3.mergewhat.store.command.application.dto;

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
