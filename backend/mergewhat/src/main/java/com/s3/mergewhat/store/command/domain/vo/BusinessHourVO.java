package com.s3.mergewhat.store.command.domain.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BusinessHourVO {

    private Long id;

    @JsonProperty("store_id")
    private Long storeId;

    private String day;

    @JsonProperty("open_time")
    private String openTime;

    @JsonProperty("close_time")
    private String closeTime;

    @JsonProperty("is_closed")
    private Boolean isClosed;

}
