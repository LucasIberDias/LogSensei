package com.logsensei.LogSensei.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.logsensei.LogSensei.dto.veiculo.VeiculoRequestDTO;
import com.logsensei.LogSensei.service.VeiculoService;
import com.logsensei.LogSensei.model.Veiculo;

@RestController
@RequestMapping("/veiculos")
public class VeiculoController {

    private final VeiculoService veiculoService;

    public VeiculoController(VeiculoService veiculoService) {
        this.veiculoService = veiculoService;
    }

    // Criar veículo
    @PostMapping
    public ResponseEntity<Void> criarVeiculo(@RequestBody VeiculoRequestDTO request) {
        veiculoService.criarVeiculo(request);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // Buscar veiculo
    @GetMapping("/placa/{placaVeiculo}")
    public ResponseEntity<Veiculo> buscarPorCodigo(@PathVariable String placaVeiculo) {

        return ResponseEntity.ok(veiculoService.buscarVeiculo(placaVeiculo));
    }
}