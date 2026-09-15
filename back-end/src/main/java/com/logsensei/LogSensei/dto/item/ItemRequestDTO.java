package com.logsensei.LogSensei.dto.item;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ItemRequestDTO {
    private Long codigoProduto;
    private Long quantidade;
    private Double valorUnitario;
}