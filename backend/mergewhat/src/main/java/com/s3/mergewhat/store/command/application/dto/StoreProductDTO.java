package com.s3.mergewhat.store.command.application.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreProductDTO {
    private Long id;
    private Long storeId;
    private String name;
    private String price;

}
