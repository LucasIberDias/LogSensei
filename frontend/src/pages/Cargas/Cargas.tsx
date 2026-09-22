import { useEffect, useMemo, useState } from "react";

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
        medidaProduto: string;
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

// Status conhecidos e a ordem de exibição desejada (próximo -> pendente -> entregue)
const STATUS_PROXIMO = "PRÓXIMO";
const STATUS_PENDENTE = "PENDENTE";
const STATUS_ENTREGUE = "ENTREGUE";

const ORDEM_STATUS = [STATUS_PROXIMO, STATUS_PENDENTE, STATUS_ENTREGUE];

const STATUS_FILTROS = [
    { valor: STATUS_PROXIMO, label: "Próximo" },
    { valor: STATUS_PENDENTE, label: "Pendente" },
    { valor: STATUS_ENTREGUE, label: "Entregue" },
];

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

    // Controla quais status estão visíveis na listagem.
    // Por padrão todos os três aparecem.
    const [statusVisiveis, setStatusVisiveis] = useState<Record<string, boolean>>({
        [STATUS_PROXIMO]: true,
        [STATUS_PENDENTE]: true,
        [STATUS_ENTREGUE]: true,
    });

    useEffect(() => {
        carregarCargas();
    }, []);

    async function carregarCargas() {
        try {
            const response = await api.get("/cargas");

            console.log("RESPOSTA DA API:", response.data);
            console.log("É ARRAY?", Array.isArray(response.data));

            if (Array.isArray(response.data)) {
                setCargas(response.data);
            } else {
                setCargas([]);
                console.error("A API não retornou uma lista de cargas:", response.data);
            }

        } catch (error) {
            console.error(error);
            setErro("Não foi possível carregar as cargas.");
        }
    }

    function alternarFiltroStatus(status: string) {
        setStatusVisiveis((atual) => ({
            ...atual,
            [status]: !atual[status],
        }));
    }

    function imprimirCarga(carga: Carga) {
        const ordem = carga.ordemCarregamento;

        const janela = window.open("", "_blank");

        if (!janela) {
            setErro("Não foi possível abrir a janela de impressão.");
            return;
        }

        const dataImpressao = new Date();

        const dataFormatada = dataImpressao.toLocaleDateString("pt-BR");

        const horaFormatada = dataImpressao.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });

        const produtos = ordem.item
            .map(
                (item) => `
                <tr class="produto">
                    <td>
                        ${item.produto.codigoProduto}
                    </td>

                    <td>
                        ${item.produto.nomeProduto}
                    </td>

                    <td>
                        ${item.produto.medidaProduto}
                    </td>

                    <td>
                        ${item.quantidade}
                    </td>

                    <td>
                        R$ ${item.valorUnitario
                        .toFixed(2)
                        .replace(".", ",")}
                    </td>
                </tr>
            `
            )
            .join("");

        janela.document.write(`
        <!DOCTYPE html>

        <html lang="pt-BR">

        <head>

            <meta charset="UTF-8">

            <title>
                Programação de Entrega - Carga #${carga.idCarga}
            </title>

            <style>

                * {
                    box-sizing: border-box;
                }

                body {
                    margin: 0;
                    padding: 15px;
                    font-family: Arial, Helvetica, sans-serif;
                    color: #000;
                }

                .folha {
                    width: 100%;
                    max-width: 800px;
                    margin: 0 auto;
                }

                .titulo {
                    text-align: center;
                    font-size: 22px;
                    font-weight: bold;
                    text-decoration: underline;
                    margin: 10px 0 5px 0;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 12px;
                }

                td,
                th {
                    border: 1px solid #000;
                    padding: 4px;
                    text-align: center;
                }

                .campo {
                    background: #00b050;
                    color: white;
                    font-weight: bold;
                    width: 110px;
                    text-align: left;
                }

                .valor {
                    text-align: left;
                    font-weight: bold;
                }

                .cabecalho-produtos {
                    background: #00b050;
                    color: white;
                    font-weight: bold;
                }

                .produto {
                    height: 28px;
                }

                .entrega {
                    background: #00b050;
                    color: white;
                    font-weight: bold;
                    text-align: center;
                    font-size: 13px;
                    padding: 7px;
                    margin-top: 12px;
                }

                .impressao {
                    margin-top: 14px;
                    width: 260px;
                }

                .impressao td:first-child {
                    background: #00b050;
                    color: white;
                    font-weight: bold;
                }

                .assinatura {
                    margin-top: 14px;
                    width: 260px;
                }

                .assinatura td {
                    height: 35px;
                }

                .assinatura td:first-child {
                    width: 100px;
                    text-align: left;
                    font-weight: bold;
                }

                .rodape {
                    margin-top: 15px;
                    font-size: 10px;
                    text-align: center;
                }

                @media print {

                    body {
                        padding: 0;
                    }

                    .folha {
                        max-width: none;
                    }

                }

            </style>

        </head>

        <body>

            <div class="folha">

                <div class="titulo">
                    PROGRAMAÇÃO DE ENTREGA
                </div>

                <table>

                    <tr>

                        <td class="campo">
                            Carga
                        </td>

                        <td colspan="4" class="valor">
                            #${carga.idCarga}
                        </td>

                    </tr>

                    <tr>

                        <td class="campo">
                            Cliente
                        </td>

                        <td colspan="4" class="valor">
                            ${ordem.cliente.nomeCliente}
                        </td>

                    </tr>

                    <tr>

                        <td class="campo">
                            Endereço
                        </td>

                        <td colspan="4" class="valor">
                            ${ordem.endereco}
                        </td>

                    </tr>

                    <tr>

                        <td class="campo">
                            Pedido
                        </td>

                        <td class="valor">
                            ${ordem.numeroPedido}
                        </td>

                        <td class="campo">
                            Vencimento
                        </td>

                        <td colspan="2" class="valor">
                            ${ordem.vencimento}
                        </td>

                    </tr>

                    <tr>

                        <td class="campo">
                            Transportadora
                        </td>

                        <td colspan="4" class="valor">
                            ${carga.transportadora || "-"}
                        </td>

                    </tr>

                    <tr>

                        <th class="cabecalho-produtos">
                            Código
                        </th>

                        <th class="cabecalho-produtos">
                            Descrição do Produto
                        </th>

                        <th class="cabecalho-produtos">
                            U/M
                        </th>

                        <th class="cabecalho-produtos">
                            UNIDADE
                        </th>

                        <th class="cabecalho-produtos">
                            R$ UNIDADE
                        </th>

                    </tr>

                    ${produtos}

                </table>

                <div class="entrega">
                    ENTREGA ${ordem.dataEntrega}
                </div>

                <table class="impressao">

                    <tr>

                        <td>
                            Data impressão
                        </td>

                        <td>
                            ${dataFormatada}
                        </td>

                    </tr>

                    <tr>

                        <td>
                            Hora da impressão
                        </td>

                        <td>
                            ${horaFormatada}
                        </td>

                    </tr>

                </table>

                <table class="assinatura">

                    <tr>

                        <td>
                            MOTORISTA
                        </td>

                        <td>
                            ${ordem.motorista || ""}
                        </td>

                    </tr>

                    <tr>

                        <td>
                            PLACA
                        </td>

                        <td>
                            ${ordem.veiculo?.placaVeiculo || ""}
                        </td>

                    </tr>

                </table>

                <div class="rodape">
                    Carga #${carga.idCarga} - LogSensei
                </div>

            </div>

        </body>

        </html>
    `);

        janela.document.close();

        janela.onload = () => {
            janela.focus();
            janela.print();
            janela.close();
        };
    }

    // Lista final exibida: filtrada pelos status ativos e ordenada
    // colocando "Próximo" primeiro, depois "Pendente", depois o restante.
    const cargasExibidas = useMemo(() => {
        return [...cargas]
            .filter((carga) => statusVisiveis[carga.status] ?? true)
            .sort((a, b) => {
                const posicaoA = ORDEM_STATUS.indexOf(a.status);
                const posicaoB = ORDEM_STATUS.indexOf(b.status);

                const indiceA = posicaoA === -1 ? ORDEM_STATUS.length : posicaoA;
                const indiceB = posicaoB === -1 ? ORDEM_STATUS.length : posicaoB;

                return indiceA - indiceB;
            });
    }, [cargas, statusVisiveis]);

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

        if (status === STATUS_ENTREGUE) {
            return "success";
        }

        if (status === STATUS_PROXIMO) {
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
                        marginBottom: 3,
                    }}
                >
                    Visualize e gerencie as cargas cadastradas.
                </Typography>

                {/* Filtros por status: clique para ligar/desligar cada um */}
                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                        marginBottom: 4,
                    }}
                >
                    {STATUS_FILTROS.map((filtro) => {
                        const ativo = statusVisiveis[filtro.valor];

                        return (
                            <Chip
                                key={filtro.valor}
                                label={filtro.label}
                                color={ativo ? obterCorStatus(filtro.valor) : "default"}
                                variant={ativo ? "filled" : "outlined"}
                                onClick={() => alternarFiltroStatus(filtro.valor)}
                                sx={{
                                    fontWeight: "bold",
                                    opacity: ativo ? 1 : 0.6,
                                }}
                            />
                        );
                    })}
                </Box>

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

                {cargasExibidas.map((carga) => (

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

                                <Box key={index}>

                                    <Box
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
                                            {item.codigoProduto ?? item.produto.codigoProduto}
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

                                    {index < carga.ordemCarregamento.item.length - 1 && (
                                        <Divider sx={{ marginY: 1.5 }} />
                                    )}

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
                                onClick={() => imprimirCarga(carga)}
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