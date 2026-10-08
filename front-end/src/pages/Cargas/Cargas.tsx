import { useEffect, useState } from "react";

import { Box } from "@mui/material";

import type { Carga } from "../../types/carga";

import {
    listarCargas,
    cancelarCarga,
} from "../../services/cargasService";

import ListaCargas from "./ListaCargas";
import FormEditarCarga from "./FormEditarCarga";
import FormCancelarCarga from "./FormCancelarCarga";
import FormVisualizarCarga from "./FormVisualizarCarga";

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import PageHeader from "../../components/PageHeader/PageHeader";

function Cargas() {
    const [cargas, setCargas] = useState<Carga[]>([]);

    const [cargaSelecionada, setCargaSelecionada] =
        useState<Carga | null>(null);

    const [abrirFormulario, setAbrirFormulario] =
        useState(false);

    const [abrirCancelamento, setAbrirCancelamento] =
        useState(false);

    const [cargaParaCancelar, setCargaParaCancelar] =
        useState<Carga | null>(null);

    const [cargaVisualizada, setCargaVisualizada] =
        useState<Carga | null>(null);

    useEffect(() => {
        carregarCargas();
    }, []);

    async function carregarCargas() {
        try {
            const dados = await listarCargas();
            setCargas(dados);
        } catch (erro) {
            console.error("Erro ao carregar cargas:", erro);
        }
    }

    function selecionarCargaParaCancelar(carga: Carga) {
        setCargaParaCancelar(carga);
        setAbrirCancelamento(true);
    }

    async function confirmarCancelamento() {
        if (!cargaParaCancelar) {
            return;
        }

        const idUsuario = Number(
            localStorage.getItem("idUsuario")
        );

        if (!idUsuario) {
            console.error("Usuário não encontrado.");
            return;
        }

        try {
            await cancelarCarga(
                cargaParaCancelar.idCarga,
                idUsuario
            );

            await carregarCargas();

            setAbrirCancelamento(false);
            setCargaParaCancelar(null);
        } catch (erro) {
            console.error(
                "Erro ao cancelar carga:",
                erro
            );
        }
    }

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
                    title="Cargas"
                    description="Visualize e gerencie as cargas cadastradas"
                />

                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                        },
                        gap: 3,
                    }}
                >
                    <ListaCargas
                        cargas={cargas}
                        editarCarga={(carga) => {
                            setCargaSelecionada(carga);
                            setAbrirFormulario(true);
                        }}
                        visualizarCarga={(carga) => {
                            setCargaVisualizada(carga);
                        }}
                        cancelarCarga={
                            selecionarCargaParaCancelar
                        }
                    />
                </Box>
            </Box>

            <FormEditarCarga
                abrir={abrirFormulario}
                carga={cargaSelecionada}
                fechar={() => {
                    setAbrirFormulario(false);
                    setCargaSelecionada(null);
                }}
                atualizar={carregarCargas}
            />

            <FormVisualizarCarga
                abrir={cargaVisualizada !== null}
                carga={cargaVisualizada}
                fechar={() => {
                    setCargaVisualizada(null);
                }}
                imprimir={() => {
                    console.log(
                        "Imprimir carga:",
                        cargaVisualizada
                    );
                }}
            />

            <FormCancelarCarga
                abrir={abrirCancelamento}
                fechar={() => {
                    setAbrirCancelamento(false);
                    setCargaParaCancelar(null);
                }}
                cancelar={confirmarCancelamento}
            />
        </Box>
    );
}

export default Cargas;