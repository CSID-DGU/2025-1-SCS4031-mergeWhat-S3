package com.s3.mergewhat.store.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RequestStoreVO {

    @JsonProperty("market_id")
    private Long marketId;

    @JsonProperty("category_id")
    private Long categoryId;

    private String name;

    private String address;

    private String contact;

    @JsonProperty("is_affiliate")
    private boolean isAffiliate;

    @JsonProperty("indoor_name")
    private String indoorName;

}
