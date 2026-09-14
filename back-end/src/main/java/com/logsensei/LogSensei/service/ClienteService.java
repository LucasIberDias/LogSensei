package com.logsensei.LogSensei.service;

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

    // Criar cliente
    public void criarCliente(ClienteRequestDTO request) {

        // Crio o objeto que vai receber as informações
        Cliente cliente = new Cliente();

        // Coloco as informações
        cliente.setCodigoCliente(request.getCodigoCliente());
        cliente.setNomeCliente(request.getNomeCliente());

        // Verifico se o cliente já existe pelo nome
        if (clienteRepository.findByNomeCliente(cliente.getNomeCliente()).isPresent()) {
            throw new RuntimeException("Já existe um cliente com esse nome.");
        }

        // Verific se o codigo nao foi usado
        if (clienteRepository.findByCodigoCliente(cliente.getCodigoCliente()).isPresent()) {
            throw new RuntimeException("Código passado já está em uso.");
        }

        // Salvo o cliente
        clienteRepository.save(cliente);
    }
}