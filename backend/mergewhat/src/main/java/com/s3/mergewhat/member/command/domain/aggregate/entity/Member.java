package com.s3.mergewhat.member.command.domain.aggregate.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

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


}
