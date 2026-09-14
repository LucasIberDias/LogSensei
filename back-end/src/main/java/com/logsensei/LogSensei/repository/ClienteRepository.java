package com.logsensei.LogSensei.repository;

import com.logsensei.LogSensei.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    // Função para localizar o cliente pelo codigo
    Optional<Cliente> findByCodigoCliente(Long codigoCliente);

    // Função para localizar o cliente pelo nome
    Optional<Cliente> findByNomeCliente(String nomeCliente);
}