package com.logsensei.LogSensei.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.logsensei.LogSensei.dto.produto.ProdutoRequestDTO;
import com.logsensei.LogSensei.service.ProdutoService;
import com.logsensei.LogSensei.model.Produto;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    // UC-GP01: Cadastrar Produto
    @PostMapping
    public ResponseEntity<Void> criarVeiculo(@RequestBody ProdutoRequestDTO request) {
        produtoService.criarProduto(request);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // UC-GP02: Listar Produtos
    @GetMapping
    public ResponseEntity<List<Produto>> listarProdutos() {
        return ResponseEntity.ok(produtoService.ListarProdutos());
    }

    // UC-GP03: Buscar Produto por Código
    @GetMapping("/codigo/{codigoProduto}")
    public ResponseEntity<Produto> buscarPorCodigo(@PathVariable Long codigoProduto) {

        return ResponseEntity.ok(produtoService.buscarProduto(codigoProduto));
    }
}