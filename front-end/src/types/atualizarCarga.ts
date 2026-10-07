export type ItemRequest = {
    codigoProduto: number;
    quantidade: number;
    valorUnitario: number;
};

export type AtualizarCargaRequest = {
    idCarga: number;

    localSaida?: string | null;
    transportadora?: string | null;
    notaFiscal?: string | null;

    codigoCliente?: number | null;

    endereco?: string | null;
    numeroPedido?: string | null;
    vencimento?: string | null;
    observacao?: string | null;
    dataEntrega?: string | null;

    motorista?: string | null;
    placaVeiculo?: string | null;

    idUsuario?: number | null;

    itens?: ItemRequest[] | null;
};