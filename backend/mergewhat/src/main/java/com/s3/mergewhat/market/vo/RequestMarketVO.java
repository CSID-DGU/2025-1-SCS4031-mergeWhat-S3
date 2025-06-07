package com.s3.mergewhat.market.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class RequestMarketVO {

    private String name;
    private String field;

}
