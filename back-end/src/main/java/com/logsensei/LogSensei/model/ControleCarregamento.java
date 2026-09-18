package com.logsensei.LogSensei.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "controle_carregamento")
@Getter
@Setter
@NoArgsConstructor
public class ControleCarregamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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

    @NotNull
    @OneToOne  
    private Carga carga;
}