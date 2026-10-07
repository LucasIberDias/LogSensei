import api from "./api";

import type { Veiculo } from "../types/veiculo";

// UC-GV01: Cadastrar Veículos
export async function cadastrarVeiculo(
    placaVeiculo: string,
    tipoVeiculo: string,
    capacidadeVeiculo: number
) {

    const response = await api.post("/veiculos", {
        placaVeiculo,
        tipoVeiculo,
        capacidadeVeiculo
    });

    return response.data;
}

// UC-GV02: Listar Veículos
export async function listarVeiculos(): Promise<Veiculo[]> {

    const response = await api.get<Veiculo[]>("/veiculos");

    return response.data;
}

// UC-GV03: Buscar Veículo por Placa
export async function buscarVeiculoPorPlaca(placaVeiculo: string) {
    const response = await api.get(`/veiculos/placa/${placaVeiculo}`);

    return response.data;
}