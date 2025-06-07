package com.s3.mergewhat.store.vo;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.s3.mergewhat.store.domain.aggregate.entity.BusinessHour;
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

    public static BusinessHourVO fromEntity(BusinessHour businessHour) {
        return new BusinessHourVO(
                businessHour.getId(),
                businessHour.getStore().getId(),
                businessHour.getDay().toString(),
                businessHour.getOpenTime().toString().substring(0, 5),
                businessHour.getCloseTime().toString().substring(0, 5),
                businessHour.isClosed()
        );
    }
}
