import api from "./api";
import type { Carga } from "../types/carga";

// UC-GC02: Listar Cargas
export async function listarCargas(): Promise<Carga[]> {
    const response = await api.get<Carga[]>("/cargas");

    return response.data;
}