package com.logsensei.LogSensei.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.logsensei.LogSensei.dto.cliente.ClienteRequestDTO;
import com.logsensei.LogSensei.service.ClienteService;

@RestController
@RequestMapping("/cliente")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    // Criar cliente
    @PostMapping
    public ResponseEntity<Void> criarVeiculo(@RequestBody ClienteRequestDTO request) {
        clienteService.criarCliente(request);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}