package com.s3.mergewhat.market.domain.aggregate.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "entertainment")
@Getter
@NoArgsConstructor
public class Entertainment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long marketId;

    private String name;

    private Boolean isIndoor;

    private String imageUrl;

    public void setMarketId(Long marketId) {
        this.marketId = marketId;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setIsIndoor(Boolean isIndoor) {
        this.isIndoor = isIndoor;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}

