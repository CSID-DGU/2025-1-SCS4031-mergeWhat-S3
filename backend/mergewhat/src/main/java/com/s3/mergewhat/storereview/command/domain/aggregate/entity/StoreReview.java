package com.s3.mergewhat.storereview.command.domain.aggregate.entity;

import com.s3.mergewhat.member.command.domain.aggregate.entity.Member;
import com.s3.mergewhat.store.command.domain.aggregate.entity.Store;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "store_review")
@Getter
@Builder
public class StoreReview {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "store_id", nullable = false)
    private Store store;

    @Min(1)
    @Max(5)
    @Column(name = "rating", nullable = false)
    private Integer rating;

    @Column(name = "comment", nullable = false, columnDefinition = "TEXT")
    private String comment;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public void update(Integer rating, String comment) {
        if (rating != null && rating >= 1 && rating <= 5) {
            this.rating = rating;
        }
        if (comment != null && !comment.isBlank()) {
            this.comment = comment;
        }
    }

}
