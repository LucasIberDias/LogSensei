package com.logsensei.LogSensei.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "carga")
@Getter
@Setter
@NoArgsConstructor
public class Carga {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idCarga;

    private String localSaida;
 
    private String transportadora;

    private String notaFiscal;

    @NotBlank 
    private String status;

    @NotNull
    private Double pesoTotal;

    @NotNull
    private Double aproveitamento;

    @NotNull
    @OneToOne 
    private OrdemCarregamento ordemCarregamento;
}