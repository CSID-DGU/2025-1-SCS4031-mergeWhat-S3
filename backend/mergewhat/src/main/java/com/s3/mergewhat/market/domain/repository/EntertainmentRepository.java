package com.s3.mergewhat.market.domain.repository;

import com.s3.mergewhat.market.domain.aggregate.entity.Entertainment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EntertainmentRepository extends JpaRepository<Entertainment, Long> {
    Optional<Entertainment> findByMarketIdAndNameAndIsIndoor(Long marketId, String name, Boolean isIndoor);
}
