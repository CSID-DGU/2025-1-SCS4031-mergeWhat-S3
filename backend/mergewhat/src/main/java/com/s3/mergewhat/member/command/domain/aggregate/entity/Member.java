package com.s3.mergewhat.member.command.domain.aggregate.entity;

import com.s3.mergewhat.post.domain.aggregate.Post;
import com.s3.mergewhat.storereview.domain.aggregate.entity.StoreReview;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
@Table(name = "member")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "nickname", nullable = false)
    private String nickname;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "profile_url", nullable = true)
    private String profileUrl;

    @Column(name = "role", nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "biz_registration_number", nullable = true)
    private String bizRegistrationNumber;

    @Column(name = "biz_registration_url", nullable = true)
    private String bizRegistrationUrl;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime cratedAt;

    @Column(name = "social_type", nullable = false)
    private String socialType;

    @Column(name = "social_id", nullable = false)
    private String socialId;

    @Column(name = "is_social", nullable = false)
    private boolean isSocial;

    @OneToMany(mappedBy = "member")
    private List<Post> posts;

    @OneToMany(mappedBy = "member")
    private List<StoreReview> reviews;


    public void updateSocialInfo(String nickname, String profileUrl, String socialType, String socialId) {
        if (nickname != null) this.nickname = nickname;
        if (profileUrl != null) this.profileUrl = profileUrl;
        this.socialType = socialType;
        this.socialId = socialId;
    }

}
