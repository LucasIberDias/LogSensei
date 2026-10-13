package com.logsensei.LogSensei.repository;

import com.logsensei.LogSensei.model.Carga;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CargaRepository extends JpaRepository<Carga, Long> {
    // Função para buscar os usuários que possuem o cargo FILIAL
    @Query("SELECT u.nomeUsuario FROM Usuario u WHERE u.cargo = 'FILIAL'")
    List<String> buscarUsuariosFilial();

    // Função para buscar carga onde a filial é igual ao nome do usuario
    @Query("""
                SELECT c
                FROM Carga c
                WHERE c.localSaida = :nomeUsuario
                AND c.status = 'PRÓXIMO'
            """)
    List<Carga> buscarCargasDaFilial(@Param("nomeUsuario") String nomeUsuario);
}
