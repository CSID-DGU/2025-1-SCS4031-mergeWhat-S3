package com.s3.mergewhat.market.domain.aggregate.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "market")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Market {

    public void update(String name, String field) {
        this.name = name;
        this.field = field;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String field;
}
