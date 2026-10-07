import api from "./api";
import type { Carga } from "../types/carga";
import type { AtualizarCargaRequest } from "../types/atualizarCarga";

// UC-GC02: Listar Cargas
export async function listarCargas(): Promise<Carga[]> {
    const response = await api.get<Carga[]>("/cargas");

    return response.data;
}

// UC-GC03: Atualizar Carga
export async function atualizarCarga(dados: AtualizarCargaRequest): Promise<void> {
    await api.patch("/cargas", dados);
}