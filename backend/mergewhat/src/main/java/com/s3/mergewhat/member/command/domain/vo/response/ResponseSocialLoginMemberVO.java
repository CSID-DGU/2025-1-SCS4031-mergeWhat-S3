package com.s3.mergewhat.member.command.domain.vo.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponseSocialLoginMemberVO {

    @JsonProperty("access_token")
    private String accessToken;

}
