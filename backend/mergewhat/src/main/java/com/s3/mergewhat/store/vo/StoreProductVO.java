package com.s3.mergewhat.store.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.s3.mergewhat.store.domain.aggregate.entity.StoreProduct;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class StoreProductVO {
    @JsonProperty("product_id")
    private Long id;

    @JsonProperty("product_name")
    private String name;

    @JsonProperty("product_price")
    private String price;

    public static StoreProductVO fromEntity(StoreProduct product) {
        return new StoreProductVO(
                product.getId(),
                product.getName(),
                product.getPrice()
        );
    }
}

