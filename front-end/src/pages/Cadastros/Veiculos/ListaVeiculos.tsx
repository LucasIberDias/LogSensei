import { useEffect, useState } from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
} from "@mui/material";

import { listarVeiculos } from "../../../services/veiculosService";

import type { Veiculo } from "../../../types/veiculo";

function ListaVeiculos() {

    const [veiculos, setVeiculos] = useState<Veiculo[]>([]);

    useEffect(() => {
        carregarVeiculos();
    }, []);

    async function carregarVeiculos() {

        try {

            const veiculos = await listarVeiculos();

            setVeiculos(veiculos);

        } catch (error) {

            console.error("Erro ao listar veículos:", error);

        }
    }

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    md: "repeat(3, 1fr)",
                },
                gap: 3,
            }}
        >

            {veiculos.map((veiculo) => (

                <Card key={veiculo.placaVeiculo}>

                    <CardContent>

                        <Typography variant="h6">
                            {veiculo.placaVeiculo}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Tipo: {veiculo.tipoVeiculo}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Capacidade: {veiculo.capacidadeVeiculo}
                        </Typography>

                    </CardContent>

                </Card>

            ))}

        </Box>
    );
}

export default ListaVeiculos;