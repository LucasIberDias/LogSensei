package com.logsensei.LogSensei.repository;

import com.logsensei.LogSensei.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Função para localizar o usuario pelo nome
    Optional<Usuario> findByNomeUsuario(String nomeUsuario);

    // Função para localizar o usuario pelo id
    Optional<Usuario> findById(Long id);

    // Função para buscar todos os cargos diferentes no banco
    @Query("SELECT DISTINCT u.cargo FROM Usuario u")
    List<String> buscarCargos();
}