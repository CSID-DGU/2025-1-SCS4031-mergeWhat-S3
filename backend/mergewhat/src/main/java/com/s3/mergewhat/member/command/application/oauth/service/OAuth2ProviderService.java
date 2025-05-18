package com.s3.mergewhat.member.command.application.oauth.service;

import com.s3.mergewhat.member.command.application.dto.SocialUserInfo;

public interface OAuth2ProviderService {
    SocialUserInfo getUserInfo(String accessToken);
}
