package com.s3.mergewhat.store.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ResponseProductVO {

    private Long id;

    @JsonProperty("store_id")
    private Long storeId;

    private String name;

    private String price;

}
