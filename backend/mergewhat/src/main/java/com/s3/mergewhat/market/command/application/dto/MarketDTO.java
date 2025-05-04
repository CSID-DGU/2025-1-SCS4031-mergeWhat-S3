package com.s3.mergewhat.market.command.application.dto;

import com.s3.mergewhat.market.command.domain.aggregate.entity.Market;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarketDTO {

    private Long id;

    private String name;

    private String field;

    public static MarketDTO fromEntity(Market market) {
        return MarketDTO.builder()
                .id(market.getId())
                .name(market.getName())
                .field(market.getField())
                .build();
    }


}
