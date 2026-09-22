import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
} from "@mui/material";

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

    // Calcula o aproveitamento médio
    const cargasComAproveitamento = cargas.filter(
        (carga) =>
            carga.aproveitamento !== null &&
            carga.aproveitamento !== undefined
    );

    const aproveitamentoMedio =
        cargasComAproveitamento.length > 0
            ? cargasComAproveitamento.reduce(
                  (total, carga) => total + Number(carga.aproveitamento),
                  0
              ) / cargasComAproveitamento.length
            : 0;

    // Data atual no formato YYYY-MM-DD
    const hoje = new Date().toISOString().split("T")[0];

    // Entregas agendadas para hoje
    const entregasHoje = cargas.filter((carga) => {
        if (!carga.ordemCarregamento?.dataEntrega) {
            return false;
        }

        return carga.ordemCarregamento.dataEntrega.substring(0, 10) === hoje;
    });

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
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                    Dashboard
                </Typography>

                <Typography
                    variant="body1"
                    sx={{ marginTop: 1, marginBottom: 4 }}
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
                            {/* Total */}
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Card>
                                    <CardContent>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Total de cargas
                                        </Typography>

                                        <Typography
                                            variant="h3"
                                            sx={{
                                                marginTop: 1,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {totalCargas}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Pendentes */}
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Card>
                                    <CardContent>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Cargas pendentes
                                        </Typography>

                                        <Typography
                                            variant="h3"
                                            sx={{
                                                marginTop: 1,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {cargasPendentes}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Próximas */}
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Card>
                                    <CardContent>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Cargas próximas
                                        </Typography>

                                        <Typography
                                            variant="h3"
                                            sx={{
                                                marginTop: 1,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {cargasProximas}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Entregues */}
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Card>
                                    <CardContent>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Cargas entregues
                                        </Typography>

                                        <Typography
                                            variant="h3"
                                            sx={{
                                                marginTop: 1,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {cargasEntregues}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* SEGUNDA LINHA */}
                        <Grid
                            container
                            spacing={3}
                            sx={{ marginTop: 0 }}
                        >
                            {/* Aproveitamento */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Card>
                                    <CardContent>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Aproveitamento médio dos veículos
                                        </Typography>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 3,
                                                marginTop: 2,
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    position: "relative",
                                                    display: "inline-flex",
                                                }}
                                            >
                                                <CircularProgress
                                                    variant="determinate"
                                                    value={Math.min(
                                                        aproveitamentoMedio,
                                                        100
                                                    )}
                                                    size={90}
                                                    thickness={5}
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
                                                        sx={{ fontWeight: "bold" }}
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
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Entregas de hoje */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Card>
                                    <CardContent>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Entregas agendadas hoje
                                        </Typography>

                                        <Typography
                                            variant="h3"
                                            sx={{
                                                marginTop: 1,
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {entregasHoje.length}
                                        </Typography>

                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ marginTop: 1 }}
                                        >
                                            {entregasHoje.length === 1
                                                ? "entrega programada para hoje"
                                                : "entregas programadas para hoje"}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Percentual entregue */}
                            <Grid size={{ xs: 12, md: 4 }}>
                                <Card>
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
                                                fontWeight: "bold",
                                            }}
                                        >
                                            {totalCargas > 0
                                                ? (
                                                      (cargasEntregues /
                                                          totalCargas) *
                                                      100
                                                  ).toFixed(1)
                                                : "0.0"}
                                            %
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

                        {/* ENTREGAS DE HOJE */}
                        <Card sx={{ marginTop: 3 }}>
                            <CardContent>
                                <Typography
                                    variant="h6"

                                    sx={{
                                        marginBottom: 2,
                                        fontWeight: "bold",
                                    }}
                                >
                                    Entregas agendadas para hoje
                                </Typography>

                                {entregasHoje.length === 0 ? (
                                    <Typography color="text.secondary">
                                        Nenhuma entrega agendada para hoje.
                                    </Typography>
                                ) : (
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
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

