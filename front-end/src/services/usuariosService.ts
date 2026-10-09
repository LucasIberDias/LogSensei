import api from "./api";
import type { Usuario } from "./../types/usuario"

// UC-GU01: Cadastrar Usuários
export async function cadastrarUsuario(
    nomeUsuario: string,
    senhaUsuario: string,
    cargo: string,
    idUsuario: number
) {

    if (!idUsuario) {
        return console.log("Usuário sem permissão para cadastro");
    }

    const response = await api.post(`/usuarios?idUsuario=${idUsuario}`, { nomeUsuario, senhaUsuario, cargo });

    return response.data;
}

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

// UC-GU05 Buscar Usuarios Filial
export async function buscarUsuariosFilial(): Promise<string[]> {
    const response = await api.get("/usuarios/filiais");
    return response.data;
}