import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
    Alert,
    Avatar,
    Box,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    LinearProgress,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import LockRoundedIcon from "@mui/icons-material/LockRounded";

import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import UpcomingRoundedIcon from "@mui/icons-material/UpcomingRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
import ScaleRoundedIcon from "@mui/icons-material/ScaleRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import BusinessRoundedIcon from "@mui/icons-material/BusinessRounded";
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import PageHeader from "../../components/PageHeader/PageHeader";
import api from "../../services/api";

interface Carga {
    idCarga: number;
    status: string;
    aproveitamento: number | null;
    pesoTotal: number | null;

    ordemCarregamento: {
        numeroPedido: string;
        endereco: string;
        dataEntrega: string;

        cliente: {
            nomeCliente: string;
        };

        motorista: string | null;

        veiculo: {
            placaVeiculo: string;
        } | null;
    };
}

type CorTema = "primary" | "info" | "warning" | "success" | "error";

interface Resumo {
    nome: string;
    total: number;
    entregues: number;
    emAberto: number;
    pesoKg: number;
    aproveitamento: number | null;
}

const KG_POR_TONELADA = 1000;

const LIMITE_VEICULOS = 8;
const LIMITE_RANKING = 5;

function normalizar(texto?: string) {
    return (texto ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .trim();
}

const CARGOS_PERMITIDOS = ["DESENVOLVEDOR", "ANALISTA", "GERENTE LOGISTICA"];

function temPermissao(cargo?: string | null) {
    return CARGOS_PERMITIDOS.includes(normalizar(cargo ?? ""));
}

function corDoStatus(status: string): CorTema | "default" {
    switch (normalizar(status)) {
        case "PROXIMO":
            return "info";
        case "PENDENTE":
            return "warning";
        case "ENTREGUE":
            return "success";
        case "CANCELADA":
            return "error";
        default:
            return "default";
    }
}

function formatarNumero(valor: number, casas = 0) {
    return valor.toLocaleString("pt-BR", {
        minimumFractionDigits: casas,
        maximumFractionDigits: casas,
    });
}

function formatarToneladas(valorKg: number) {
    return formatarNumero(valorKg / KG_POR_TONELADA, 2);
}

function limitarPercentual(valor: number) {
    return Math.min(Math.max(valor, 0), 100);
}

// Data local no formato YYYY-MM-DD (toISOString usa UTC e vira "amanhã" à noite no Brasil)
function dataLocalISO(deslocamentoDias = 0) {
    const data = new Date();
    data.setDate(data.getDate() + deslocamentoDias);

    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}

function dataEntregaISO(carga: Carga) {
    return carga.ordemCarregamento?.dataEntrega?.substring(0, 10) ?? "";
}

function estaEmAberto(carga: Carga) {
    const status = normalizar(carga.status);
    return status !== "ENTREGUE" && status !== "CANCELADA";
}

// Agrupa as cargas por uma chave (veículo, motorista, cliente...)
function agrupar(cargas: Carga[], chave: (carga: Carga) => string): Resumo[] {
    const mapa = new Map<
        string,
        Resumo & { somaAproveitamento: number; qtdAproveitamento: number }
    >();

    cargas.forEach((carga) => {
        const nome = chave(carga);

        const item = mapa.get(nome) ?? {
            nome,
            total: 0,
            entregues: 0,
            emAberto: 0,
            pesoKg: 0,
            aproveitamento: null,
            somaAproveitamento: 0,
            qtdAproveitamento: 0,
        };

        item.total += 1;
        item.pesoKg += Number(carga.pesoTotal) || 0;

        if (normalizar(carga.status) === "ENTREGUE") {
            item.entregues += 1;
        } else if (estaEmAberto(carga)) {
            item.emAberto += 1;
        }

        if (carga.aproveitamento !== null && carga.aproveitamento !== undefined) {
            item.somaAproveitamento += Number(carga.aproveitamento);
            item.qtdAproveitamento += 1;
        }

        mapa.set(nome, item);
    });

    return Array.from(mapa.values())
        .map((item) => ({
            nome: item.nome,
            total: item.total,
            entregues: item.entregues,
            emAberto: item.emAberto,
            pesoKg: item.pesoKg,
            aproveitamento:
                item.qtdAproveitamento > 0
                    ? limitarPercentual(
                        item.somaAproveitamento / item.qtdAproveitamento
                    )
                    : null,
        }))
        .sort((a, b) => b.total - a.total || b.pesoKg - a.pesoKg);
}

const cardSx = {
    height: "100%",
    borderRadius: 3,
    border: "1px solid",
    borderColor: "divider",
    boxShadow: "none",
};

function IconeColorido({ cor, children }: { cor: CorTema; children: ReactNode }) {
    return (
        <Avatar
            sx={(theme) => ({
                width: 48,
                height: 48,
                color: theme.palette[cor].main,
                backgroundColor: alpha(theme.palette[cor].main, 0.12),
            })}
        >
            {children}
        </Avatar>
    );
}

interface StatCardProps {
    label: string;
    value: string | number;
    icon: ReactNode;
    cor: CorTema;
    detalhe?: string;
}

function StatCard({ label, value, icon, cor, detalhe }: StatCardProps) {
    return (
        <Card elevation={0} sx={cardSx}>
            <CardContent>
                <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                    <IconeColorido cor={cor}>{icon}</IconeColorido>

                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" color="text.secondary">
                            {label}
                        </Typography>

                        <Typography
                            variant="h4"
                            sx={{ fontWeight: 700, lineHeight: 1.2 }}
                        >
                            {value}
                        </Typography>

                        {detalhe && (
                            <Typography variant="caption" color="text.secondary">
                                {detalhe}
                            </Typography>
                        )}
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

function TituloCard({
    icon,
    children,
}: {
    icon: ReactNode;
    children: ReactNode;
}) {
    return (
        <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", marginBottom: 2 }}
        >
            <Box sx={{ display: "flex", color: "primary.main" }}>{icon}</Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {children}
            </Typography>
        </Stack>
    );
}

function EstadoVazio({ mensagem }: { mensagem: string }) {
    return (
        <Box
            sx={{
                alignItems: "center",
                display: "flex",
                flexDirection: "column",
                gap: 1,
                paddingY: 5,
            }}
        >
            <InboxRoundedIcon sx={{ fontSize: 40, color: "text.disabled" }} />
            <Typography color="text.secondary">{mensagem}</Typography>
        </Box>
    );
}

interface RankingCardProps {
    titulo: string;
    icon: ReactNode;
    itens: Resumo[];
    vazio: string;
}

function RankingCard({ titulo, icon, itens, vazio }: RankingCardProps) {
    const maior = itens.length > 0 ? itens[0].total : 1;

    return (
        <Card elevation={0} sx={cardSx}>
            <CardContent>
                <TituloCard icon={icon}>{titulo}</TituloCard>

                {itens.length === 0 ? (
                    <EstadoVazio mensagem={vazio} />
                ) : (
                    <Stack spacing={2}>
                        {itens.map((item) => (
                            <Box key={item.nome}>
                                <Stack
                                    direction="row"
                                    sx={{
                                        justifyContent: "space-between",
                                        gap: 2,
                                        marginBottom: 0.5,
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{ fontWeight: 600 }}
                                        noWrap
                                    >
                                        {item.nome}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        sx={{ whiteSpace: "nowrap" }}
                                    >
                                        {item.total}{" "}
                                        {item.total === 1 ? "carga" : "cargas"}
                                        {" • "}
                                        {formatarToneladas(item.pesoKg)} t
                                    </Typography>
                                </Stack>

                                <LinearProgress
                                    variant="determinate"
                                    color="primary"
                                    value={(item.total / maior) * 100}
                                    sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        backgroundColor: (theme) =>
                                            alpha(theme.palette.primary.main, 0.1),
                                    }}
                                />
                            </Box>
                        ))}
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
}

function Dashboard() {
    const nomeUsuario = localStorage.getItem("nomeUsuario");
    const cargoUsuario = localStorage.getItem("cargoUsuario");

    const autorizado = temPermissao(cargoUsuario);

    const [cargas, setCargas] = useState<Carga[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    useEffect(() => {
        // Sem permissão, não busca os dados
        if (!autorizado) {
            setCarregando(false);
            return;
        }

        buscarCargas();
    }, [autorizado]);

    useEffect(() => {
        buscarCargas();
    }, []);

    async function buscarCargas() {
        try {
            setCarregando(true);
            setErro("");

            const resposta = await api.get("/cargas");

            setCargas(resposta.data);
        } catch (error) {
            console.error(error);
            setErro("Não foi possível carregar os dados do dashboard.");
        } finally {
            setCarregando(false);
        }
    }

    const metricas = useMemo(() => {
        const hoje = dataLocalISO();
        const daquiSeteDias = dataLocalISO(7);

        const total = cargas.length;

        const contar = (status: string) =>
            cargas.filter((carga) => normalizar(carga.status) === status).length;

        const pendentes = contar("PENDENTE");
        const proximas = contar("PROXIMO");
        const entregues = contar("ENTREGUE");
        const canceladas = contar("CANCELADA");

        // Cargas "válidas" para as estatísticas: ignora as canceladas
        const validas = cargas.filter(
            (carga) => normalizar(carga.status) !== "CANCELADA"
        );

        // Aproveitamento médio dos veículos
        const comAproveitamento = validas.filter(
            (carga) =>
                carga.aproveitamento !== null && carga.aproveitamento !== undefined
        );

        const aproveitamentoMedio = limitarPercentual(
            comAproveitamento.length > 0
                ? comAproveitamento.reduce(
                    (soma, carga) => soma + Number(carga.aproveitamento),
                    0
                ) / comAproveitamento.length
                : 0
        );

        // Entregas por data
        const entregasHoje = validas.filter(
            (carga) => dataEntregaISO(carga) === hoje
        );

        const atrasadas = validas.filter((carga) => {
            const data = dataEntregaISO(carga);
            return estaEmAberto(carga) && data !== "" && data < hoje;
        });

        const proximosSeteDias = validas.filter((carga) => {
            const data = dataEntregaISO(carga);
            return estaEmAberto(carga) && data > hoje && data <= daquiSeteDias;
        });

        // Percentuais
        const percentualEntregue =
            validas.length > 0 ? (entregues / validas.length) * 100 : 0;

        const taxaCancelamento = total > 0 ? (canceladas / total) * 100 : 0;

        // Peso (em kg; convertido na hora de exibir)
        const pesoDaCarga = (carga: Carga) => Number(carga.pesoTotal) || 0;

        const pesoTotalKg = validas.reduce(
            (soma, carga) => soma + pesoDaCarga(carga),
            0
        );

        const pesoEntregueKg = validas
            .filter((carga) => normalizar(carga.status) === "ENTREGUE")
            .reduce((soma, carga) => soma + pesoDaCarga(carga), 0);

        const pesoRestanteKg = pesoTotalKg - pesoEntregueKg;

        const percentualPesoEntregue =
            pesoTotalKg > 0 ? (pesoEntregueKg / pesoTotalKg) * 100 : 0;

        const pesoMedioKg = validas.length > 0 ? pesoTotalKg / validas.length : 0;

        // Rankings (sempre sobre cargas não canceladas)
        const porVeiculo = agrupar(
            validas,
            (carga) =>
                carga.ordemCarregamento?.veiculo?.placaVeiculo || "Sem veículo"
        );

        const porMotorista = agrupar(
            validas,
            (carga) => carga.ordemCarregamento?.motorista || "Sem motorista"
        );

        const porCliente = agrupar(
            validas,
            (carga) =>
                carga.ordemCarregamento?.cliente?.nomeCliente || "Sem cliente"
        );

        const veiculosEmOperacao = porVeiculo.filter(
            (item) => item.nome !== "Sem veículo"
        ).length;

        const mediaCargasPorVeiculo =
            veiculosEmOperacao > 0
                ? (validas.length -
                    (porVeiculo.find((item) => item.nome === "Sem veículo")
                        ?.total ?? 0)) /
                veiculosEmOperacao
                : 0;

        return {
            total,
            pendentes,
            proximas,
            entregues,
            canceladas,
            aproveitamentoMedio,
            entregasHoje,
            atrasadas,
            proximosSeteDias,
            percentualEntregue,
            taxaCancelamento,
            pesoTotalKg,
            pesoEntregueKg,
            pesoRestanteKg,
            percentualPesoEntregue,
            pesoMedioKg,
            porVeiculo,
            porMotorista,
            porCliente,
            veiculosEmOperacao,
            mediaCargasPorVeiculo,
        };
    }, [cargas]);

    if (!autorizado) {
        return (
            <Box>
                <Header />

                <Sidebar />

                <Box
                    component="main"
                    sx={{
                        marginLeft: { xs: 0, md: "240px" },
                        padding: 3,
                        paddingTop: 10,
                    }}
                >
                    <PageHeader
                        title="Dashboard"
                        description={`Bem-vindo, ${nomeUsuario ?? ""}!`}
                    />

                    <Alert
                        severity="warning"
                        icon={<LockRoundedIcon />}
                        sx={{ marginTop: 2 }}
                    >
                        Você não tem permissão para visualizar os indicadores do
                        dashboard.
                    </Alert>
                </Box>
            </Box>
        );
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
                    title="Dashboard"
                    description={`Bem-vindo, ${nomeUsuario ?? ""}! Acompanhe os indicadores das cargas`}
                />

                {erro && (
                    <Alert severity="error" sx={{ marginBottom: 3 }}>
                        {erro}
                    </Alert>
                )}

                {carregando ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            minHeight: "300px",
                        }}
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                        {/* STATUS DAS CARGAS */}
                        <Box
                            sx={{
                                display: "grid",
                                gap: 3,
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, 1fr)",
                                    lg: "repeat(5, 1fr)",
                                },
                            }}
                        >
                            <StatCard
                                label="Total de cargas"
                                value={metricas.total}
                                icon={<LocalShippingRoundedIcon />}
                                cor="primary"
                            />
                            <StatCard
                                label="Pendentes"
                                value={metricas.pendentes}
                                icon={<PendingActionsRoundedIcon />}
                                cor="warning"
                            />
                            <StatCard
                                label="Próximas"
                                value={metricas.proximas}
                                icon={<ScheduleRoundedIcon />}
                                cor="info"
                            />
                            <StatCard
                                label="Entregues"
                                value={metricas.entregues}
                                icon={<CheckCircleRoundedIcon />}
                                cor="success"
                            />
                            <StatCard
                                label="Canceladas"
                                value={metricas.canceladas}
                                icon={<CancelRoundedIcon />}
                                cor="error"
                            />
                        </Box>

                        {/* PRAZOS E OPERAÇÃO */}
                        <Box
                            sx={{
                                display: "grid",
                                gap: 3,
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(2, 1fr)",
                                    lg: "repeat(4, 1fr)",
                                },
                            }}
                        >
                            <StatCard
                                label="Entregas hoje"
                                value={metricas.entregasHoje.length}
                                icon={<EventAvailableRoundedIcon />}
                                cor="info"
                            />
                            <StatCard
                                label="Entregas atrasadas"
                                value={metricas.atrasadas.length}
                                icon={<EventBusyRoundedIcon />}
                                cor="error"
                                detalhe="Data vencida e ainda não entregues"
                            />
                            <StatCard
                                label="Próximos 7 dias"
                                value={metricas.proximosSeteDias.length}
                                icon={<UpcomingRoundedIcon />}
                                cor="warning"
                                detalhe="Entregas em aberto"
                            />
                            <StatCard
                                label="Taxa de cancelamento"
                                value={`${formatarNumero(metricas.taxaCancelamento, 1)}%`}
                                icon={<BlockRoundedIcon />}
                                cor="error"
                                detalhe="Sobre o total de cargas"
                            />

                            <StatCard
                                label="Veículos em operação"
                                value={metricas.veiculosEmOperacao}
                                icon={<DirectionsCarRoundedIcon />}
                                cor="primary"
                                detalhe="Com ao menos uma carga"
                            />
                            <StatCard
                                label="Média de cargas por veículo"
                                value={formatarNumero(metricas.mediaCargasPorVeiculo, 1)}
                                icon={<SwapVertRoundedIcon />}
                                cor="primary"
                            />
                            <StatCard
                                label="Peso médio por carga"
                                value={`${formatarToneladas(metricas.pesoMedioKg)} t`}
                                icon={<ScaleRoundedIcon />}
                                cor="info"
                            />
                            <StatCard
                                label="Percentual entregue"
                                value={`${formatarNumero(metricas.percentualEntregue, 1)}%`}
                                icon={<CheckCircleRoundedIcon />}
                                cor="success"
                                detalhe="Das cargas não canceladas"
                            />
                        </Box>

                        {/* APROVEITAMENTO + PESO */}
                        <Box
                            sx={{
                                display: "grid",
                                gap: 3,
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    lg: "1fr 2fr",
                                },
                            }}
                        >
                            <Card elevation={0} sx={cardSx}>
                                <CardContent>
                                    <TituloCard icon={<SpeedRoundedIcon />}>
                                        Aproveitamento médio
                                    </TituloCard>

                                    <Stack
                                        direction="row"
                                        spacing={3}
                                        sx={{ alignItems: "center" }}
                                    >
                                        <Box
                                            sx={{
                                                position: "relative",
                                                display: "inline-flex",
                                            }}
                                        >
                                            <CircularProgress
                                                variant="determinate"
                                                value={100}
                                                size={90}
                                                thickness={5}
                                                sx={{
                                                    position: "absolute",
                                                    color: (theme) =>
                                                        alpha(
                                                            theme.palette.primary.main,
                                                            0.12
                                                        ),
                                                }}
                                            />

                                            <CircularProgress
                                                variant="determinate"
                                                color="primary"
                                                value={metricas.aproveitamentoMedio}
                                                size={90}
                                                thickness={5}
                                            />

                                            <Box
                                                sx={{
                                                    inset: 0,
                                                    position: "absolute",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <Typography
                                                    variant="body1"
                                                    sx={{ fontWeight: 700 }}
                                                >
                                                    {formatarNumero(
                                                        metricas.aproveitamentoMedio,
                                                        1
                                                    )}
                                                    %
                                                </Typography>
                                            </Box>
                                        </Box>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Média de ocupação dos veículos nas cargas
                                            não canceladas.
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>

                            <Card elevation={0} sx={cardSx}>
                                <CardContent>
                                    <TituloCard icon={<ScaleRoundedIcon />}>
                                        Peso das cargas
                                    </TituloCard>

                                    <Box
                                        sx={{
                                            display: "grid",
                                            gap: 3,
                                            gridTemplateColumns: {
                                                xs: "1fr",
                                                md: "repeat(3, 1fr)",
                                            },
                                        }}
                                    >
                                        <Box>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Total
                                            </Typography>
                                            <Typography
                                                variant="h4"
                                                sx={{ fontWeight: 700 }}
                                            >
                                                {formatarToneladas(metricas.pesoTotalKg)} t
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Já entregue
                                            </Typography>
                                            <Typography
                                                variant="h4"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: "success.main",
                                                }}
                                            >
                                                {formatarToneladas(
                                                    metricas.pesoEntregueKg
                                                )}{" "}
                                                t
                                            </Typography>
                                        </Box>

                                        <Box>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Falta entregar
                                            </Typography>
                                            <Typography
                                                variant="h4"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: "warning.main",
                                                }}
                                            >
                                                {formatarToneladas(
                                                    metricas.pesoRestanteKg
                                                )}{" "}
                                                t
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ marginTop: 3 }}>
                                        <Stack
                                            direction="row"
                                            sx={{
                                                justifyContent: "space-between",
                                                marginBottom: 0.5,
                                            }}
                                        >
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Progresso de entrega por peso
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                sx={{ fontWeight: 600 }}
                                            >
                                                {formatarNumero(
                                                    metricas.percentualPesoEntregue,
                                                    1
                                                )}
                                                %
                                            </Typography>
                                        </Stack>

                                        <LinearProgress
                                            variant="determinate"
                                            color="success"
                                            value={limitarPercentual(
                                                metricas.percentualPesoEntregue
                                            )}
                                            sx={{
                                                height: 10,
                                                borderRadius: 5,
                                                backgroundColor: (theme) =>
                                                    alpha(
                                                        theme.palette.success.main,
                                                        0.12
                                                    ),
                                            }}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Box>

                        {/* CARGAS POR CAMINHÃO */}
                        <Card elevation={0} sx={cardSx}>
                            <CardContent>
                                <TituloCard icon={<DirectionsCarRoundedIcon />}>
                                    Cargas por caminhão
                                </TituloCard>

                                {metricas.porVeiculo.length === 0 ? (
                                    <EstadoVazio mensagem="Nenhuma carga cadastrada." />
                                ) : (
                                    <>
                                        <TableContainer
                                            component={Paper}
                                            elevation={0}
                                            sx={{
                                                border: "1px solid",
                                                borderColor: "divider",
                                            }}
                                        >
                                            <Table>
                                                <TableHead>
                                                    <TableRow
                                                        sx={{
                                                            "& th": {
                                                                fontWeight: 700,
                                                                color: "text.secondary",
                                                                backgroundColor: (
                                                                    theme
                                                                ) =>
                                                                    alpha(
                                                                        theme.palette
                                                                            .primary
                                                                            .main,
                                                                        0.04
                                                                    ),
                                                            },
                                                        }}
                                                    >
                                                        <TableCell>Veículo</TableCell>
                                                        <TableCell sx={{ minWidth: 160 }}>
                                                            Cargas
                                                        </TableCell>
                                                        <TableCell>Entregues</TableCell>
                                                        <TableCell>Em aberto</TableCell>
                                                        <TableCell>Peso</TableCell>
                                                        <TableCell>Aproveitamento</TableCell>
                                                    </TableRow>
                                                </TableHead>

                                                <TableBody>
                                                    {metricas.porVeiculo
                                                        .slice(0, LIMITE_VEICULOS)
                                                        .map((veiculo) => (
                                                            <TableRow
                                                                key={veiculo.nome}
                                                                hover
                                                                sx={{
                                                                    "&:last-child td": {
                                                                        borderBottom:
                                                                            "none",
                                                                    },
                                                                }}
                                                            >
                                                                <TableCell
                                                                    sx={{ fontWeight: 600 }}
                                                                >
                                                                    {veiculo.nome}
                                                                </TableCell>

                                                                <TableCell>
                                                                    <Stack
                                                                        direction="row"
                                                                        spacing={1.5}
                                                                        sx={{
                                                                            alignItems:
                                                                                "center",
                                                                        }}
                                                                    >
                                                                        <Typography
                                                                            variant="body2"
                                                                            sx={{
                                                                                fontWeight: 700,
                                                                                minWidth: 24,
                                                                            }}
                                                                        >
                                                                            {veiculo.total}
                                                                        </Typography>
                                                                        <LinearProgress
                                                                            variant="determinate"
                                                                            color="primary"
                                                                            value={
                                                                                (veiculo.total /
                                                                                    metricas
                                                                                        .porVeiculo[0]
                                                                                        .total) *
                                                                                100
                                                                            }
                                                                            sx={{
                                                                                flex: 1,
                                                                                height: 8,
                                                                                borderRadius: 4,
                                                                                backgroundColor:
                                                                                    (theme) =>
                                                                                        alpha(
                                                                                            theme
                                                                                                .palette
                                                                                                .primary
                                                                                                .main,
                                                                                            0.1
                                                                                        ),
                                                                            }}
                                                                        />
                                                                    </Stack>
                                                                </TableCell>

                                                                <TableCell>
                                                                    <Chip
                                                                        label={
                                                                            veiculo.entregues
                                                                        }
                                                                        size="small"
                                                                        color="success"
                                                                        variant="outlined"
                                                                        sx={{
                                                                            fontWeight: 600,
                                                                        }}
                                                                    />
                                                                </TableCell>

                                                                <TableCell>
                                                                    <Chip
                                                                        label={
                                                                            veiculo.emAberto
                                                                        }
                                                                        size="small"
                                                                        color="warning"
                                                                        variant="outlined"
                                                                        sx={{
                                                                            fontWeight: 600,
                                                                        }}
                                                                    />
                                                                </TableCell>

                                                                <TableCell>
                                                                    {formatarToneladas(
                                                                        veiculo.pesoKg
                                                                    )}{" "}
                                                                    t
                                                                </TableCell>

                                                                <TableCell>
                                                                    {veiculo.aproveitamento !==
                                                                        null
                                                                        ? `${formatarNumero(
                                                                            veiculo.aproveitamento,
                                                                            1
                                                                        )}%`
                                                                        : "-"}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>

                                        {metricas.porVeiculo.length > LIMITE_VEICULOS && (
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{ display: "block", marginTop: 1 }}
                                            >
                                                Mostrando {LIMITE_VEICULOS} de{" "}
                                                {metricas.porVeiculo.length} veículos
                                            </Typography>
                                        )}
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* RANKINGS */}
                        <Box
                            sx={{
                                display: "grid",
                                gap: 3,
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    lg: "repeat(2, 1fr)",
                                },
                            }}
                        >
                            <RankingCard
                                titulo="Cargas por motorista"
                                icon={<PersonRoundedIcon />}
                                itens={metricas.porMotorista.slice(0, LIMITE_RANKING)}
                                vazio="Nenhuma carga com motorista."
                            />

                            <RankingCard
                                titulo="Cargas por cliente"
                                icon={<BusinessRoundedIcon />}
                                itens={metricas.porCliente.slice(0, LIMITE_RANKING)}
                                vazio="Nenhuma carga com cliente."
                            />
                        </Box>

                        {/* ENTREGAS DE HOJE */}
                        <Card elevation={0} sx={cardSx}>
                            <CardContent>
                                <TituloCard icon={<EventAvailableRoundedIcon />}>
                                    Entregas agendadas para hoje
                                </TituloCard>

                                {metricas.entregasHoje.length === 0 ? (
                                    <EstadoVazio mensagem="Nenhuma entrega agendada para hoje." />
                                ) : (
                                    <TableContainer
                                        component={Paper}
                                        elevation={0}
                                        sx={{
                                            border: "1px solid",
                                            borderColor: "divider",
                                        }}
                                    >
                                        <Table>
                                            <TableHead>
                                                <TableRow
                                                    sx={{
                                                        "& th": {
                                                            fontWeight: 700,
                                                            color: "text.secondary",
                                                            backgroundColor: (theme) =>
                                                                alpha(
                                                                    theme.palette.primary
                                                                        .main,
                                                                    0.04
                                                                ),
                                                        },
                                                    }}
                                                >
                                                    <TableCell>Pedido</TableCell>
                                                    <TableCell>Cliente</TableCell>
                                                    <TableCell>Endereço</TableCell>
                                                    <TableCell>Motorista</TableCell>
                                                    <TableCell>Veículo</TableCell>
                                                    <TableCell>Status</TableCell>
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                {metricas.entregasHoje.map((carga) => (
                                                    <TableRow
                                                        key={carga.idCarga}
                                                        hover
                                                        sx={{
                                                            "&:last-child td": {
                                                                borderBottom: "none",
                                                            },
                                                        }}
                                                    >
                                                        <TableCell>
                                                            {
                                                                carga.ordemCarregamento
                                                                    .numeroPedido
                                                            }
                                                        </TableCell>

                                                        <TableCell>
                                                            {
                                                                carga.ordemCarregamento
                                                                    .cliente.nomeCliente
                                                            }
                                                        </TableCell>

                                                        <TableCell>
                                                            {
                                                                carga.ordemCarregamento
                                                                    .endereco
                                                            }
                                                        </TableCell>

                                                        <TableCell>
                                                            {carga.ordemCarregamento
                                                                .motorista || "-"}
                                                        </TableCell>

                                                        <TableCell>
                                                            {carga.ordemCarregamento
                                                                .veiculo?.placaVeiculo ||
                                                                "-"}
                                                        </TableCell>

                                                        <TableCell>
                                                            <Chip
                                                                label={carga.status}
                                                                size="small"
                                                                color={corDoStatus(
                                                                    carga.status
                                                                )}
                                                                sx={{ fontWeight: 600 }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default Dashboard;