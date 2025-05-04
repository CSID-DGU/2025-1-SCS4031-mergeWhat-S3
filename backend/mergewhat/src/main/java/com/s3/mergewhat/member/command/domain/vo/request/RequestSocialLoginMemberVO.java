package com.s3.mergewhat.member.command.domain.vo.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RequestSocialLoginMemberVO {

    @JsonProperty("provider")
    private String provider;

    @JsonProperty("access_token")
    private String accessToken;

}
