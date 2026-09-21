package com.logsensei.LogSensei.service;

import org.springframework.stereotype.Service;

import com.logsensei.LogSensei.dto.veiculo.VeiculoRequestDTO;
import com.logsensei.LogSensei.model.Veiculo;
import com.logsensei.LogSensei.repository.VeiculoRepository;

@Service
public class VeiculoService {

    private final VeiculoRepository veiculoRepository;

    public VeiculoService(VeiculoRepository veiculoRepository) {
        this.veiculoRepository = veiculoRepository;
    }

    // Criar veículo
    public void criarVeiculo(VeiculoRequestDTO request) {

        // Crio o objeto que vai receber as informações
        Veiculo veiculo = new Veiculo();

        // Coloco as informações
        veiculo.setPlacaVeiculo(request.getPlacaVeiculo());
        veiculo.setTipoVeiculo(request.getTipoVeiculo());
        veiculo.setCapacidadeVeiculo(request.getCapacidadeVeiculo());

        // Verifico se o veículo já existe
        if (veiculoRepository.findByPlacaVeiculo(veiculo.getPlacaVeiculo()).isPresent()) {
            // Veículo já existe
            throw new RuntimeException("Já existe um veículo com essa placa.");
        }

        // Salvo o veículo
        veiculoRepository.save(veiculo);
    }

    // Busca veiculo pelo codigo
    public Veiculo buscarVeiculo(String placaVeiculo){
        return veiculoRepository.findByPlacaVeiculo(placaVeiculo).orElseThrow(() ->
            new RuntimeException("Veiculo não cadastrado")
        );
    }
}