import api from "./api";
import type { Cliente } from "./../types/cliente"

// UC-GC02: Listar Clientes
export async function listarClientes(): Promise<Cliente[]> {
    const response = await api.get<Cliente[]>("/clientes");

    return response.data;
}