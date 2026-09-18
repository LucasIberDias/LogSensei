package com.logsensei.LogSensei.service;

import org.springframework.stereotype.Service;

import com.logsensei.LogSensei.repository.ControleCarregamentoRepository;

import com.logsensei.LogSensei.dto.controleCarregamento.AtualizarControleCarregamentoRequestDTO;

import com.logsensei.LogSensei.model.ControleCarregamento;

@Service
public class ControleCarregamentoService {
    private final ControleCarregamentoRepository controleCarregamentoRepository;

    public ControleCarregamentoService(ControleCarregamentoRepository controleCarregamentoRepository) {
        this.controleCarregamentoRepository = controleCarregamentoRepository;
    }

    // Atualizar controle de carregamento
    public void AtualizarControleCarregamento(AtualizarControleCarregamentoRequestDTO request) {
        // Pego o controle de carregamento que será atualizada
        ControleCarregamento controleCarregamento = controleCarregamentoRepository.findById(request.getIdCarregamento()).get();

        // Verifico se tem dados dentro antes de salvar, se não mantem a informação
        // antiga
        if (request.getTipoMovimentacao() != null) {
            controleCarregamento.setTipoMovimentacao(request.getTipoMovimentacao());
        }
        if (request.getDestino() != null) {
            controleCarregamento.setDestino(request.getDestino());
        }
        if (request.getTipoFrete() != null) {
            controleCarregamento.setTipoFrete(request.getTipoFrete());
        }
        if (request.getTipoFrota() != null) {
            controleCarregamento.setTipoFrota(request.getTipoFrota());
        }
        if (request.getValorTonelada() != null) {
            controleCarregamento.setValorTonelada(request.getValorTonelada());
        }
        if (request.getNumeroCTE() != null) {
            controleCarregamento.setNumeroCTE(request.getNumeroCTE());
        }
        if (request.getStatusPagamento() != null) {
            controleCarregamento.setStatusPagamento(request.getStatusPagamento());
        }
        if (request.getLocalDescarga() != null) {
            controleCarregamento.setLocalDescarga(request.getLocalDescarga());
        }
        if (request.getSaldoPendente() != null) {
            controleCarregamento.setSaldoPendente(request.getSaldoPendente());
        }

        // Salvo o controle de carregamento
        controleCarregamentoRepository.save(controleCarregamento);
    }
}
