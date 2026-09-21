package com.logsensei.LogSensei.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.logsensei.LogSensei.dto.produto.ProdutoRequestDTO;
import com.logsensei.LogSensei.service.ProdutoService;
import com.logsensei.LogSensei.model.Produto;

@RestController
@RequestMapping("/produto")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    // Criar produto
    @PostMapping
    public ResponseEntity<Void> criarVeiculo(@RequestBody ProdutoRequestDTO request) {
        produtoService.criarProduto(request);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // Buscar produto pelo codigo
    @GetMapping("/codigo/{codigoProduto}")
    public ResponseEntity<Produto> buscarPorCodigo(@PathVariable Long codigoProduto) {

        return ResponseEntity.ok(produtoService.buscarProduto(codigoProduto));
    }
}