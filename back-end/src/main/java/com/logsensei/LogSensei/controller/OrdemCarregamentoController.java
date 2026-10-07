package com.logsensei.LogSensei.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.logsensei.LogSensei.dto.ordemCarregamento.OrdemCarregamentoRequestDTO;
import com.logsensei.LogSensei.service.OrdemCarregamentoService;

@RestController
@RequestMapping("/ordemCarregamento")
public class OrdemCarregamentoController {
    private final OrdemCarregamentoService ordemCarregamentoService;

    public OrdemCarregamentoController(OrdemCarregamentoService ordemCarregamentoService) {
        this.ordemCarregamentoService = ordemCarregamentoService;
    }

    // UC-GC01: Cadastrar Ordem de Carregamento
    @PostMapping
    public ResponseEntity<Void> criarVeiculo(@RequestBody OrdemCarregamentoRequestDTO request) {
        ordemCarregamentoService.criarOrdemCarregamento(request);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}