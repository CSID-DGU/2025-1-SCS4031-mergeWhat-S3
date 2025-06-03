package com.s3.mergewhat.config.security;

import com.s3.mergewhat.member.command.domain.aggregate.entity.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JWTUtil jwtUtil;
    private final MemberRepository memberRepository;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(httpSecurity -> httpSecurity.disable())
                .authorizeHttpRequests(auth -> auth
                        // 1. (주석 처리) 마이페이지 관련 경로는 인증 필요 - 현재는 테스트를 위해 비활성화
                        // .requestMatchers("/api/mypage/**").authenticated()

                        // 2. 모든 /api/** 경로에 대해 인증 없이 접근 허용
                        .requestMatchers("/api/**").permitAll() // 👈 이 줄이 모든 /api 요청을 허용합니다.

                        // 3. 그 외 모든 요청 (정적 리소스, 기타 등)은 인증 필요 (기본값)
                        //    개발 중 모든 요청을 허용하려면 이 부분도 .permitAll()로 변경 가능
                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        new JwtAuthenticationFilter(jwtUtil, memberRepository),
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}