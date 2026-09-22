package com.logsensei.LogSensei.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.logsensei.LogSensei.dto.cliente.ClienteRequestDTO;
import com.logsensei.LogSensei.service.ClienteService;

import com.logsensei.LogSensei.model.Cliente;

@RestController
@RequestMapping("/clientes")
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

    // Buscar cliente
    @GetMapping("/codigo/{codigoCliente}")
    public ResponseEntity<Cliente> buscarPorCodigo(@PathVariable Long codigoCliente) {

        return ResponseEntity.ok(clienteService.buscarCliente(codigoCliente));
    }
}