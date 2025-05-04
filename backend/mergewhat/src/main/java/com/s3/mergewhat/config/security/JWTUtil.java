package com.s3.mergewhat.config.security;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import java.security.Key;

@Slf4j
@Component
public class JWTUtil {

    private final Key key;

    public JWTUtil(@Value("${jwt.secret-key}") String secret) {
        try {
            byte[] byteSecretKey = Decoders.BASE64.decode(secret);
            key = Keys.hmacShaKeyFor(byteSecretKey);
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize JWTUtil with secret key: " + secret, e);
        }
    }
}
