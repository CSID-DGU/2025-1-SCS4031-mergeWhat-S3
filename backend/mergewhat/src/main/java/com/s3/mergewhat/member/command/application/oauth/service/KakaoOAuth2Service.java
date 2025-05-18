package com.s3.mergewhat.member.command.application.oauth.service;

import com.s3.mergewhat.member.command.application.dto.SocialUserInfo;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service("kakaoOAuth2Service")
public class KakaoOAuth2Service implements OAuth2ProviderService {

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public SocialUserInfo getUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(
                "https://kapi.kakao.com/v2/user/me",
                HttpMethod.GET,
                request,
                Map.class
        );

        Map<String, Object> body = response.getBody();
        if (body == null) {
            throw new IllegalArgumentException("카카오 사용자 정보를 불러올 수 없습니다");
        }

        Map<String, Object> kakaoAccount = (Map<String, Object>) body.get("kakao_account");
        Map<String, Object> profile = (Map<String, Object>) kakaoAccount.get("profile");

        String id = String.valueOf(body.get("id"));
        String email = (String) kakaoAccount.get("email");
        String nickname = (String) profile.get("nickname");
        String profileImage = (String) profile.get("profile_image_url");

        return new SocialUserInfo(id, email, nickname, profileImage);
    }
}
