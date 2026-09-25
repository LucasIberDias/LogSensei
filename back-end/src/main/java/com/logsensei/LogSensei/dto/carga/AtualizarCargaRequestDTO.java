package com.logsensei.LogSensei.dto.carga;

import java.time.LocalDate;
import java.util.List;

import com.logsensei.LogSensei.dto.item.ItemRequestDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AtualizarCargaRequestDTO {

    private Long idCarga;

    // Carga
    private String localSaida;
    private String transportadora;
    private String notaFiscal;

    // Ordem de carregamento
    private Long codigoCliente;
    private String endereco;
    private String numeroPedido;
    private String vencimento;
    private String observacao;
    private LocalDate dataEntrega;
    private String motorista;
    private String placaVeiculo;
    private Long idUsuario;

    // Itens
    private List<ItemRequestDTO> itens;
}