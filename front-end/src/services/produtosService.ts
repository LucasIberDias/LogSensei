import api from "./api";
import type { Produto } from "./../types/produto"

// UC-GP01: Cadastrar Produto
export async function cadastrarProduto(
    codigoProduto: number,
    nomeProduto: string,
    medidaProduto: string,
    pesoProduto: number
) {
    const response = await api.post(`/produtos`, { codigoProduto, nomeProduto, medidaProduto, pesoProduto });

    return response.data;
}

// UC-GP02: Listar Produtos
export async function listarProdutos(): Promise<Produto[]> {
    const response = await api.get<Produto[]>("/produtos");

    return response.data;
}

// UC-GP03: Buscar Produto 
export async function buscarProdutoPorCodigo(codigoProduto: number) {
    const response = await api.get(`/produtos/codigo/${codigoProduto}`);

    return response.data;
}