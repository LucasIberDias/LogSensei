import api from "./api";
import type { Usuario } from "./../types/usuario"

// UC-GU02: Listar Usuários
export async function listarUsuarios(): Promise<Usuario[]> {
    const response = await api.get<Usuario[]>("/usuarios");

    return response.data;
}

// UC-GU04: Buscar Cargos
export async function buscarCargos(): Promise<string[]> {
    const response = await api.get("/usuarios/cargos");
    return response.data;
}