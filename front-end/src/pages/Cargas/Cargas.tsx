import { useEffect, useMemo, useState } from "react";

import { Box, Button } from "@mui/material";
import { alpha } from "@mui/material/styles";

import type { Carga } from "../../types/carga";

import {
    listarCargas,
    cancelarCarga,
} from "../../services/cargasService";

import ListaCargas from "./ListaCargas";
import FormEditarCarga from "./FormEditarCarga";
import FormCancelarCarga from "./FormCancelarCarga";
import FormVisualizarCarga from "./FormVisualizarCarga";
import imprimirCarga from "./ImprimirCarga";

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import PageHeader from "../../components/PageHeader/PageHeader";

type FiltroStatus = | "TODAS" | "PROXIMO" | "PENDENTE" | "ENTREGUE" | "CANCELADA";

type CorFiltro = "primary" | "info" | "warning" | "success" | "error";

const filtros: { valor: FiltroStatus; label: string; cor: CorFiltro }[] = [
    { valor: "TODAS", label: "Todas", cor: "primary" },
    { valor: "PROXIMO", label: "Próximo", cor: "info" },
    { valor: "PENDENTE", label: "Pendente", cor: "warning" },
    { valor: "ENTREGUE", label: "Entregue", cor: "success" },
    { valor: "CANCELADA", label: "Cancelada", cor: "error" },
];

// Posição de cada status na ordem dos botões (ignora "TODAS")
const ordemStatus: Record<string, number> = filtros
    .filter((filtro) => filtro.valor !== "TODAS")
    .reduce((acc, filtro, indice) => {
        acc[filtro.valor] = indice;
        return acc;
    }, {} as Record<string, number>);

function normalizar(texto?: string) {
    return (texto ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .trim();
}

function posicaoStatus(carga: Carga) {
    return ordemStatus[normalizar(carga.status)] ?? Number.MAX_SAFE_INTEGER;
}

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

    const [filtroAtivo, setFiltroAtivo] =
        useState<FiltroStatus>("TODAS");

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

    // Filtra e ordena: primeiro pela ordem dos botões (status),
    // depois do último criado para o primeiro
    const cargasFiltradas = useMemo(() => {
        const filtradas =
            filtroAtivo === "TODAS"
                ? cargas
                : cargas.filter(
                    (carga) =>
                        normalizar(carga.status) === filtroAtivo
                );

        return [...filtradas].sort((a, b) => {
            const diferencaStatus = posicaoStatus(a) - posicaoStatus(b);

            if (diferencaStatus !== 0) {
                return diferencaStatus;
            }

            return b.idCarga - a.idCarga;
        });
    }, [cargas, filtroAtivo]);

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
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1.5,
                        marginBottom: 3,
                    }}
                >
                    {filtros.map((filtro) => {
                        const ativo = filtroAtivo === filtro.valor;

                        return (
                            <Button
                                key={filtro.valor}
                                variant={
                                    ativo ? "contained" : "outlined"
                                }
                                color={filtro.cor}
                                onClick={() =>
                                    setFiltroAtivo(filtro.valor)
                                }
                                sx={(theme) => ({
                                    textTransform: "uppercase",
                                    fontWeight: ativo ? 700 : 500,
                                    fontSize: 14,
                                    paddingX: 2.5,
                                    boxShadow: "none",
                                    color: ativo
                                        ? theme.palette.common.white
                                        : theme.palette[filtro.cor].main,
                                    backgroundColor: ativo
                                        ? theme.palette[filtro.cor].main
                                        : "transparent",
                                    borderColor:
                                        theme.palette[filtro.cor].main,
                                    "&:hover": {
                                        boxShadow: "none",
                                        borderColor:
                                            theme.palette[filtro.cor].main,
                                        backgroundColor: ativo
                                            ? theme.palette[filtro.cor]
                                                .main
                                            : alpha(
                                                theme.palette[filtro.cor]
                                                    .main,
                                                0.08
                                            ),
                                    },
                                })}
                            >
                                {filtro.label}
                            </Button>
                        );
                    })}
                </Box>

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
                        cargas={cargasFiltradas}
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
                    if (cargaVisualizada) {
                        imprimirCarga(cargaVisualizada);
                    }
                }}
            />

            <FormCancelarCarga
                abrir={abrirFormulario ? false : abrirCancelamento}
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