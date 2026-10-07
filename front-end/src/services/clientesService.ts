import api from "./api";
import type { Cliente } from "./../types/cliente"

// UC-GC01: Cadastrar Cliente
export async function cadastrarCliente(codigoCliente: number, nomeCliente: string) {
    const response = await api.post(`/clientes`, { codigoCliente, nomeCliente });

    return response.data;
}

// UC-GC02: Listar Cliente
export async function listarClientes(): Promise<Cliente[]> {
    const response = await api.get<Cliente[]>("/clientes");

    return response.data;
}

// UC-GC03: Buscar Cliente por Código
export async function buscarClientePorCodigo(codigoCliente: number) {
    const response = await api.get(`/clientes/codigo/${codigoCliente}`);

    return response.data;
}