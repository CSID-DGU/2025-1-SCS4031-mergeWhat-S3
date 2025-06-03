package com.s3.mergewhat.market.command.domain.repository;

import com.s3.mergewhat.market.command.domain.aggregate.entity.Market;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MarketRepository extends JpaRepository<Market, Long> {
}
