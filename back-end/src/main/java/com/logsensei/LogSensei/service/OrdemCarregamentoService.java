package com.logsensei.LogSensei.service;

import org.springframework.stereotype.Service;

import com.logsensei.LogSensei.dto.ordemCarregamento.OrdemCarregamentoRequestDTO;
import com.logsensei.LogSensei.dto.item.ItemRequestDTO;
import com.logsensei.LogSensei.model.OrdemCarregamento;
import com.logsensei.LogSensei.model.Item;
import com.logsensei.LogSensei.model.Produto;
import com.logsensei.LogSensei.model.Carga;

import com.logsensei.LogSensei.repository.OrdemCarregamentoRepository;
import com.logsensei.LogSensei.repository.ClienteRepository;
import com.logsensei.LogSensei.repository.VeiculoRepository;
import com.logsensei.LogSensei.repository.UsuarioRepository;
import com.logsensei.LogSensei.repository.ProdutoRepository;
import com.logsensei.LogSensei.repository.CargaRepository;

import java.time.LocalDateTime;

@Service
public class OrdemCarregamentoService {
    private final OrdemCarregamentoRepository ordemCarregamentoRepository;

    private final ClienteRepository clienteRepository;

    private final UsuarioRepository usuarioRepository;

    private final ProdutoRepository produtoRepository;

    private final CargaRepository cargaRepository;

    public OrdemCarregamentoService(
            OrdemCarregamentoRepository ordemCarregamentoRepository,
            ClienteRepository clienteRepository,
            VeiculoRepository veiculoRepository,
            UsuarioRepository usuarioRepository,
            ProdutoRepository produtoRepository,
            CargaRepository cargaRepository) {

        this.ordemCarregamentoRepository = ordemCarregamentoRepository;
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
        this.produtoRepository = produtoRepository;
        this.cargaRepository = cargaRepository;
    }

    // Criar ordem de carregamento
    public void criarOrdemCarregamento(OrdemCarregamentoRequestDTO request) {
        OrdemCarregamento ordemCarregamento = new OrdemCarregamento();

        // Preencho as informações passadas
        ordemCarregamento.setCliente(clienteRepository.findByCodigoCliente(request.getCodigoCliente()).get());
        ordemCarregamento.setEndereco(request.getEndereco());
        ordemCarregamento.setNumeroPedido(request.getNumeroPedido());
        ordemCarregamento.setVencimento(request.getVencimento());
        ordemCarregamento.setObservacao(request.getObservacao());
        ordemCarregamento.setDataEntrega(request.getDataEntrega());
        ordemCarregamento.setDataCriacao(LocalDateTime.now());
        ordemCarregamento.setUsuario(usuarioRepository.findById(request.getIdUsuario()).get());

        // Crio e prencho os item passado pelo usario
        for (ItemRequestDTO itemRequest : request.getItens()) {
            Item item = new Item();

            // Coloco as informações dos itens
            item.setQuantidade(itemRequest.getQuantidade());
            item.setValorUnitario(itemRequest.getValorUnitario());

            // Verifico se não foi passado um produto que não existe
            if (produtoRepository.findByCodigoProduto(itemRequest.getCodigoProduto()).isEmpty()) {
                throw new RuntimeException("Produto não encontrado");
            }

            // Pego o produto
            Produto produto = produtoRepository.findByCodigoProduto(itemRequest.getCodigoProduto()).get();

            // Coloco o produto no item
            item.setProduto(produto);

            // Conecto com a ordem de carregamento
            item.setOrdemCarregamento(ordemCarregamento);

            // Adiciono na lista o produto
            ordemCarregamento.getItem().add(item);
        }

        // Calculo o peso total da carga
        Double pesoTotal = 0.0;

        for (Item item : ordemCarregamento.getItem()) {
            pesoTotal += item.getProduto().getPesoProduto() * item.getQuantidade();
        }

        // Criação da carga
        Carga carga = new Carga();

        // Coloco os dados inicias da carga
        carga.setStatus("PENDENTE");
        carga.setPesoTotal(pesoTotal);
        carga.setOrdemCarregamento(ordemCarregamento);

        // Salvo a ordem de carregamento
        ordemCarregamentoRepository.save(ordemCarregamento);

        //  Salvo a carga
        cargaRepository.save(carga);
    }
}