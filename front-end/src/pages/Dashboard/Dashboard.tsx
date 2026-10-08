import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    LinearProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Avatar,
    Stack,
} from "@mui/material";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import InboxRoundedIcon from "@mui/icons-material/InboxRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import ScaleRoundedIcon from "@mui/icons-material/ScaleRounded";

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
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

// Paleta central do dashboard — fácil de ajustar em um só lugar
const palette = {
    total: { main: "#2563eb", bg: "#eaf1fe" }, // azul
    pendente: { main: "#f59e0b", bg: "#fef6e7" }, // âmbar
    proxima: { main: "#8b5cf6", bg: "#f3eefe" }, // roxo
    entregue: { main: "#16a34a", bg: "#eaf7ee" }, // verde
    cancelada: { main: "#dc2626", bg: "#fdecec" }, // vermelho
};

// O backend envia o peso em kg. Se já vier em toneladas, troque para 1.
const KG_POR_TONELADA = 1000;

function statusColor(status: string) {
    const s = status?.toUpperCase();
    if (s === "ENTREGUE") return { color: "success" as const };
    if (s === "PENDENTE") return { color: "warning" as const };
    if (s === "PRÓXIMO") return { color: "secondary" as const };
    if (s === "CANCELADA") return { color: "error" as const };
    return { color: "default" as const };
}

function formatarToneladas(valor: number) {
    return valor.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
}

interface StatCardProps {
    label: string;
    value: number;
    icon: React.ReactNode;
    tone: { main: string; bg: string };
}

function StatCard({ label, value, icon, tone }: StatCardProps) {
    return (
        <Card
            elevation={0}
            sx={{
                height: "100%",
                borderRadius: 3,
                border: "1px solid #eef0f3",
                boxShadow: "0 2px 10px rgba(20, 20, 43, 0.04)",
            }}
        >
            <CardContent>
                <Stack
                    direction="row"
                    spacing={2}
                    sx={{ alignItems: "center" }}
                >
                    <Avatar
                        sx={{
                            bgcolor: tone.bg,
                            color: tone.main,
                            width: 48,
                            height: 48,
                        }}
                    >
                        {icon}
                    </Avatar>

                    <Box>
                        <Typography variant="body2" color="text.secondary">
                            {label}
                        </Typography>

                        <Typography
                            variant="h4"
                            sx={{ fontWeight: 700, lineHeight: 1.2 }}
                        >
                            {value}
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

function Dashboard() {
    const nomeUsuario = localStorage.getItem("nomeUsuario");

    const [cargas, setCargas] = useState<Carga[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

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

    // Quantidade total de cargas
    const totalCargas = cargas.length;

    // Quantidade por status
    const cargasPendentes = cargas.filter(
        (carga) => carga.status?.toUpperCase() === "PENDENTE"
    ).length;

    const cargasProximas = cargas.filter(
        (carga) => carga.status?.toUpperCase() === "PRÓXIMO"
    ).length;

    const cargasEntregues = cargas.filter(
        (carga) => carga.status?.toUpperCase() === "ENTREGUE"
    ).length;

    // Quantidade de cargas canceladas
    const cargasCanceladas = cargas.filter(
        (carga) => carga.status?.toUpperCase() === "CANCELADA"
    ).length;

    // Cargas "válidas" para fins estatísticos (aproveitamento, percentual entregue e peso)
    // -> ignora tudo que foi cancelada
    const cargasNaoCanceladas = cargas.filter(
        (carga) => carga.status?.toUpperCase() !== "CANCELADA"
    );

    // Calcula o aproveitamento médio (desconsiderando canceladas)
    const cargasComAproveitamento = cargasNaoCanceladas.filter(
        (carga) =>
            carga.aproveitamento !== null &&
            carga.aproveitamento !== undefined
    );

    const aproveitamentoMedioBruto =
        cargasComAproveitamento.length > 0
            ? cargasComAproveitamento.reduce(
                (total, carga) => total + Number(carga.aproveitamento),
                0
            ) / cargasComAproveitamento.length
            : 0;

    // Blindagem contra valores vindos da API fora da faixa 0–100
    // (evita algo como "14562.5%" quebrar o layout do card)
    const aproveitamentoMedio = Math.min(
        Math.max(aproveitamentoMedioBruto, 0),
        100
    );

    // Data atual no formato YYYY-MM-DD
    const hoje = new Date().toISOString().split("T")[0];

    // Entregas agendadas para hoje (cargas canceladas nunca entram aqui)
    const entregasHoje = cargas.filter((carga) => {
        if (carga.status?.toUpperCase() === "CANCELADA") {
            return false;
        }

        if (!carga.ordemCarregamento?.dataEntrega) {
            return false;
        }

        return carga.ordemCarregamento.dataEntrega.substring(0, 10) === hoje;
    });

    // Percentual entregue tem como base as cargas não canceladas
    const percentualEntregue =
        cargasNaoCanceladas.length > 0
            ? (cargasEntregues / cargasNaoCanceladas.length) * 100
            : 0;

    // ----- PESO (em toneladas) -----
    const pesoDaCarga = (carga: Carga) => Number(carga.pesoTotal) || 0;

    // Total considera apenas cargas não canceladas
    const pesoTotalToneladas =
        cargasNaoCanceladas.reduce(
            (total, carga) => total + pesoDaCarga(carga),
            0
        ) / KG_POR_TONELADA;

    const pesoEntregueToneladas =
        cargasNaoCanceladas
            .filter((carga) => carga.status?.toUpperCase() === "ENTREGUE")
            .reduce((total, carga) => total + pesoDaCarga(carga), 0) /
        KG_POR_TONELADA;

    const pesoRestanteToneladas = pesoTotalToneladas - pesoEntregueToneladas;

    const percentualPesoEntregue =
        pesoTotalToneladas > 0
            ? (pesoEntregueToneladas / pesoTotalToneladas) * 100
            : 0;

    return (
        <Box>
            <Header />
            <Sidebar />

            <Box
                component="main"
                sx={{
                    marginLeft: "240px",
                    padding: 4,
                    paddingTop: 10,
                    backgroundColor: "#f5f6f8",
                    minHeight: "100vh",
                }}
            >
                {/* Título */}
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    Dashboard
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ marginTop: 0.5, marginBottom: 4 }}
                >
                    Bem-vindo, {nomeUsuario}!
                </Typography>

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
                    <>
                        {/* CARDS PRINCIPAIS */}
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StatCard
                                    label="Total de cargas"
                                    value={totalCargas}
                                    icon={<LocalShippingRoundedIcon />}
                                    tone={palette.total}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StatCard
                                    label="Cargas pendentes"
                                    value={cargasPendentes}
                                    icon={<PendingActionsRoundedIcon />}
                                    tone={palette.pendente}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StatCard
                                    label="Cargas próximas"
                                    value={cargasProximas}
                                    icon={<ScheduleRoundedIcon />}
                                    tone={palette.proxima}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StatCard
                                    label="Cargas entregues"
                                    value={cargasEntregues}
                                    icon={<CheckCircleRoundedIcon />}
                                    tone={palette.entregue}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StatCard
                                    label="Cargas canceladas"
                                    value={cargasCanceladas}
                                    icon={<CancelRoundedIcon />}
                                    tone={palette.cancelada}
                                />
                            </Grid>
                        </Grid>

                        {/* SEGUNDA LINHA */}
                        <Grid container spacing={3} sx={{ marginTop: 0.5 }}>
                            {/* Aproveitamento */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        height: "100%",
                                        borderRadius: 3,
                                        border: "1px solid #eef0f3",
                                        boxShadow:
                                            "0 2px 10px rgba(20, 20, 43, 0.04)",
                                    }}
                                >
                                    <CardContent>
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            sx={{
                                                alignItems: "center",
                                                marginBottom: 2,
                                            }}
                                        >
                                            <SpeedRoundedIcon
                                                fontSize="small"
                                                sx={{ color: "#2563eb" }}
                                            />
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                            >
                                                Aproveitamento médio dos
                                                veículos
                                            </Typography>
                                        </Stack>

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
                                                        color: "#eef0f3",
                                                        position: "absolute",
                                                    }}
                                                />

                                                <CircularProgress
                                                    variant="determinate"
                                                    value={aproveitamentoMedio}
                                                    size={90}
                                                    thickness={5}
                                                    sx={{ color: "#2563eb" }}
                                                />

                                                <Box
                                                    sx={{
                                                        top: 0,
                                                        left: 0,
                                                        bottom: 0,
                                                        right: 0,
                                                        position: "absolute",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="body1"
                                                        sx={{
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        {aproveitamentoMedio.toFixed(
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
                                                Média de ocupação dos veículos
                                                considerando as cargas
                                                cadastradas.
                                            </Typography>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Entregas de hoje */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <StatCard
                                    label="Entregas agendadas hoje"
                                    value={entregasHoje.length}
                                    icon={<EventAvailableRoundedIcon />}
                                    tone={palette.proxima}
                                />
                            </Grid>

                            {/* Percentual entregue */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        height: "100%",
                                        borderRadius: 3,
                                        border: "1px solid #eef0f3",
                                        boxShadow:
                                            "0 2px 10px rgba(20, 20, 43, 0.04)",
                                    }}
                                >
                                    <CardContent>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Percentual entregue
                                        </Typography>

                                        <Typography
                                            variant="h3"
                                            sx={{
                                                marginTop: 1,
                                                fontWeight: 700,
                                                color: palette.entregue.main,
                                            }}
                                        >
                                            {percentualEntregue.toFixed(1)}%
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ marginTop: 1 }}
                                        >
                                            Das cargas cadastradas
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* PESO TOTAL */}
                        <Card
                            elevation={0}
                            sx={{
                                marginTop: 3,
                                borderRadius: 3,
                                border: "1px solid #eef0f3",
                                boxShadow: "0 2px 10px rgba(20, 20, 43, 0.04)",
                            }}
                        >
                            <CardContent>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    sx={{
                                        alignItems: "center",
                                        marginBottom: 2,
                                    }}
                                >
                                    <ScaleRoundedIcon
                                        fontSize="small"
                                        sx={{ color: palette.total.main }}
                                    />
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Peso total das cargas
                                    </Typography>
                                </Stack>

                                <Grid
                                    container
                                    spacing={3}
                                    sx={{ alignItems: "center" }}
                                >
                                    <Grid size={{ xs: 12, md: 4 }}>
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
                                            {formatarToneladas(
                                                pesoTotalToneladas
                                            )}{" "}
                                            t
                                        </Typography>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
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
                                                color: palette.entregue.main,
                                            }}
                                        >
                                            {formatarToneladas(
                                                pesoEntregueToneladas
                                            )}{" "}
                                            t
                                        </Typography>
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
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
                                                color: palette.pendente.main,
                                            }}
                                        >
                                            {formatarToneladas(
                                                pesoRestanteToneladas
                                            )}{" "}
                                            t
                                        </Typography>
                                    </Grid>
                                </Grid>

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
                                            {percentualPesoEntregue.toFixed(1)}
                                            %
                                        </Typography>
                                    </Stack>

                                    <LinearProgress
                                        variant="determinate"
                                        value={Math.min(
                                            percentualPesoEntregue,
                                            100
                                        )}
                                        sx={{
                                            height: 10,
                                            borderRadius: 5,
                                            backgroundColor: "#eef0f3",
                                            "& .MuiLinearProgress-bar": {
                                                backgroundColor:
                                                    palette.entregue.main,
                                                borderRadius: 5,
                                            },
                                        }}
                                    />
                                </Box>
                            </CardContent>
                        </Card>

                        {/* ENTREGAS DE HOJE */}
                        <Card
                            elevation={0}
                            sx={{
                                marginTop: 3,
                                borderRadius: 3,
                                border: "1px solid #eef0f3",
                                boxShadow: "0 2px 10px rgba(20, 20, 43, 0.04)",
                            }}
                        >
                            <CardContent>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        marginBottom: 2,
                                        fontWeight: 700,
                                    }}
                                >
                                    Entregas agendadas para hoje
                                </Typography>

                                {entregasHoje.length === 0 ? (
                                    <Box
                                        sx={{
                                            alignItems: "center",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 1,
                                            paddingY: 5,
                                        }}
                                    >
                                        <InboxRoundedIcon
                                            sx={{
                                                fontSize: 40,
                                                color: "text.disabled",
                                            }}
                                        />
                                        <Typography color="text.secondary">
                                            Nenhuma entrega agendada para
                                            hoje.
                                        </Typography>
                                    </Box>
                                ) : (
                                    <TableContainer
                                        component={Paper}
                                        elevation={0}
                                        sx={{ border: "1px solid #eef0f3" }}
                                    >
                                        <Table>
                                            <TableHead>
                                                <TableRow
                                                    sx={{
                                                        "& th": {
                                                            fontWeight: 700,
                                                            backgroundColor:
                                                                "#f8f9fb",
                                                            color: "text.secondary",
                                                        },
                                                    }}
                                                >
                                                    <TableCell>
                                                        Pedido
                                                    </TableCell>
                                                    <TableCell>
                                                        Cliente
                                                    </TableCell>
                                                    <TableCell>
                                                        Endereço
                                                    </TableCell>
                                                    <TableCell>
                                                        Motorista
                                                    </TableCell>
                                                    <TableCell>
                                                        Veículo
                                                    </TableCell>
                                                    <TableCell>
                                                        Status
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>

                                            <TableBody>
                                                {entregasHoje.map((carga) => (
                                                    <TableRow
                                                        key={carga.idCarga}
                                                        hover
                                                        sx={{
                                                            "&:last-child td":
                                                            {
                                                                borderBottom:
                                                                    "none",
                                                            },
                                                        }}
                                                    >
                                                        <TableCell>
                                                            {
                                                                carga
                                                                    .ordemCarregamento
                                                                    .numeroPedido
                                                            }
                                                        </TableCell>

                                                        <TableCell>
                                                            {
                                                                carga
                                                                    .ordemCarregamento
                                                                    .cliente
                                                                    .nomeCliente
                                                            }
                                                        </TableCell>

                                                        <TableCell>
                                                            {
                                                                carga
                                                                    .ordemCarregamento
                                                                    .endereco
                                                            }
                                                        </TableCell>

                                                        <TableCell>
                                                            {carga
                                                                .ordemCarregamento
                                                                .motorista ||
                                                                "-"}
                                                        </TableCell>

                                                        <TableCell>
                                                            {carga
                                                                .ordemCarregamento
                                                                .veiculo
                                                                ?.placaVeiculo ||
                                                                "-"}
                                                        </TableCell>

                                                        <TableCell>
                                                            <Chip
                                                                label={
                                                                    carga.status
                                                                }
                                                                size="small"
                                                                color={
                                                                    statusColor(
                                                                        carga.status
                                                                    ).color
                                                                }
                                                                sx={{
                                                                    fontWeight: 600,
                                                                }}
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
                    </>
                )}
            </Box>
        </Box>
    );
}

export default Dashboard;