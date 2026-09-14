package com.logsensei.LogSensei.repository;

import com.logsensei.LogSensei.model.Veiculo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VeiculoRepository extends JpaRepository<Veiculo, Long> {
    // Função para localizar o veiculo pela placa
    Optional<Veiculo> findByPlacaVeiculo(String placaVeiculo);
}