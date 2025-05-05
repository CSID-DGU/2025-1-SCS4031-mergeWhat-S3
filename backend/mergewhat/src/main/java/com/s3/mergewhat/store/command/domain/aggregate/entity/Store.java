package com.s3.mergewhat.store.command.domain.aggregate.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "store")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Store {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String address;
    private String contact;

    @Column(name = "is_affiliate")
    private Boolean isAffiliate;

    @Column(name = "market_id")
    private Long marketId;

    @Column(name = "category_id")
    private Long categoryId;

    public void updateBasicInfo(String name, String address, String contact,
                                boolean isAffiliate, Long marketId, Long categoryId) {
        this.name = name;
        this.address = address;
        this.contact = contact;
        this.isAffiliate = isAffiliate;
        this.marketId = marketId;
        this.categoryId = categoryId;
    }
}
