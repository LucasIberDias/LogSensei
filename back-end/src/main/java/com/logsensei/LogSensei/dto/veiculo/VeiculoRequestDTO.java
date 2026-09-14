package com.logsensei.LogSensei.dto.veiculo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VeiculoRequestDTO {
    private String placaVeiculo;
    private String tipoVeiculo;
    private Long capacidadeVeiculo;
}
