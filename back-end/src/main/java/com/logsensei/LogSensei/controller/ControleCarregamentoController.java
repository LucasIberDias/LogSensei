package com.logsensei.LogSensei.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.logsensei.LogSensei.dto.controleCarregamento.AtualizarControleCarregamentoRequestDTO;
import com.logsensei.LogSensei.model.ControleCarregamento;
import com.logsensei.LogSensei.service.ControleCarregamentoService;

@RestController
@RequestMapping("/controleCarregamento")
public class ControleCarregamentoController {

    private final ControleCarregamentoService controleCarregamentoService;

    public ControleCarregamentoController(ControleCarregamentoService controleCarregamentoService) {
        this.controleCarregamentoService = controleCarregamentoService;
    }

    // Atualizar controle de carregamento
    @PatchMapping
    public ResponseEntity<Void> atualizarCarga(@RequestBody AtualizarControleCarregamentoRequestDTO request) {
        controleCarregamentoService.AtualizarControleCarregamento(request);

        return ResponseEntity.noContent().build();
    }

    // Listar controles
    @GetMapping
    public ResponseEntity<List<ControleCarregamento>> listarControles() {

        return ResponseEntity.ok(
                controleCarregamentoService.listarControles());
    }
}