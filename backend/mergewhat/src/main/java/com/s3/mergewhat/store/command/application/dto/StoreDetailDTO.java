package com.s3.mergewhat.store.command.application.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StoreDetailDTO {

    private Long id;
    private Long marketId;
    private Long categoryId;
    private String name;
    private String address;
    private String contact;
    private boolean isAffiliate;

    private List<StoreImageDTO> images;
    private List<StoreProductDTO> products;
    private List<BusinessHourDTO> businessHours;
}
