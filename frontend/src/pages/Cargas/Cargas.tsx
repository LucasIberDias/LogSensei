import { useEffect, useState } from "react";

import {
    Box,
    Paper,
    Typography,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Divider,
    Alert,
} from "@mui/material";

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import api from "../../services/api";

interface Item {
    codigoProduto: number;
    quantidade: number;
    valorUnitario: number;
    produto: {
        codigoProduto: number;
        nomeProduto: string;
    };
}

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

        item: Item[];

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

    const [cargaSelecionada, setCargaSelecionada] =
        useState<Carga | null>(null);

    const [localSaida, setLocalSaida] = useState("");
    const [transportadora, setTransportadora] = useState("");
    const [notaFiscal, setNotaFiscal] = useState("");
    const [motorista, setMotorista] = useState("");
    const [placaVeiculo, setPlacaVeiculo] = useState("");

    const [erro, setErro] = useState("");

    useEffect(() => {
        carregarCargas();
    }, []);

    async function carregarCargas() {

        try {

            const response = await api.get("/cargas");

            setCargas(response.data);

        } catch (error) {

            console.error(error);

            setErro(
                "Não foi possível carregar as cargas."
            );
        }
    }

    function abrirEdicao(carga: Carga) {

        setCargaSelecionada(carga);

        setLocalSaida(
            carga.localSaida || ""
        );

        setTransportadora(
            carga.transportadora || ""
        );

        setNotaFiscal(
            carga.notaFiscal || ""
        );

        setMotorista(
            carga.ordemCarregamento.motorista || ""
        );

        setPlacaVeiculo(
            carga.ordemCarregamento.veiculo?.placaVeiculo || ""
        );

        setErro("");
    }

    function fecharEdicao() {

        setCargaSelecionada(null);

        setErro("");
    }

    async function salvarEdicao() {

        if (!cargaSelecionada) {
            return;
        }

        try {

            await api.patch("/cargas", {

                idCarga: cargaSelecionada.idCarga,

                localSaida,

                transportadora,

                notaFiscal,

                motorista,

                placaVeiculo,

            });

            await carregarCargas();

            fecharEdicao();

        } catch (error) {

            console.error(error);

            setErro(
                "Não foi possível atualizar a carga."
            );
        }
    }

    function obterCorStatus(status: string) {

        if (status === "ENTREGUE") {
            return "success";
        }

        if (status === "PRÓXIMO") {
            return "warning";
        }

        return "default";
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

                {erro && (

                    <Alert
                        severity="error"
                        sx={{
                            marginBottom: 3,
                        }}
                    >
                        {erro}
                    </Alert>

                )}

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
                                color={obterCorStatus(carga.status)}
                            />

                        </Box>

                        <Typography>
                            <strong>Cliente:</strong>{" "}
                            {carga.ordemCarregamento.cliente.nomeCliente}
                        </Typography>

                        <Typography>
                            <strong>Pedido:</strong>{" "}
                            {carga.ordemCarregamento.numeroPedido}
                        </Typography>

                        <Typography>
                            <strong>Endereço:</strong>{" "}
                            {carga.ordemCarregamento.endereco}
                        </Typography>

                        <Typography>
                            <strong>Vencimento:</strong>{" "}
                            {carga.ordemCarregamento.vencimento}
                        </Typography>

                        <Typography>
                            <strong>Motorista:</strong>{" "}
                            {carga.ordemCarregamento.motorista}
                        </Typography>

                        <Typography>
                            <strong>Veículo:</strong>{" "}
                            {carga.ordemCarregamento.veiculo?.placaVeiculo}
                        </Typography>

                        <Typography>
                            <strong>Local de saída:</strong>{" "}
                            {carga.localSaida}
                        </Typography>

                        <Typography>
                            <strong>Transportadora:</strong>{" "}
                            {carga.transportadora}
                        </Typography>

                        <Typography>
                            <strong>Nota fiscal:</strong>{" "}
                            {carga.notaFiscal}
                        </Typography>

                        <Typography>
                            <strong>Data de entrega:</strong>{" "}
                            {carga.ordemCarregamento.dataEntrega}
                        </Typography>

                        <Typography>
                            <strong>Peso total:</strong>{" "}
                            {carga.pesoTotal}
                        </Typography>

                        <Typography>
                            <strong>Aproveitamento:</strong>{" "}
                            {carga.aproveitamento}%
                        </Typography>

                        <Typography>
                            <strong>Observação:</strong>{" "}
                            {carga.ordemCarregamento.observacao}
                        </Typography>

                        <Divider
                            sx={{
                                marginTop: 3,
                                marginBottom: 3,
                            }}
                        />

                        <Typography
                            variant="h6"
                            sx={{
                                marginBottom: 2,
                                fontWeight: "bold",
                            }}
                        >
                            Produtos
                        </Typography>

                        {carga.ordemCarregamento.item.map(
                            (item, index) => (

                                <Box
                                    key={index}
                                    sx={{
                                        marginBottom: 1,
                                    }}
                                >

                                    <Typography>
                                        <strong>
                                            Produto:
                                        </strong>{" "}
                                        {item.produto.nomeProduto}
                                    </Typography>

                                    <Typography>
                                        <strong>
                                            Código:
                                        </strong>{" "}
                                        {item.codigoProduto}
                                    </Typography>

                                    <Typography>
                                        <strong>
                                            Quantidade:
                                        </strong>{" "}
                                        {item.quantidade}
                                    </Typography>

                                    <Typography>
                                        <strong>
                                            Valor unitário:
                                        </strong>{" "}
                                        R$ {item.valorUnitario}
                                    </Typography>

                                </Box>

                            )
                        )}

                        <Box
                            sx={{
                                display: "flex",
                                gap: 2,
                                marginTop: 3,
                            }}
                        >

                            <Button
                                variant="contained"
                                onClick={() =>
                                    abrirEdicao(carga)
                                }
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

            <Dialog
                open={cargaSelecionada !== null}
                onClose={fecharEdicao}
                fullWidth
                maxWidth="sm"
            >

                <DialogTitle>
                    Editar Carga
                </DialogTitle>

                <DialogContent>

                    <TextField
                        label="Local de saída"
                        value={localSaida}
                        onChange={(e) =>
                            setLocalSaida(
                                e.target.value
                            )
                        }
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Transportadora"
                        value={transportadora}
                        onChange={(e) =>
                            setTransportadora(
                                e.target.value
                            )
                        }
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Nota fiscal"
                        value={notaFiscal}
                        onChange={(e) =>
                            setNotaFiscal(
                                e.target.value
                            )
                        }
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Motorista"
                        value={motorista}
                        onChange={(e) =>
                            setMotorista(
                                e.target.value
                            )
                        }
                        fullWidth
                        margin="normal"
                    />

                    <TextField
                        label="Placa do veículo"
                        value={placaVeiculo}
                        onChange={(e) =>
                            setPlacaVeiculo(
                                e.target.value.toUpperCase()
                            )
                        }
                        fullWidth
                        margin="normal"
                    />

                    {erro && (

                        <Alert
                            severity="error"
                            sx={{
                                marginTop: 2,
                            }}
                        >
                            {erro}
                        </Alert>

                    )}

                </DialogContent>

                <DialogActions>

                    <Button
                        onClick={fecharEdicao}
                    >
                        Cancelar
                    </Button>

                    <Button
                        variant="contained"
                        onClick={salvarEdicao}
                    >
                        Salvar
                    </Button>

                </DialogActions>

            </Dialog>

        </Box>
    );
}

export default Cargas;