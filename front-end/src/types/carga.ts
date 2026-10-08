import type { Veiculo } from "./veiculo";

export type Item = {
    codigoProduto: number;
    quantidade: number;
    valorUnitario: number;

    produto: {
        codigoProduto: number;
        nomeProduto: string;
        medidaProduto: string;
        pesoProduto: number;
    };
};

export type Carga = {
    idCarga: number;
    localSaida: string;
    transportadora: string;
    notaFiscal: string;
    status: string;
    pesoTotal: number;
    aproveitamento: number;

    ordemCarregamento: {
        idOrdemCarregamento: number;

        cliente: {
            codigoCliente: number;
            nomeCliente: string;
        };

        endereco: string;
        numeroPedido: string;
        vencimento: string;
        item: Item[];
        observacao: string;
        dataEntrega: string;
        motorista: string;

        veiculo: Veiculo | null;

        dataCriacao: string;
    };
};