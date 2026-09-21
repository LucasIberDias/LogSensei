import { useEffect, useState } from "react";

import {
    Box,
    Paper,
    Typography,
    Chip,
    Button,
} from "@mui/material";

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import api from "../../services/api";

interface Carga {
    idCarga: number;
    localSaida: string;
    transportadora: string;
    notaFiscal: string;
    status: string;
    pesoTotal: number;
    aproveitamento: number;

    ordemCarregamento: {
        idOrdemCarregamento: number;

        cliente: {
            codigoCliente: number;
            nomeCliente: string;
        };

        endereco: string;
        numeroPedido: string;
        vencimento: string;

        item: {
            codigoProduto: number;
            quantidade: number;
            valorUnitario: number;
            produto: {
                codigoProduto: number;
                nomeProduto: string;
            };
        }[];

        observacao: string;
        dataEntrega: string;
        motorista: string;

        veiculo: {
            placaVeiculo: string;
        };

        dataCriacao: string;
    };
}

function Cargas() {

    const [cargas, setCargas] = useState<Carga[]>([]);

    useEffect(() => {
        carregarCargas();
    }, []);

    async function carregarCargas() {

        try {

            const response = await api.get("/cargas");

            setCargas(response.data);

        } catch (error) {

            console.error(error);

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

                    padding: {
                        xs: 2,
                        md: 4,
                    },
                }}
            >

                <Box sx={{ height: "64px" }} />

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "bold",
                        marginBottom: 1,
                    }}
                >
                    Cargas
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                        marginBottom: 4,
                    }}
                >
                    Visualize e gerencie as cargas cadastradas.
                </Typography>

                {cargas.map((carga) => (

                    <Paper
                        key={carga.idCarga}
                        elevation={1}
                        sx={{
                            padding: 3,
                            marginBottom: 3,
                        }}
                    >

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: 3,
                                flexWrap: "wrap",
                                gap: 2,
                            }}
                        >

                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: "bold",
                                }}
                            >
                                Carga #{carga.idCarga}
                            </Typography>

                            <Chip
                                label={carga.status}
                                color={
                                    carga.status === "ENTREGUE"
                                        ? "success"
                                        : carga.status === "PRÓXIMO"
                                            ? "warning"
                                            : "default"
                                }
                            />

                        </Box>

                        <Typography variant="body1">
                            <strong>Cliente:</strong>{" "}
                            {carga.ordemCarregamento.cliente.nomeCliente}
                        </Typography>

                        <Typography variant="body1">
                            <strong>Pedido:</strong>{" "}
                            {carga.ordemCarregamento.numeroPedido}
                        </Typography>

                        <Typography variant="body1">
                            <strong>Endereço:</strong>{" "}
                            {carga.ordemCarregamento.endereco}
                        </Typography>

                        <Typography variant="body1">
                            <strong>Motorista:</strong>{" "}
                            {carga.ordemCarregamento.motorista}
                        </Typography>

                        <Typography variant="body1">
                            <strong>Veículo:</strong>{" "}
                            {carga.ordemCarregamento.veiculo.placaVeiculo}
                        </Typography>

                        <Typography variant="body1">
                            <strong>Local de saída:</strong>{" "}
                            {carga.localSaida}
                        </Typography>

                        <Typography variant="body1">
                            <strong>Transportadora:</strong>{" "}
                            {carga.transportadora}
                        </Typography>

                        <Typography variant="body1">
                            <strong>Nota fiscal:</strong>{" "}
                            {carga.notaFiscal}
                        </Typography>

                        <Typography variant="body1">
                            <strong>Peso total:</strong>{" "}
                            {carga.pesoTotal}
                        </Typography>

                        <Typography variant="body1">
                            <strong>Aproveitamento:</strong>{" "}
                            {carga.aproveitamento}%
                        </Typography>

                        <Typography variant="body1">
                            <strong>Data de entrega:</strong>{" "}
                            {carga.ordemCarregamento.dataEntrega}
                        </Typography>

                        <Typography variant="body1">
                            <strong>Vencimento:</strong>{" "}
                            {carga.ordemCarregamento.vencimento}
                        </Typography>

                        <Typography variant="body1">
                            <strong>Observação:</strong>{" "}
                            {carga.ordemCarregamento.observacao}
                        </Typography>

                        <Box
                            sx={{
                                marginTop: 3,
                                display: "flex",
                                gap: 2,
                            }}
                        >

                            <Button
                                variant="contained"
                            >
                                Editar
                            </Button>

                            <Button
                                variant="outlined"
                            >
                                Imprimir
                            </Button>

                        </Box>

                    </Paper>

                ))}

            </Box>

        </Box>
    );
}

export default Cargas;