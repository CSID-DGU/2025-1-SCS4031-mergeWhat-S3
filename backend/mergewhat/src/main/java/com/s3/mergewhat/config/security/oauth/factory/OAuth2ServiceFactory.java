package com.s3.mergewhat.config.security.oauth.factory;

import com.s3.mergewhat.config.security.oauth.service.OAuth2ProviderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class OAuth2ServiceFactory {

    private final Map<String, OAuth2ProviderService> serviceMap;

    public OAuth2ProviderService getService(String provider) {
        return switch (provider.toLowerCase()) {
            case "kakao" -> serviceMap.get("kakaoOAuth2Service");
            case "naver" -> serviceMap.get("naverOAuth2Service");
            case "google" -> serviceMap.get("googleOAuth2Service");
            default -> throw new IllegalArgumentException("지원하지 않는 소셜 로그인입니다: " + provider);
        };
    }

}
