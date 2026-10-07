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

// UC_GC04: Cancelar Carga
export async function cancelarCarga(idCarga: number, idUsuario: number): Promise<void> {
    await api.patch(`/cargas/${idCarga}/cancelar`, null, {
        params: {
            idUsuario,
        },
    });
}