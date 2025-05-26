package com.s3.mergewhat.market.command.domain.vo;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ResponseMarketVO {

    private Long id;
    private String name;
    private String field;

    public ResponseMarketVO(Long id, String name, String field) {
        this.id = id;
        this.name = name;
        this.field = field;
    }

}
