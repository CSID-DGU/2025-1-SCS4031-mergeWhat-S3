package com.s3.mergewhat.store.command.domain.aggregate.entity;

import com.s3.mergewhat.market.command.domain.aggregate.entity.Market;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "market_id", nullable = false)
    private Market market;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private String contact;

    @Column(name = "is_affiliate", nullable = false)
    private Boolean isAffiliate;

    @Column(name = "indoor_name", nullable = false)
    private String indoorName;

//    @OneToMany(mappedBy = "store", cascade = CascadeType.ALL)
//    private List<StoreImage> storeImages;

    public void update(Market market, Category category, String name, String address,
                       String contact, Boolean isAffiliate, String indoorName ) {

        if (market != null && !market.equals(this.market)) this.market = market;
        if (category != null && !category.equals(this.category)) this.category = category;
        if (name != null && !name.equals(this.name)) this.name = name;
        if (address != null && !address.equals(this.address)) this.address = address;
        if (contact != null && !contact.equals(this.contact)) this.contact = contact;
        if (this.isAffiliate != isAffiliate) this.isAffiliate = isAffiliate;
        if (indoorName != null && !indoorName.equals(this.indoorName)) this.indoorName = indoorName;
    }
}
