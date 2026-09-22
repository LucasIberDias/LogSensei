package com.logsensei.LogSensei.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "item")
@Getter
@Setter
@NoArgsConstructor

public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idItem;

    @NotNull
    private Long quantidade;

    @NotNull
    private Double valorUnitario;

    @NotNull
    @ManyToOne
    private Produto produto;

    @JsonIgnore
    @NotNull
    @ManyToOne
    private OrdemCarregamento ordemCarregamento;
}