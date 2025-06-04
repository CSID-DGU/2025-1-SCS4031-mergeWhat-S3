package com.s3.mergewhat.post.domain.aggregate;

import com.s3.mergewhat.member.command.domain.aggregate.entity.Member;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "post")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Member member;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "board_type", nullable = false)
    private BoardType boardType;

    @OneToMany(mappedBy = "post")
    private List<PostImage> postImages = new ArrayList<>();

    public void update(String title, String content) {
        if (title != null && !title.equals(this.title)) {
            this.title = title;
        }
        if (content != null && !content.equals(this.content)) {
            this.content = content;
        }
    }
}
