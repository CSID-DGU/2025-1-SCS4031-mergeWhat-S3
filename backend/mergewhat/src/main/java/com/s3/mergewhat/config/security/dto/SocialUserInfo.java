package com.s3.mergewhat.config.security.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class SocialUserInfo {

    private String socialId;
    private String email;
    private String name;
    private String profileImage;

}
