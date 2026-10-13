
import { useEffect, useState } from "react";

import { Box } from "@mui/material";

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import PageHeader from "../../components/PageHeader/PageHeader";
import ListaCargasFilial from "./ListaCargasFilial";
import FormVisualizarCarga from "../Cargas/FormVisualizarCarga";
import imprimirCarga from "../Cargas/ImprimirCarga";

import { listarCargasFilial } from "../../services/cargasService";

import type { Carga } from "../../types/carga";

function Cargas() {
    const [cargas, setCargas] = useState<Carga[]>([]);
    const [cargaVisualizada, setCargaVisualizada] = useState<Carga | null>(null);

    async function carregarCargas() {
        try {
            const dados = await listarCargasFilial();

            const cargasOrdenadas = [...dados].sort((a, b) => {
                const dataA = a.ordemCarregamento.dataEntrega;
                const dataB = b.ordemCarregamento.dataEntrega;

                if (!dataA) return 1;
                if (!dataB) return -1;

                return (
                    new Date(dataA).getTime() -
                    new Date(dataB).getTime()
                );
            });

            setCargas(cargasOrdenadas);
        } catch (erro) {
            console.error("Erro ao carregar cargas:", erro);
        }
    }

    useEffect(() => {
        carregarCargas();
    }, []);

    return (
        <Box>
            <Header />

            <Sidebar />

            <Box
                component="main"
                sx={{
                    marginLeft: {
                        xs: 0,
                        md: "240px",
                    },
                    padding: 3,
                    paddingTop: 10,
                }}
            >
                <PageHeader
                    title="Diário"
                    description="Verifique as cargas que devem ser entregues a partir da sua filial."
                />

                <Box sx={{ marginTop: 3 }}>
                    <ListaCargasFilial cargas={cargas}
                        visualizarCarga={(carga) => {
                            setCargaVisualizada(carga);
                        }}
                    />
                </Box>
            </Box>
            <FormVisualizarCarga
                abrir={cargaVisualizada !== null}
                carga={cargaVisualizada}
                fechar={() => {
                    setCargaVisualizada(null);
                }}
                imprimir={() => {
                    if (cargaVisualizada) {
                        imprimirCarga(cargaVisualizada);
                    }
                }}
            />
        </Box>
    );
}

export default Cargas;
