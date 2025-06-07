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
                        // 개발 편의를 위한 모든 api 접근 허용
                        // .requestMatchers("/api/mypage/**").authenticated()

                        .requestMatchers("/api/**").permitAll()

                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        new JwtAuthenticationFilter(jwtUtil, memberRepository),
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}