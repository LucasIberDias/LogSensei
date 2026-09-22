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

// Logo da Agrícola Andreis em base64, usada no cabeçalho da folha impressa.
// Mantida como constante fora do componente para não ser recriada a cada render.
const LOGO_ANDREIS_BASE64 =
    "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";

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

        /*
         * Quantidade fixa de linhas de produtos.
         * A impressão sempre terá 15 linhas.
         */
        const TOTAL_LINHAS_PRODUTOS = 15;

        /*
         * Produtos reais
         */
        const linhasProduto = ordem.item
            .map(
                (item) => `
                <tr class="linha-produto">
                    <td class="codigo">
                        ${item.produto.codigoProduto}
                    </td>

                    <td class="descricao">
                        ${item.produto.nomeProduto}
                    </td>

                    <td class="medida">
                        ${item.produto.medidaProduto}
                    </td>

                    <td class="quantidade">
                        ${item.quantidade}
                    </td>

                    <td class="valor-unitario">
                        ${item.valorUnitario
                        .toFixed(2)
                        .replace(".", ",")}
                    </td>
                </tr>
            `
            )
            .join("");

        /*
         * Completa a tabela até chegar em 15 linhas.
         */
        const quantidadeLinhasVazias = Math.max(
            TOTAL_LINHAS_PRODUTOS - ordem.item.length,
            0
        );

        const linhasVazias = Array.from({
            length: quantidadeLinhasVazias,
        })
            .map(
                () => `
                <tr class="linha-produto">
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                </tr>
            `
            )
            .join("");

        /*
         * Observação.
         * Mantemos a faixa vermelha mesmo quando não houver observação,
         * para preservar o mesmo layout da folha impressa.
         */
        const observacao = ordem.observacao?.trim() || "";

        janela.document.write(`
        <!DOCTYPE html>

        <html lang="pt-BR">

        <head>

            <meta charset="UTF-8">

            <title>
                Programação de Entrega - Carga #${carga.idCarga}
            </title>

            <style>

                /*
                 * CONFIGURAÇÃO DA PÁGINA
                 */
                @page {
                    size: A4 portrait;
                    margin: 0;
                }

                * {
                    box-sizing: border-box;
                }

                html,
                body {
                    margin: 0;
                    padding: 0;
                    width: 100%;
                    height: 100%;
                }

                body {
                    font-family: Arial, Helvetica, sans-serif;
                    color: #000;
                    background: #fff;
                }

                /*
                 * FOLHA
                 */
                .folha {
                    width: 210mm;
                    min-height: 297mm;
                    margin: 0 auto;
                    padding: 0;
                    background: #fff;
                }

                /*
                 * CABEÇALHO
                 *
                 * Logo à esquerda
                 * Título centralizado
                 */
                .cabecalho {
                    width: 100%;
                    height: 69px;

                    display: flex;
                    align-items: center;

                    border: 1px solid #000;
                }

                .logo-container {
                    width: 151px;
                    height: 67px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    border-right: 1px solid #000;
                }

                .logo {
                    width: 145px;
                    height: auto;
                    max-height: 63px;
                    object-fit: contain;
                }

                .titulo-container {
                    flex: 1;
                    height: 67px;

                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .titulo {
                    margin: 0;

                    font-size: 21px;
                    font-weight: bold;

                    text-decoration: underline;

                    text-align: center;
                }

                /*
                 * TABELAS
                 */
                table {
                    width: 100%;
                    border-collapse: collapse;
                    table-layout: fixed;
                }

                td,
                th {
                    border: 1px solid #000;
                    padding: 0;

                    font-size: 12px;
                    line-height: 1;

                    text-align: center;
                    vertical-align: middle;
                }

                /*
                 * NÚMERO DA CARGA
                 */
                .numero-carga {
                    width: 75px;
                }

                .numero-carga td {
                    height: 20px;

                    background: #00b050;
                    color: #fff;

                    font-size: 12px;
                    font-weight: bold;
                }

                /*
                 * DADOS DO CLIENTE
                 */
                .dados {
                    width: 100%;
                }

                .campo {
                    width: 75px;

                    background: #00b050;
                    color: #fff;

                    font-weight: bold;
                    text-align: center;

                    height: 19px;
                }

                .valor {
                    height: 19px;

                    font-weight: bold;
                    text-align: center;

                    padding-left: 5px;
                    padding-right: 5px;
                }

                /*
                 * LINHA DO PEDIDO
                 */
                .pedido {
                    width: 55%;
                    text-align: left;
                    padding-left: 8px;
                }

                .campo-vencimento {
                    width: 125px;
                }

                .vencimento {
                    text-align: center;
                    font-weight: bold;
                }

                /*
                 * TABELA DE PRODUTOS
                 */
                .produtos {
                    width: 100%;
                }

                .cabecalho-produtos {
                    height: 20px;

                    background: #00b050;
                    color: #fff;

                    font-size: 12px;
                    font-weight: bold;
                }

                /*
                 * Largura das colunas
                 */
                .produtos th:nth-child(1),
                .produtos td:nth-child(1) {
                    width: 75px;
                }

                .produtos th:nth-child(2),
                .produtos td:nth-child(2) {
                    width: 380px;
                }

                .produtos th:nth-child(3),
                .produtos td:nth-child(3) {
                    width: 75px;
                }

                .produtos th:nth-child(4),
                .produtos td:nth-child(4) {
                    width: 75px;
                }

                .produtos th:nth-child(5),
                .produtos td:nth-child(5) {
                    width: 100px;
                }

                /*
                 * LINHAS DOS PRODUTOS
                 */
                .linha-produto {
                    height: 18px;
                }

                .linha-produto td {
                    height: 18px;

                    font-size: 12px;
                    font-weight: bold;

                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: clip;
                }

                .codigo {
                    text-align: center;
                }

                .descricao {
                    text-align: center;
                    padding-left: 3px;
                    padding-right: 3px;
                }

                .medida {
                    text-align: center;
                }

                .quantidade {
                    text-align: center;
                }

                .valor-unitario {
                    text-align: right;
                    padding-right: 5px;
                }

                /*
                 * FAIXA DE ENTREGA
                 */
                .entrega {
                    width: 100%;

                    height: 32px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    background: #00b050;
                    color: #fff;

                    border-left: 1px solid #000;
                    border-right: 1px solid #000;

                    font-size: 13px;
                    font-weight: bold;

                    text-align: center;
                }

                /*
                 * OBSERVAÇÃO
                 */
                .obs {
                    width: 100%;

                    height: 18px;

                    display: flex;
                    align-items: center;
                    justify-content: center;

                    background: #ff0000;
                    color: #fff;

                    border-left: 1px solid #000;
                    border-right: 1px solid #000;

                    font-size: 11px;
                    font-weight: bold;

                    text-align: center;

                    white-space: nowrap;
                    overflow: hidden;
                }

                /*
                 * TABELA DE DATA/HORA DA IMPRESSÃO
                 */
                .impressao {
                    width: 228px;

                    margin-top: 15px;
                    margin-left: 0;
                }

                .impressao td {
                    height: 33px;

                    font-size: 11px;
                    font-weight: bold;
                }

                .impressao td:first-child {
                    width: 150px;

                    background: #00b050;
                    color: #fff;

                    text-align: center;
                }

                .impressao td:last-child {
                    width: 78px;

                    background: #fff;

                    text-align: center;
                }

                /*
                 * MOTORISTA E PLACA
                 */
                .assinatura {
                    width: 228px;

                    margin-top: 14px;
                    margin-left: 0;
                }

                .assinatura td {
                    height: 32px;

                    font-size: 11px;
                    font-weight: bold;
                }

                .assinatura td:first-child {
                    width: 75px;

                    background: #fff;

                    text-align: center;
                }

                .assinatura td:last-child {
                    width: 153px;

                    background: #fff;

                    text-align: left;

                    padding-left: 5px;
                }

                /*
                 * PLACA
                 */
                .assinatura tr:last-child td:last-child {
                    background: #d9d9d9;
                }

                /*
                 * IMPRESSÃO
                 */
                @media print {

                    html,
                    body {
                        width: 210mm;
                        height: 297mm;

                        margin: 0;
                        padding: 0;
                    }

                    .folha {
                        width: 210mm;
                        min-height: 297mm;

                        margin: 0;
                        padding: 0;
                    }

                    /*
                     * Garante que as cores apareçam na impressão.
                     */
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                }

            </style>

        </head>

        <body>

            <div class="folha">

                <!-- CABEÇALHO -->

                <div class="cabecalho">

                    <div class="logo-container">

                        <img
                            class="logo"
                            src="data:image/png;base64,${LOGO_ANDREIS_BASE64}"
                            alt="Agrícola Andreis"
                        />

                    </div>

                    <div class="titulo-container">

                        <div class="titulo">
                            PROGRAMAÇÃO DE ENTREGA
                        </div>

                    </div>

                </div>


                <!-- NÚMERO DA CARGA -->

                <table class="numero-carga">

                    <tr>

                        <td>
                            ${carga.idCarga}
                        </td>

                    </tr>

                </table>


                <!-- DADOS DO CLIENTE -->

                <table class="dados">

                    <!-- CLIENTE -->

                    <tr>

                        <td class="campo">
                            Cliente
                        </td>

                        <td colspan="4" class="valor">
                            ${ordem.cliente?.nomeCliente || ""}
                        </td>

                    </tr>


                    <!-- ENDEREÇO -->

                    <tr>

                        <td class="campo">
                            Endereço
                        </td>

                        <td colspan="4" class="valor">
                            ${ordem.endereco || ""}
                        </td>

                    </tr>


                    <!-- PEDIDO / VENCIMENTO -->

                    <tr>

                        <td class="campo">
                            Pedido
                        </td>

                        <td class="valor pedido">
                            ${ordem.numeroPedido || ""}
                        </td>

                        <td class="campo campo-vencimento">
                            Vencimento
                        </td>

                        <td colspan="2" class="valor vencimento">
                            ${ordem.vencimento || ""}
                        </td>

                    </tr>

                </table>


                <!-- PRODUTOS -->

                <table class="produtos">

                    <thead>

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

                    </thead>

                    <tbody>

                        ${linhasProduto}

                        ${linhasVazias}

                    </tbody>

                </table>


                <!-- DATA DE ENTREGA -->

                <div class="entrega">

                    ENTREGAR ${ordem.dataEntrega || ""}

                </div>


                <!-- OBSERVAÇÃO -->

                <div class="obs">

                    OBS: ${observacao}

                </div>


                <!-- DATA E HORA DA IMPRESSÃO -->

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


                <!-- MOTORISTA E PLACA -->

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

            </div>

        </body>

        </html>
    `);

        /*
         * Finaliza o documento da nova janela.
         */
        janela.document.close();

        /*
         * Abre automaticamente a tela de impressão.
         */
        janela.focus();

        setTimeout(() => {
            janela.print();
        }, 300);
    }

    // Lista final exibida:
    // 1. Próximo primeiro
    // 2. Pendente depois
    // 3. Entregue por último
    //
    // Dentro de cada status, as cargas mais novas aparecem primeiro.
    const cargasExibidas = useMemo(() => {
        return [...cargas]
            .filter((carga) => statusVisiveis[carga.status] ?? true)
            .sort((a, b) => {
                // Primeiro compara o status
                const posicaoA = ORDEM_STATUS.indexOf(a.status);
                const posicaoB = ORDEM_STATUS.indexOf(b.status);

                const indiceA =
                    posicaoA === -1 ? ORDEM_STATUS.length : posicaoA;

                const indiceB =
                    posicaoB === -1 ? ORDEM_STATUS.length : posicaoB;

                // Se os status forem diferentes,
                // mantém a ordem:
                // PRÓXIMO -> PENDENTE -> ENTREGUE
                if (indiceA !== indiceB) {
                    return indiceA - indiceB;
                }

                // Se o status for igual,
                // coloca a carga mais nova primeiro.
                const dataA = new Date(
                    a.ordemCarregamento.dataCriacao
                ).getTime();

                const dataB = new Date(
                    b.ordemCarregamento.dataCriacao
                ).getTime();

                return dataB - dataA;
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

                localSaida: localSaida.trim() || null,

                transportadora: transportadora.trim() || null,

                notaFiscal: notaFiscal.trim() || null,

                motorista: motorista.trim() || null,

                placaVeiculo: placaVeiculo.trim().toUpperCase() || null,
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