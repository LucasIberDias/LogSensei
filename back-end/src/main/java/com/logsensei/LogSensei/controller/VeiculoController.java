package com.logsensei.LogSensei.controller;

import java.util.List;

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

    // UC-GV01: Cadastrar Veiculos
    @PostMapping
    public ResponseEntity<Void> criarVeiculo(@RequestBody VeiculoRequestDTO request) {
        veiculoService.criarVeiculo(request);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // UC-GV02: Listar Veiculos
    @GetMapping
    public ResponseEntity<List<Veiculo>> listarClientes() {
        return ResponseEntity.ok(veiculoService.listarVeiculos());
    }

    // UC-GV03: Buscar Veículo por Placa
    @GetMapping("/placa/{placaVeiculo}")
    public ResponseEntity<Veiculo> buscarPorCodigo(
            @PathVariable String placaVeiculo) {

        System.out.println("CONTROLLER - placa recebida: " + placaVeiculo);

        return ResponseEntity.ok(
                veiculoService.buscarVeiculo(placaVeiculo));
    }
}