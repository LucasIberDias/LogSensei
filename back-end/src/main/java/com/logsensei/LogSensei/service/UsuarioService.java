package com.logsensei.LogSensei.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.logsensei.LogSensei.dto.usuario.UsuarioRequestDTO;
import com.logsensei.LogSensei.model.Usuario;
import com.logsensei.LogSensei.repository.UsuarioRepository;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository usuarioRepository, BCryptPasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // UC-GU01: Cadastrar Usuarios
    public void cadastrarUsuario(UsuarioRequestDTO request, Long idUsuario) {
        // Verifico se o usuario tem permissão para cadastrar Usuario
        if (!usuarioRepository.findById(idUsuario).get().getCargo().equals("GERENTE LOGISTICA")) {
            throw new RuntimeException("Você não tem permissão para cadastrar um usuário");
        }

        // Crio o objeto Usuario que irá receber os dados
        Usuario usuario = new Usuario();

        // Coloco as informações passadas no usuario
        usuario.setNomeUsuario(request.getNomeUsuario());

        // Criptografo a senha e coloco no objeto
        usuario.setSenhaUsuario(passwordEncoder.encode(request.getSenhaUsuario()));

        usuario.setCargo(request.getCargo());

        // Salvo no banco o usuário criado
        usuarioRepository.save(usuario);
    }

    // UC-GU02: Listar Usuarios
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    // UC-GU04: Buscar Cargos
    public List<String> buscarCargos() {
        return usuarioRepository.buscarCargos();
    }
}