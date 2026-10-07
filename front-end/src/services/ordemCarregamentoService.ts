import api from "./api";

interface ItemOrdemRequest {
    codigoProduto: number;
    quantidade: number;
    valorUnitario: number;
}

interface OrdemCarregamentoRequest {
    codigoCliente: number;
    endereco: string;
    numeroPedido: string;
    vencimento: string;
    observacao: string;
    dataEntrega: string;
    idUsuario: number;
    itens: ItemOrdemRequest[];
}

// UC-GC01: Cadastrar Ordem de Carregamento
export async function criarOrdemCarregamento(dados: OrdemCarregamentoRequest) {
    const response = await api.post("/ordemCarregamento", dados);

    return response.data;
}
