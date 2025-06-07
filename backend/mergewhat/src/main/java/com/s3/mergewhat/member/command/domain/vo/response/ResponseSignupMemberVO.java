package com.s3.mergewhat.member.command.domain.vo.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.s3.mergewhat.member.command.domain.aggregate.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResponseSignupMemberVO {

    @JsonProperty("email")
    private String email;

    @JsonProperty("nickname")
    private String nickname;

    @JsonProperty("password")
    private String password;

    @JsonProperty("profile_url")
    private String profileUrl;

    @JsonProperty("role")
    private Role role;

    @JsonProperty("biz_registration_number")
    private String bizRegistrationNumber;

    @JsonProperty("biz_registration_url")
    private String bizRegistrationUrl;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;

}
