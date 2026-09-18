package com.logsensei.LogSensei.security;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    private final SecretKey secretKey;

    private final long expiration = 1000 * 60 * 60 * 8; // 8 horas

    public JwtService(@Value("${JWT_SECRET}") String jwtSecret) {

        // Converte a chave para o formato usado pelo JWT
        this.secretKey = Keys.hmacShaKeyFor(
            jwtSecret.getBytes(StandardCharsets.UTF_8)
        );
    }

    public String gerarToken(Long idUsuario, String nomeUsuario) {

        return Jwts.builder()
                .subject(nomeUsuario)
                .claim("idUsuario", idUsuario)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(secretKey)
                .compact();
    }

    public String getNomeUsuario(String token) {

        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }
}