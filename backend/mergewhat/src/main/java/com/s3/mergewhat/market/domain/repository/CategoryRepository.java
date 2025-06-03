package com.s3.mergewhat.market.domain.repository;

import com.s3.mergewhat.store.domain.aggregate.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

}
