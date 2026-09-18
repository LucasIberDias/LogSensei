package com.logsensei.LogSensei.service;

import org.springframework.stereotype.Service;

import com.logsensei.LogSensei.repository.CargaRepository;
import com.logsensei.LogSensei.repository.VeiculoRepository;
import com.logsensei.LogSensei.repository.ControleCarregamentoRepository;

import com.logsensei.LogSensei.dto.carga.AtualizarCargaRequestDTO;

import com.logsensei.LogSensei.model.Carga;
import com.logsensei.LogSensei.model.ControleCarregamento;

@Service
public class CargaService {
    private final CargaRepository cargaRepository;
    private final VeiculoRepository veiculoRepository;
    private final ControleCarregamentoRepository controleCarregamentoRepository;

    public CargaService(
        CargaRepository cargaRepository, 
        VeiculoRepository veiculoRepository,
        ControleCarregamentoRepository controleCarregamentoRepository
    ) {
        this.cargaRepository = cargaRepository;
        this.veiculoRepository = veiculoRepository;
        this.controleCarregamentoRepository = controleCarregamentoRepository;
    }

    // Atualizar carga
    public void AtualizarCarga(AtualizarCargaRequestDTO request) {
        // Pego a carga que será atualizada
        Carga carga = cargaRepository.findById(request.getIdCarga()).get();

        // Verifico se tem dados dentro antes de salvar, se não mantem a informação antiga
        if (request.getLocalSaida() != null) {
            carga.setLocalSaida(request.getLocalSaida());
        }

        if (request.getTransportadora() != null) {
            carga.setTransportadora(request.getTransportadora());
        }

        if (request.getNotaFiscal() != null) {
            carga.setNotaFiscal(request.getNotaFiscal());
        }

        if (request.getMotorista() != null) {
            carga.getOrdemCarregamento().setMotorista(request.getMotorista());
        }

        if (request.getPlacaVeiculo() != null) {
            carga.getOrdemCarregamento().setVeiculo(veiculoRepository.findByPlacaVeiculo(request.getPlacaVeiculo()).get());
        }

        // Verifico se motorista, veiculo e local de saida foram informados
        if (carga.getOrdemCarregamento().getMotorista() != null && carga.getOrdemCarregamento().getVeiculo() != null && carga.getLocalSaida() != null) {
            // Quando for informado motorista, veiculo e local de saida o status vai mudar para próximo
            carga.setStatus("PRÓXIMO");
        }

        // Verifico se foi informado nota fiscal 
        if (carga.getNotaFiscal() != null && carga.getStatus().equals("PRÓXIMO")) {
            // Define os status como entregue
            carga.setStatus("ENTREGUE");
        }
        
        // Salvo a carga com suas novas informações
        cargaRepository.save(carga);

        // Se o status for entregue e não existir um controle de carregamento com essa carga, então será gerado um
        if (carga.getStatus().equals("ENTREGUE") && !controleCarregamentoRepository.existsByCarga(carga)) {
            // Crio o controle de carregamento
            ControleCarregamento controleCarregamento = new ControleCarregamento();

            // Coloco a carga do controle de carregamento
            controleCarregamento.setCarga(carga);

            // Salvo o controle de carregamento
            controleCarregamentoRepository.save(controleCarregamento);
        }     
    }
}