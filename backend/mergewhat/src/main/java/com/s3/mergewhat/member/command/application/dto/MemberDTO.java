package com.s3.mergewhat.member.command.application.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class MemberDTO {

    private Long id;
    private String email;
    private String nickname;
    private String password;
    private String profileUrl;
    private String role;
    private String bizRegistrationNumber;
    private String bizRegistrationUrl;
    private LocalDateTime createdAt;

    public void encodedPwd(String encodedPwd) {
        this.password = encodedPwd;
    }

}
