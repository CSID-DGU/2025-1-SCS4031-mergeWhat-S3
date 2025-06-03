package com.s3.mergewhat.market.domain.repository;

import com.s3.mergewhat.market.domain.aggregate.entity.Market;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MarketRepository extends JpaRepository<Market, Long> {
    List<Market> findByNameContaining(String name);
}
