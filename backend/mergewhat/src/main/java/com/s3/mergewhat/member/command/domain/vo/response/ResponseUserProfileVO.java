package com.s3.mergewhat.member.command.domain.vo.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResponseUserProfileVO {

    private Long id;
    private String email;
    private String nickname;
    private String profileUrl;

}
