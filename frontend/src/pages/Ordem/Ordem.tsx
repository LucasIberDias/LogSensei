import { useState } from "react";

import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Divider,
    Alert,
    Chip,
} from "@mui/material";

import Sidebar from "../../components/Sidebar/Sidebar";
import api from "../../services/api";

interface Cliente {
    codigoCliente: number;
    nomeCliente: string;
}

interface Veiculo {
    placaVeiculo: string;
}

interface Produto {
    codigoProduto: number;
}

interface Item {
    codigoProduto: string;
    quantidade: number;
    valorUnitario: number;
    produto: Produto | null;
    erro: string;
}

function Ordem() {
    const [codigoCliente, setCodigoCliente] = useState("");
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [erroCliente, setErroCliente] = useState("");

    const [endereco, setEndereco] = useState("");
    const [numeroPedido, setNumeroPedido] = useState("");
    const [vencimento, setVencimento] = useState("");
    const [dataEntrega, setDataEntrega] = useState("");
    const [motorista, setMotorista] = useState("");
    const [placaVeiculo, setPlacaVeiculo] = useState("");

    const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
    const [erroVeiculo, setErroVeiculo] = useState("");

    const [observacao, setObservacao] = useState("");

    const [itens, setItens] = useState<Item[]>([
        {
            codigoProduto: "",
            quantidade: 0,
            valorUnitario: 0,
            produto: null,
            erro: "",
        },
    ]);

    async function buscarCliente() {
        if (!codigoCliente) {
            setCliente(null);
            setErroCliente("Informe o código do cliente.");
            return;
        }

        try {
            const response = await api.get(
                `/clientes/codigo/${codigoCliente}`
            );

            setCliente(response.data);
            setErroCliente("");
        } catch (error) {
            console.error(error);

            setCliente(null);
            setErroCliente("Cliente não possui cadastro.");
        }
    }

    async function buscarVeiculo() {
        if (!placaVeiculo) {
            setVeiculo(null);
            setErroVeiculo("Informe a placa do veículo.");
            return;
        }

        try {
            const response = await api.get(
                `/veiculos/placa/${placaVeiculo}`
            );

            setVeiculo(response.data);
            setErroVeiculo("");
        } catch (error) {
            console.error(error);

            setVeiculo(null);
            setErroVeiculo("Veículo não possui cadastro.");
        }
    }

    async function buscarProduto(index: number) {
        const item = itens[index];

        if (!item.codigoProduto) {
            atualizarItem(index, {
                produto: null,
                erro: "Informe o código do produto.",
            });

            return;
        }

        try {
            const response = await api.get(
                `/produtos/codigo/${item.codigoProduto}`
            );

            const novosItens = [...itens];

            novosItens[index].produto = response.data;
            novosItens[index].erro = "";

            setItens(novosItens);
        } catch (error) {
            console.error(error);

            const novosItens = [...itens];

            novosItens[index].produto = null;
            novosItens[index].erro =
                "Produto não possui cadastro.";

            setItens(novosItens);
        }
    }

    function atualizarItem(
        index: number,
        dados: Partial<Item>
    ) {
        const novosItens = [...itens];

        novosItens[index] = {
            ...novosItens[index],
            ...dados,
        };

        setItens(novosItens);
    }

    function adicionarItem() {
        setItens([
            ...itens,
            {
                codigoProduto: "",
                quantidade: 0,
                valorUnitario: 0,
                produto: null,
                erro: "",
            },
        ]);
    }

    async function criarOrdem() {
        if (!cliente) {
            alert("Consulte um cliente válido antes de criar a ordem.");
            return;
        }

        if (!veiculo) {
            alert("Consulte um veículo válido antes de criar a ordem.");
            return;
        }

        if (itens.some((item) => !item.produto)) {
            alert("Todos os produtos precisam estar cadastrados.");
            return;
        }

        const idUsuario = localStorage.getItem("idUsuario");

        if (!idUsuario) {
            alert("Usuário não encontrado.");
            return;
        }

        try {
            const dados = {
                codigoCliente: Number(codigoCliente),
                endereco,
                numeroPedido,
                vencimento,
                observacao,
                dataEntrega,
                motorista,
                placaVeiculo,
                idUsuario: Number(idUsuario),
                itens: itens.map((item) => ({
                    codigoProduto: Number(item.codigoProduto),
                    quantidade: item.quantidade,
                    valorUnitario: item.valorUnitario,
                })),
            };

            await api.post("/ordemCarregamento", dados);

            alert("Ordem de carregamento criada com sucesso!");
        } catch (error) {
            console.error(error);

            alert(
                "Não foi possível criar a ordem de carregamento."
            );
        }
    }

    return (
        <Box>
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
                    paddingTop: 4,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "bold",
                        marginBottom: 1,
                    }}
                >
                    Nova Ordem
                </Typography>

                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ marginBottom: 4 }}
                >
                    Crie uma nova ordem de carregamento.
                </Typography>

                <Paper
                    elevation={1}
                    sx={{
                        padding: 3,
                        marginBottom: 3,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: "bold",
                            marginBottom: 2,
                        }}
                    >
                        Cliente
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <TextField
                            label="Código do cliente"
                            value={codigoCliente}
                            onChange={(e) => {
                                setCodigoCliente(e.target.value);
                                setCliente(null);
                                setErroCliente("");
                            }}
                            type="number"
                            sx={{
                                width: {
                                    xs: "100%",
                                    sm: 250,
                                },
                            }}
                        />

                        <Button
                            variant="outlined"
                            onClick={buscarCliente}
                            sx={{ height: 56 }}
                        >
                            Consultar
                        </Button>
                    </Box>

                    {cliente && (
                        <Chip
                            label={`Cliente: ${cliente.nomeCliente}`}
                            color="success"
                            variant="outlined"
                            sx={{ marginTop: 2 }}
                        />
                    )}

                    {erroCliente && (
                        <Alert
                            severity="error"
                            sx={{ marginTop: 2 }}
                        >
                            {erroCliente}
                        </Alert>
                    )}
                </Paper>

                <Paper
                    elevation={1}
                    sx={{
                        padding: 3,
                        marginBottom: 3,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: "bold",
                            marginBottom: 2,
                        }}
                    >
                        Dados da ordem
                    </Typography>

                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                md: "1fr 1fr",
                            },
                            gap: 2,
                        }}
                    >
                        <TextField
                            label="Número do pedido"
                            value={numeroPedido}
                            onChange={(e) =>
                                setNumeroPedido(e.target.value)
                            }
                            fullWidth
                        />

                        <TextField
                            label="Endereço"
                            value={endereco}
                            onChange={(e) =>
                                setEndereco(e.target.value)
                            }
                            fullWidth
                        />

                        <TextField
                            label="Vencimento"
                            type="date"
                            value={vencimento}
                            onChange={(e) =>
                                setVencimento(e.target.value)
                            }
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                            fullWidth
                        />

                        <TextField
                            label="Data de entrega"
                            type="date"
                            value={dataEntrega}
                            onChange={(e) =>
                                setDataEntrega(e.target.value)
                            }
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                            fullWidth
                        />

                        <TextField
                            label="Motorista"
                            value={motorista}
                            onChange={(e) =>
                                setMotorista(e.target.value)
                            }
                            fullWidth
                        />
                    </Box>

                    <TextField
                        label="Observação"
                        value={observacao}
                        onChange={(e) =>
                            setObservacao(e.target.value)
                        }
                        multiline
                        rows={3}
                        fullWidth
                        sx={{ marginTop: 2 }}
                    />
                </Paper>

                <Paper
                    elevation={1}
                    sx={{
                        padding: 3,
                        marginBottom: 3,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: "bold",
                            marginBottom: 2,
                        }}
                    >
                        Veículo
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            alignItems: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        <TextField
                            label="Placa do veículo"
                            value={placaVeiculo}
                            onChange={(e) => {
                                setPlacaVeiculo(
                                    e.target.value.toUpperCase()
                                );
                                setVeiculo(null);
                                setErroVeiculo("");
                            }}
                            sx={{
                                width: {
                                    xs: "100%",
                                    sm: 250,
                                },
                            }}
                        />

                        <Button
                            variant="outlined"
                            onClick={buscarVeiculo}
                            sx={{ height: 56 }}
                        >
                            Consultar
                        </Button>
                    </Box>

                    {veiculo && (
                        <Chip
                            label={`Veículo encontrado: ${veiculo.placaVeiculo}`}
                            color="success"
                            variant="outlined"
                            sx={{ marginTop: 2 }}
                        />
                    )}

                    {erroVeiculo && (
                        <Alert
                            severity="error"
                            sx={{ marginTop: 2 }}
                        >
                            {erroVeiculo}
                        </Alert>
                    )}
                </Paper>

                <Paper
                    elevation={1}
                    sx={{
                        padding: 3,
                        marginBottom: 3,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: "bold",
                            marginBottom: 2,
                        }}
                    >
                        Produtos
                    </Typography>

                    {itens.map((item, index) => (
                        <Box
                            key={index}
                            sx={{ marginBottom: 3 }}
                        >
                            {index > 0 && (
                                <Divider
                                    sx={{ marginBottom: 3 }}
                                />
                            )}

                            <Box
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: {
                                        xs: "1fr",
                                        md: "2fr 1fr 1fr auto",
                                    },
                                    gap: 2,
                                    alignItems: "center",
                                }}
                            >
                                <TextField
                                    label="Código do produto"
                                    value={item.codigoProduto}
                                    onChange={(e) => {
                                        atualizarItem(index, {
                                            codigoProduto:
                                                e.target.value,
                                            produto: null,
                                            erro: "",
                                        });
                                    }}
                                    type="number"
                                    fullWidth
                                />

                                <TextField
                                    label="Quantidade"
                                    type="number"
                                    value={item.quantidade}
                                    onChange={(e) =>
                                        atualizarItem(index, {
                                            quantidade: Number(
                                                e.target.value
                                            ),
                                        })
                                    }
                                    fullWidth
                                />

                                <TextField
                                    label="Valor unitário"
                                    type="number"
                                    value={item.valorUnitario}
                                    onChange={(e) =>
                                        atualizarItem(index, {
                                            valorUnitario: Number(
                                                e.target.value
                                            ),
                                        })
                                    }
                                    fullWidth
                                />

                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        buscarProduto(index)
                                    }
                                    sx={{ height: 56 }}
                                >
                                    Consultar
                                </Button>
                            </Box>

                            {item.produto && (
                                <Chip
                                    label={`Produto ${item.produto.codigoProduto} encontrado`}
                                    color="success"
                                    variant="outlined"
                                    sx={{ marginTop: 2 }}
                                />
                            )}

                            {item.erro && (
                                <Alert
                                    severity="error"
                                    sx={{ marginTop: 2 }}
                                >
                                    {item.erro}
                                </Alert>
                            )}
                        </Box>
                    ))}

                    <Button
                        variant="outlined"
                        onClick={adicionarItem}
                    >
                        Adicionar produto
                    </Button>
                </Paper>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        marginBottom: 4,
                    }}
                >
                    <Button
                        variant="contained"
                        size="large"
                        onClick={criarOrdem}
                        disabled={
                            !cliente ||
                            !veiculo ||
                            itens.some(
                                (item) => !item.produto
                            )
                        }
                    >
                        Criar Ordem
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}

export default Ordem;