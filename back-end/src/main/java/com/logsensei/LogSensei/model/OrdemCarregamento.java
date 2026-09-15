package com.logsensei.LogSensei.model;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ordem_carregamento")
@Getter
@Setter
@NoArgsConstructor
public class OrdemCarregamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idOrdemCarregamento;

    @NotNull
    @ManyToOne
    private Cliente cliente;

    @NotBlank
    private String endereco;

    private String numeroPedido;

    @NotBlank 
    private String vencimento;

    @OneToMany(
        mappedBy = "ordemCarregamento",
        cascade = CascadeType.ALL,
        orphanRemoval = true
    )
    private List<Item> item = new ArrayList<>();

    private String observacao;

    private LocalDate dataEntrega;

    private String motorista;

    @ManyToOne
    private Veiculo veiculo;

    private LocalDateTime dataCriacao;

    @NotNull
    @ManyToOne 
    private Usuario usuario;
}