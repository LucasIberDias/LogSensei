package com.logsensei.LogSensei.config;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class GerarSenha {

    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        String senha = "12345678";

        System.out.println(encoder.encode(senha));
    }
}