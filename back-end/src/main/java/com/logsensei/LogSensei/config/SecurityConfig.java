package com.logsensei.LogSensei.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.logsensei.LogSensei.security.JwtAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http

            // Desativa CSRF para a API
            .csrf(csrf -> csrf.disable())

            // Não usa sessão no servidor
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // Define quais rotas precisam de login
            .authorizeHttpRequests(auth -> auth

                // Login pode ser acessado sem token
                .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()

                // Todas as outras rotas precisam de autenticação
                .anyRequest().authenticated()
            )

            // Desativa login padrão do Spring
            .formLogin(form -> form.disable())

            // Desativa autenticação Basic
            .httpBasic(basic -> basic.disable())

            // Coloca nosso filtro JWT antes do filtro padrão
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter.class
            );

        return http.build();
    }
}