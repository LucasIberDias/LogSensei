import api from "./api";
import type { Usuario } from "./../types/usuario"

export async function listarUsuarios(): Promise<Usuario[]> {
    const response = await api.get<Usuario[]>("/usuarios");

    return response.data;
}