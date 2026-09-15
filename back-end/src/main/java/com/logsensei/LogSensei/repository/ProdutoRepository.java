package com.logsensei.LogSensei.repository;

import com.logsensei.LogSensei.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    // Função para localizar o produto pelo nome
    Optional<Produto> findByNomeProduto(String nomeProduto);

    // Função para localizar o produto pelo codigo
    Optional<Produto> findByCodigoProduto(Long codigoProduto);
}