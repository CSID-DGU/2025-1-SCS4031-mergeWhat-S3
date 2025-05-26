package com.s3.mergewhat.market.command.domain.repository;

import com.s3.mergewhat.store.command.domain.aggregate.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

}
