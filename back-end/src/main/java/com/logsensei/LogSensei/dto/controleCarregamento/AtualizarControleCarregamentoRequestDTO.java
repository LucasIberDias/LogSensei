package com.logsensei.LogSensei.dto.controleCarregamento;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class AtualizarControleCarregamentoRequestDTO {
    private Long idCarregamento;
    private String tipoMovimentacao;
    private String destino;
    private String tipoFrete;
    private String tipoFrota;
    private Double valorTonelada;
    private String numeroCTE;
    private String statusPagamento;
    private String localDescarga;
    private Double saldoPendente;
    private String entregaDireto;
}
