package com.logsensei.LogSensei.dto.ordemCarregamento;

import com.logsensei.LogSensei.dto.item.ItemRequestDTO;

import java.time.LocalDate;
import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrdemCarregamentoRequestDTO {
    private Long codigoCliente;
    private String endereco;
    private String numeroPedido;
    private String vencimento;
    private List<ItemRequestDTO> itens;
    private String observacao;
    private LocalDate dataEntrega;
    private String motorista;
    private String placaVeiculo;
}