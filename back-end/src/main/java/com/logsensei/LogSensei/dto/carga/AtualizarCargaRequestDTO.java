package com.logsensei.LogSensei.dto.carga;

import lombok.Getter;
import lombok.Setter;

@Getter 
@Setter 
public class AtualizarCargaRequestDTO {
    private Long idCarga;
    private String localSaida;
    private String transportadora;
    private String notaFiscal;
    private String motorista;
    private String placaVeiculo;
}
