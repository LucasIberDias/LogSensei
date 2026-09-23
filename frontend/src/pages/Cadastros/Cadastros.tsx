import { useState } from "react";

import {
    Box,
    Paper,
    Typography,
    Button,
    TextField,
    Alert,
} from "@mui/material";

import PersonAddIcon from "@mui/icons-material/PersonAdd";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import api from "../../services/api";

type CadastroSelecionado = "cliente" | "produto" | "veiculo" | null;

function Cadastros() {

    const [cadastroSelecionado, setCadastroSelecionado] =
        useState<CadastroSelecionado>(null);

    const [codigoCliente, setCodigoCliente] = useState("");
    const [nomeCliente, setNomeCliente] = useState("");

    const [codigoProduto, setCodigoProduto] = useState("");
    const [nomeProduto, setNomeProduto] = useState("");
    const [medidaProduto, setMedidaProduto] = useState("");
    const [pesoProduto, setPesoProduto] = useState("");

    const [placaVeiculo, setPlacaVeiculo] = useState("");
    const [tipoVeiculo, setTipoVeiculo] = useState("");
    const [capacidadeVeiculo, setCapacidadeVeiculo] = useState("");

    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");

    function selecionarCadastro(tipo: CadastroSelecionado) {
        setCadastroSelecionado(tipo);
        setErro("");
        setSucesso("");
    }

    function voltar() {
        setCadastroSelecionado(null);
        setErro("");
        setSucesso("");
    }

    async function cadastrarCliente() {

        try {

            setErro("");
            setSucesso("");

            await api.post("/clientes", {
                codigoCliente: Number(codigoCliente),
                nomeCliente: nomeCliente.trim(),
            });

            setSucesso("Cliente cadastrado com sucesso.");

            setCodigoCliente("");
            setNomeCliente("");

        } catch (error: any) {

            console.error(error);

            setErro(
                error.response?.data?.message ||
                "Não foi possível cadastrar o cliente."
            );

        }
    }

    async function cadastrarProduto() {

        try {

            setErro("");
            setSucesso("");

            await api.post("/produtos", {
                codigoProduto: Number(codigoProduto),
                nomeProduto: nomeProduto.trim(),
                medidaProduto: medidaProduto.trim(),
                pesoProduto: Number(pesoProduto),
            });

            setSucesso("Produto cadastrado com sucesso.");

            setCodigoProduto("");
            setNomeProduto("");
            setMedidaProduto("");
            setPesoProduto("");

        } catch (error: any) {

            console.error(error);

            setErro(
                error.response?.data?.message ||
                "Não foi possível cadastrar o produto."
            );

        }
    }

    async function cadastrarVeiculo() {

        try {

            setErro("");
            setSucesso("");

            await api.post("/veiculos", {
                placaVeiculo: placaVeiculo.trim().toUpperCase(),
                tipoVeiculo: tipoVeiculo.trim(),
                capacidadeVeiculo: Number(capacidadeVeiculo),
            });

            setSucesso("Veículo cadastrado com sucesso.");

            setPlacaVeiculo("");
            setTipoVeiculo("");
            setCapacidadeVeiculo("");

        } catch (error: any) {

            console.error(error);

            setErro(
                error.response?.data?.message ||
                "Não foi possível cadastrar o veículo."
            );

        }
    }

    function renderFormulario() {

        if (cadastroSelecionado === "cliente") {

            return (
                <Paper
                    sx={{
                        padding: 3,
                        maxWidth: 600,
                        margin: "0 auto",
                    }}
                >

                    <Typography variant="h5" sx={{ marginBottom: 3 }}>
                        Cadastrar Cliente
                    </Typography>

                    {erro && (
                        <Alert severity="error" sx={{ marginBottom: 2 }}>
                            {erro}
                        </Alert>
                    )}

                    {sucesso && (
                        <Alert severity="success" sx={{ marginBottom: 2 }}>
                            {sucesso}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        label="Código do cliente"
                        type="number"
                        value={codigoCliente}
                        onChange={(e) => setCodigoCliente(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="Nome do cliente"
                        value={nomeCliente}
                        onChange={(e) => setNomeCliente(e.target.value)}
                        sx={{ marginBottom: 3 }}
                    />

                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                        }}
                    >

                        <Button
                            variant="outlined"
                            onClick={voltar}
                        >
                            Voltar
                        </Button>

                        <Button
                            variant="contained"
                            onClick={cadastrarCliente}
                        >
                            Cadastrar
                        </Button>

                    </Box>

                </Paper>
            );
        }

        if (cadastroSelecionado === "produto") {

            return (
                <Paper
                    sx={{
                        padding: 3,
                        maxWidth: 600,
                        margin: "0 auto",
                    }}
                >

                    <Typography variant="h5" sx={{ marginBottom: 3 }}>
                        Cadastrar Produto
                    </Typography>

                    {erro && (
                        <Alert severity="error" sx={{ marginBottom: 2 }}>
                            {erro}
                        </Alert>
                    )}

                    {sucesso && (
                        <Alert severity="success" sx={{ marginBottom: 2 }}>
                            {sucesso}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        label="Código do produto"
                        type="number"
                        value={codigoProduto}
                        onChange={(e) => setCodigoProduto(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="Nome do produto"
                        value={nomeProduto}
                        onChange={(e) => setNomeProduto(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="Medida"
                        value={medidaProduto}
                        onChange={(e) => setMedidaProduto(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="Peso do produto"
                        type="number"
                        value={pesoProduto}
                        onChange={(e) => setPesoProduto(e.target.value)}
                        sx={{ marginBottom: 3 }}
                    />

                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                        }}
                    >

                        <Button
                            variant="outlined"
                            onClick={voltar}
                        >
                            Voltar
                        </Button>

                        <Button
                            variant="contained"
                            onClick={cadastrarProduto}
                        >
                            Cadastrar
                        </Button>

                    </Box>

                </Paper>
            );
        }

        if (cadastroSelecionado === "veiculo") {

            return (
                <Paper
                    sx={{
                        padding: 3,
                        maxWidth: 600,
                        margin: "0 auto",
                    }}
                >

                    <Typography variant="h5" sx={{ marginBottom: 3 }}>
                        Cadastrar Veículo
                    </Typography>

                    {erro && (
                        <Alert severity="error" sx={{ marginBottom: 2 }}>
                            {erro}
                        </Alert>
                    )}

                    {sucesso && (
                        <Alert severity="success" sx={{ marginBottom: 2 }}>
                            {sucesso}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        label="Placa"
                        value={placaVeiculo}
                        onChange={(e) => setPlacaVeiculo(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="Tipo do veículo"
                        value={tipoVeiculo}
                        onChange={(e) => setTipoVeiculo(e.target.value)}
                        sx={{ marginBottom: 2 }}
                    />

                    <TextField
                        fullWidth
                        label="Capacidade do veículo"
                        type="number"
                        value={capacidadeVeiculo}
                        onChange={(e) => setCapacidadeVeiculo(e.target.value)}
                        sx={{ marginBottom: 3 }}
                    />

                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                        }}
                    >

                        <Button
                            variant="outlined"
                            onClick={voltar}
                        >
                            Voltar
                        </Button>

                        <Button
                            variant="contained"
                            onClick={cadastrarVeiculo}
                        >
                            Cadastrar
                        </Button>

                    </Box>

                </Paper>
            );
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

                <Paper
                    sx={{
                        padding: 4,
                        textAlign: "center",
                        cursor: "pointer",
                        "&:hover": {
                            boxShadow: 4,
                        },
                    }}
                    onClick={() => selecionarCadastro("cliente")}
                >

                    <PersonAddIcon
                        sx={{
                            fontSize: 50,
                            marginBottom: 2,
                        }}
                    />

                    <Typography variant="h6">
                        Cliente
                    </Typography>

                    <Typography color="text.secondary">
                        Cadastrar novo cliente
                    </Typography>

                </Paper>

                <Paper
                    sx={{
                        padding: 4,
                        textAlign: "center",
                        cursor: "pointer",
                        "&:hover": {
                            boxShadow: 4,
                        },
                    }}
                    onClick={() => selecionarCadastro("produto")}
                >

                    <InventoryIcon
                        sx={{
                            fontSize: 50,
                            marginBottom: 2,
                        }}
                    />

                    <Typography variant="h6">
                        Produto
                    </Typography>

                    <Typography color="text.secondary">
                        Cadastrar novo produto
                    </Typography>

                </Paper>

                <Paper
                    sx={{
                        padding: 4,
                        textAlign: "center",
                        cursor: "pointer",
                        "&:hover": {
                            boxShadow: 4,
                        },
                    }}
                    onClick={() => selecionarCadastro("veiculo")}
                >

                    <LocalShippingIcon
                        sx={{
                            fontSize: 50,
                            marginBottom: 2,
                        }}
                    />

                    <Typography variant="h6">
                        Veículo
                    </Typography>

                    <Typography color="text.secondary">
                        Cadastrar novo veículo
                    </Typography>

                </Paper>

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

                <Typography
                    variant="h4"
                    sx={{
                        marginBottom: 4,
                    }}
                >
                    Cadastros
                </Typography>

                {renderFormulario()}

            </Box>

        </Box>
    );
}

export default Cadastros;