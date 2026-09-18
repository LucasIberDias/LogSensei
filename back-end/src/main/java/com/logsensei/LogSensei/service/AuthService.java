package com.logsensei.LogSensei.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.logsensei.LogSensei.dto.login.LoginRequestDTO;
import com.logsensei.LogSensei.dto.login.LoginResponseDTO;
import com.logsensei.LogSensei.model.Usuario;
import com.logsensei.LogSensei.repository.UsuarioRepository;
import com.logsensei.LogSensei.security.JwtService;

@Service
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService) {

        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    // Login de usuario
    public LoginResponseDTO login(LoginRequestDTO request) {

        // Pega o usuario se ele existir pelo nome
        Usuario usuario = usuarioRepository
                .findByNomeUsuario(request.getNomeUsuario().toLowerCase())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Verifica se as senhas batem
        if (!passwordEncoder.matches(
                request.getSenhaUsuario(),
                usuario.getSenhaUsuario())) {

            throw new RuntimeException("Senha incorreta");
        }

        // Chama o sjwtService e cria o token do usuario
        String token = jwtService.gerarToken(
                usuario.getIdUsuario(),
                usuario.getNomeUsuario());

        // Retorna o usuario e seu token
        return new LoginResponseDTO(
                usuario.getIdUsuario(),
                usuario.getNomeUsuario(),
                token
        );
    }
}