package com.logsensei.LogSensei.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.logsensei.LogSensei.dto.carga.AtualizarCargaRequestDTO;
import com.logsensei.LogSensei.dto.item.ItemRequestDTO;

import com.logsensei.LogSensei.model.Carga;
import com.logsensei.LogSensei.model.Item;
import com.logsensei.LogSensei.model.OrdemCarregamento;
import com.logsensei.LogSensei.model.Produto;
import com.logsensei.LogSensei.model.Usuario;

import com.logsensei.LogSensei.repository.CargaRepository;
import com.logsensei.LogSensei.repository.ClienteRepository;
import com.logsensei.LogSensei.repository.ProdutoRepository;
import com.logsensei.LogSensei.repository.UsuarioRepository;
import com.logsensei.LogSensei.repository.VeiculoRepository;

@Service
public class CargaService {

    private final CargaRepository cargaRepository;
    private final ClienteRepository clienteRepository;
    private final VeiculoRepository veiculoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProdutoRepository produtoRepository;

    public CargaService(
            CargaRepository cargaRepository,
            ClienteRepository clienteRepository,
            VeiculoRepository veiculoRepository,
            UsuarioRepository usuarioRepository,
            ProdutoRepository produtoRepository) {

        this.cargaRepository = cargaRepository;
        this.clienteRepository = clienteRepository;
        this.veiculoRepository = veiculoRepository;
        this.usuarioRepository = usuarioRepository;
        this.produtoRepository = produtoRepository;
    }

    // UC-GC02: Listar Cargas
    public List<Carga> listarCargas() {
        return cargaRepository.findAll();
    }

    // UC-GC03: Atualizar Carga
    public void atualizarCarga(AtualizarCargaRequestDTO request) {

        Carga carga = cargaRepository.findById(request.getIdCarga())
                .orElseThrow(() -> new RuntimeException("Carga não encontrada"));

        OrdemCarregamento ordem = carga.getOrdemCarregamento();

        if (request.getLocalSaida() != null) {
            carga.setLocalSaida(request.getLocalSaida());
        }

        if (request.getTransportadora() != null) {
            carga.setTransportadora(request.getTransportadora());
        }

        if (request.getNotaFiscal() != null) {
            carga.setNotaFiscal(request.getNotaFiscal());
        }

        if (request.getCodigoCliente() != null) {

            ordem.setCliente(
                    clienteRepository.findByCodigoCliente(request.getCodigoCliente())
                            .orElseThrow(() -> new RuntimeException("Cliente não encontrado")));
        }

        if (request.getEndereco() != null) {
            ordem.setEndereco(request.getEndereco());
        }

        if (request.getNumeroPedido() != null) {
            ordem.setNumeroPedido(request.getNumeroPedido());
        }

        if (request.getVencimento() != null) {
            ordem.setVencimento(request.getVencimento());
        }

        if (request.getObservacao() != null) {
            ordem.setObservacao(request.getObservacao());
        }

        if (request.getDataEntrega() != null) {
            ordem.setDataEntrega(request.getDataEntrega());
        }

        if (request.getMotorista() != null) {
            ordem.setMotorista(request.getMotorista());
        }

        if (request.getPlacaVeiculo() != null) {

            if (request.getPlacaVeiculo().isBlank()) {
                ordem.setVeiculo(null);
            } else {
                ordem.setVeiculo(
                        veiculoRepository.findByPlacaVeiculo(request.getPlacaVeiculo())
                                .orElseThrow(() -> new RuntimeException("Veículo não encontrado")));
            }
        }

        if (request.getIdUsuario() != null) {

            ordem.setUsuario(
                    usuarioRepository.findById(request.getIdUsuario())
                            .orElseThrow(() -> new RuntimeException("Usuário não encontrado")));
        }

        if (request.getItens() != null) {

            ordem.getItem().clear();

            for (ItemRequestDTO itemRequest : request.getItens()) {

                Produto produto = produtoRepository
                        .findByCodigoProduto(itemRequest.getCodigoProduto())
                        .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

                Item item = new Item();

                item.setQuantidade(itemRequest.getQuantidade());
                item.setValorUnitario(itemRequest.getValorUnitario());
                item.setProduto(produto);
                item.setOrdemCarregamento(ordem);

                ordem.getItem().add(item);
            }
        }

        Double pesoTotal = 0.0;

        for (Item item : ordem.getItem()) {

            pesoTotal += item.getProduto().getPesoProduto() * item.getQuantidade();
        }

        carga.setPesoTotal(pesoTotal);

        if (ordem.getVeiculo() != null
                && ordem.getVeiculo().getCapacidadeVeiculo() != null
                && ordem.getVeiculo().getCapacidadeVeiculo() > 0) {

            Double aproveitamento = (pesoTotal / ordem.getVeiculo().getCapacidadeVeiculo()) * 100;

            carga.setAproveitamento(aproveitamento);

        } else {

            carga.setAproveitamento(0.0);
        }

        boolean possuiMotorista = ordem.getMotorista() != null
                && !ordem.getMotorista().isBlank();

        boolean possuiVeiculo = ordem.getVeiculo() != null;

        boolean possuiLocalSaida = carga.getLocalSaida() != null
                && !carga.getLocalSaida().isBlank();

        boolean possuiNotaFiscal = carga.getNotaFiscal() != null
                && !carga.getNotaFiscal().isBlank();

        if (possuiMotorista && possuiVeiculo && possuiLocalSaida) {
            carga.setStatus("PRÓXIMO");
        } else {
            carga.setStatus("PENDENTE");
        }

        if (possuiNotaFiscal && carga.getStatus().equals("PRÓXIMO")) {
            carga.setStatus("ENTREGUE");
        }

        cargaRepository.save(carga);
    }

    // UC-GC04: Cancelar Carga
    public void cancelarCarga(Long idUsuario, Long idCarga) {
        // Pego o usuario que pretende cancelar a carga
        Usuario usuarioAutenticado = usuarioRepository.findById(idUsuario).get();

        // Verifico se o usuario tem permissão para cancelar cargas
        if (!usuarioAutenticado.getCargo().equals("GERENTE LOGISTICA")
                && !usuarioAutenticado.getCargo().equals("DESENVOLVEDOR")) {
            throw new RuntimeException("Você não tem permissão para cancelar cargas");
        }

        // Pego a carga que será cancelada
        Carga carga = cargaRepository.findById(idCarga).get();

        // Cancelo a carga
        carga.setStatus("CANCELADA");

        // Salvo as mudanças
        cargaRepository.save(carga);
    }

    // UC-GC08: Listar Cargas para Filial
    public List<Carga> listarCargasFilial(Long idUsuario) {
        // Crio o objeto usuario para verificar seu nome de filial
        Usuario filial = usuarioRepository.findById(idUsuario).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // Verifico se o usuario que está fazendo a busca é uma filial
        if (!filial.getCargo().equals("FILIAL")) {
            throw new RuntimeException("Apenas filial pode fazer essa visualização");
        }

        // Faço a busca das cargas de acordo com o nome do local de saida e do usuario filial
        return cargaRepository.buscarCargasDaFilial(filial.getNomeUsuario());
    }
}