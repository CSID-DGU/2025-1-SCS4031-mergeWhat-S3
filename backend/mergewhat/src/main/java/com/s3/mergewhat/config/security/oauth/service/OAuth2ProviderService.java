package com.s3.mergewhat.config.security.oauth.service;

import com.s3.mergewhat.config.security.dto.SocialUserInfo;

public interface OAuth2ProviderService {
    SocialUserInfo getUserInfo(String accessToken);
}
