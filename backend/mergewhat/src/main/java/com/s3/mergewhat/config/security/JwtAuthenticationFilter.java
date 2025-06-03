package com.s3.mergewhat.config.security;

import com.s3.mergewhat.member.command.domain.aggregate.entity.Member;
import com.s3.mergewhat.member.command.domain.aggregate.entity.repository.MemberRepository;
import com.s3.mergewhat.member.security.CustomUserDetails;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;
    private final MemberRepository memberRepository;

    public JwtAuthenticationFilter(JWTUtil jwtUtil, MemberRepository memberRepository) {
        this.jwtUtil = jwtUtil;
        this.memberRepository = memberRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 디버깅을 위한 로그 추가
        System.out.println("🚀 JwtAuthenticationFilter: doFilterInternal called for URI: " + request.getRequestURI());

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                Long userId = jwtUtil.getUserIdFromToken(token);
                // userId가 null일 수 있는 경우도 고려해야 합니다 (예: 토큰이 유효하지 않거나 사용자 ID를 파싱할 수 없을 때)
                if (userId != null) {
                    Member member = memberRepository.findById(userId).orElse(null);

                    if (member != null) {
                        CustomUserDetails userDetails = new CustomUserDetails(member);
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        System.out.println("✅ JwtAuthenticationFilter: User authenticated: " + member.getNickname());
                    } else {
                        System.out.println("⚠️ JwtAuthenticationFilter: Member not found for userId: " + userId);
                    }
                } else {
                    System.out.println("⚠️ JwtAuthenticationFilter: User ID is null from token.");
                }
            } catch (Exception e) {
                // 토큰 파싱 또는 사용자 조회 중 예외 발생
                System.err.println("❌ JwtAuthenticationFilter: Token validation failed: " + e.getMessage());
                // (선택 사항) 여기에 response.setStatus(HttpServletResponse.SC_UNAUTHORIZED) 등을 추가하여
                // 인증 실패 시 명확한 HTTP 상태 코드를 반환할 수 있습니다.
                // 하지만 현재 목표는 permitAll() 경로에 대한 접근이므로, 그냥 다음 필터로 넘기는 것이 좋습니다.
            }
        } else {
            System.out.println("ℹ️ JwtAuthenticationFilter: No valid Authorization header found for URI: " + request.getRequestURI());
        }

        // ⭐ 이 줄이 가장 중요합니다! 무조건 다음 필터 체인으로 요청을 넘겨야 합니다.
        filterChain.doFilter(request, response);
        System.out.println("🎉 JwtAuthenticationFilter: doFilterInternal finished for URI: " + request.getRequestURI());
    }
}