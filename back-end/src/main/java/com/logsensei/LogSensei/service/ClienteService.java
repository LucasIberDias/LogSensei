package com.logsensei.LogSensei.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.logsensei.LogSensei.dto.cliente.ClienteRequestDTO;
import com.logsensei.LogSensei.model.Cliente;
import com.logsensei.LogSensei.repository.ClienteRepository;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    // UC-GC01: Cadastrar cliente
    public void cadastrarCliente(ClienteRequestDTO request) {

        // Crio o objeto que vai receber as informações
        Cliente cliente = new Cliente();

        // Coloco as informações
        cliente.setCodigoCliente(request.getCodigoCliente());
        cliente.setNomeCliente(request.getNomeCliente());

        // Verifico se o cliente já existe pelo nome
        if (clienteRepository.findByNomeCliente(cliente.getNomeCliente()).isPresent()) {
            throw new RuntimeException("Já existe um cliente com esse nome.");
        }

        // Verifica se o codigo nao foi usado
        if (clienteRepository.findByCodigoCliente(cliente.getCodigoCliente()).isPresent()) {
            throw new RuntimeException("Código passado já está em uso.");
        }

        // Salvo o cliente
        clienteRepository.save(cliente);
    }

    // UC-GC02: Listar Clientes
    public List<Cliente> listarClientes() {
        return clienteRepository.findAll();
    }

    // UC-GC03: Buscar Cliente por Código
    public Cliente buscarCliente(Long codigoCliente) {
        return clienteRepository.findByCodigoCliente(codigoCliente)
            .orElseThrow(() -> new RuntimeException("Cliente não possui cadastro"));
    }
}