package com.logsensei.LogSensei.service;

import org.springframework.stereotype.Service;

import com.logsensei.LogSensei.dto.produto.ProdutoRequestDTO;
import com.logsensei.LogSensei.model.Cliente;
import com.logsensei.LogSensei.model.Produto;
import com.logsensei.LogSensei.repository.ProdutoRepository;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    // Criar produto
    public void criarProduto(ProdutoRequestDTO request) {

        // Crio o objeto que vai receber as informações
        Produto produto = new Produto();

        // Coloco as informações
        produto.setCodigoProduto(request.getCodigoProduto());
        produto.setNomeProduto(request.getNomeProduto());
        produto.setMedidaProduto(request.getMedidaProduto());
        produto.setPesoProduto(request.getPesoProduto());

        // Verifico se o produto já tem o código em uso
        if (produtoRepository.findByCodigoProduto(produto.getCodigoProduto()).isPresent()) {
            // Código já cadastrado
            throw new RuntimeException("Já existe um produto com esse código");
        }

        // Salvo o produto
        produtoRepository.save(produto);
    }

    // Busca produto pelo codigo
    public Produto buscarProduto(Long codigoProduto){
        return produtoRepository.findByCodigoProduto(codigoProduto).orElseThrow(() ->
            new RuntimeException("Produto não possui cadastro")
        );
    }
}