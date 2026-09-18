package com.logsensei.LogSensei.repository;

import com.logsensei.LogSensei.model.ControleCarregamento;
import com.logsensei.LogSensei.model.Carga;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ControleCarregamentoRepository extends JpaRepository<ControleCarregamento, Long> {
    // Verifica se já existe o controle pela carga dele
    boolean existsByCarga(Carga carga);
}