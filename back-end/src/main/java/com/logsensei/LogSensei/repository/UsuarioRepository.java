package com.logsensei.LogSensei.repository;

import com.logsensei.LogSensei.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Função para localizar o usuario pelo nome
    Optional<Usuario> findByNomeUsuario(String nomeUsuario);
}