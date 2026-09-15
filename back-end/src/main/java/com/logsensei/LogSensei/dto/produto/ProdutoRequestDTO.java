package com.logsensei.LogSensei.dto.produto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProdutoRequestDTO {
    private Long codigoProduto;
    private String nomeProduto; 
    private String medidaProduto;
    private Long pesoProduto;
}
