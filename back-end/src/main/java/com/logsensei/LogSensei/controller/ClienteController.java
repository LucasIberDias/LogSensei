package com.logsensei.LogSensei.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    // UC-GC01: Cadastrar cliente
    @PostMapping
    public ResponseEntity<Void> CadastrarCliente(@RequestBody ClienteRequestDTO request) {
        clienteService.cadastrarCliente(request);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // UC-GC02: Listar clientes
    @GetMapping
    public ResponseEntity<List<Cliente>> listarClientes() {
        return ResponseEntity.ok(clienteService.listarClientes());
    }

    // UC-GC03: Buscar Cliente por Código
    @GetMapping("/codigo/{codigoCliente}")
    public ResponseEntity<Cliente> buscarPorCodigo(@PathVariable Long codigoCliente) {

        return ResponseEntity.ok(clienteService.buscarCliente(codigoCliente));
    }
}