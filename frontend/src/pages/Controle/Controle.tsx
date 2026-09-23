import { useEffect, useMemo, useState } from "react";

import {
    Box,
    Paper,
    Typography,
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


// ==============================
// Interfaces
// ==============================

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

interface Cliente {
    codigoCliente: number;
    nomeCliente: string;
}

interface Veiculo {
    placaVeiculo: string;
}

interface OrdemCarregamento {
    idOrdemCarregamento: number;
    cliente: Cliente;
    endereco: string;
    numeroPedido: string;
    vencimento: string;
    item: Item[];
    observacao: string;
    dataEntrega: string;
    motorista: string;
    veiculo: Veiculo | null;
    dataCriacao: string;
}

interface Carga {
    idCarga: number;
    localSaida: string;
    transportadora: string;
    notaFiscal: string;
    status: string;
    pesoTotal: number;
    aproveitamento: number;
    ordemCarregamento: OrdemCarregamento;
}

interface ControleCarregamento {
    idCarregamento: number;

    tipoMovimentacao: string;
    destino: string;
    tipoFrete: string;
    tipoFrota: string;
    valorTonelada: number | null;
    numeroCTE: string;
    statusPagamento: string;
    localDescarga: string;
    saldoPendente: number | null;
    entregaDireto: string;

    carga: Carga;
}


// ==============================
// Componente
// ==============================

function ControleCarregamento() {

    const [controles, setControles] = useState<ControleCarregamento[]>([]);

    const [controleSelecionado, setControleSelecionado] =
        useState<ControleCarregamento | null>(null);

    const [tipoMovimentacao, setTipoMovimentacao] = useState("");
    const [destino, setDestino] = useState("");
    const [tipoFrete, setTipoFrete] = useState("");
    const [tipoFrota, setTipoFrota] = useState("");
    const [valorTonelada, setValorTonelada] = useState("");
    const [numeroCTE, setNumeroCTE] = useState("");
    const [statusPagamento, setStatusPagamento] = useState("");
    const [localDescarga, setLocalDescarga] = useState("");
    const [saldoPendente, setSaldoPendente] = useState("");
    const [entregaDireto, setEntregaDireto] = useState("");

    const [erro, setErro] = useState("");
    const [salvando, setSalvando] = useState(false);


    // ==============================
    // Carregar controles
    // ==============================

    useEffect(() => {
        carregarControles();
    }, []);


    async function carregarControles() {

        try {

            setErro("");

            const response = await api.get("/controleCarregamento");

            console.log("RESPOSTA DA API:", response.data);

            if (Array.isArray(response.data)) {

                setControles(response.data);

            } else {

                setControles([]);

                console.error(
                    "A API não retornou uma lista de controles:",
                    response.data
                );
            }

        } catch (error) {

            console.error(error);

            setErro(
                "Não foi possível carregar os controles de carregamento."
            );
        }
    }


    // ==============================
    // Ordenação
    // Mais novo → mais antigo
    // ==============================

    const controlesExibidos = useMemo(() => {

        return [...controles].sort((a, b) => {

            const dataA =
                a.carga?.ordemCarregamento?.dataCriacao
                    ? new Date(
                        a.carga.ordemCarregamento.dataCriacao
                    ).getTime()
                    : 0;

            const dataB =
                b.carga?.ordemCarregamento?.dataCriacao
                    ? new Date(
                        b.carga.ordemCarregamento.dataCriacao
                    ).getTime()
                    : 0;

            return dataB - dataA;
        });

    }, [controles]);


    // ==============================
    // Abrir edição
    // ==============================

    function abrirEdicao(controle: ControleCarregamento) {

        setControleSelecionado(controle);

        setTipoMovimentacao(
            controle.tipoMovimentacao || ""
        );

        setDestino(
            controle.destino || ""
        );

        setTipoFrete(
            controle.tipoFrete || ""
        );

        setTipoFrota(
            controle.tipoFrota || ""
        );

        setValorTonelada(
            controle.valorTonelada !== null &&
            controle.valorTonelada !== undefined
                ? String(controle.valorTonelada)
                : ""
        );

        setNumeroCTE(
            controle.numeroCTE || ""
        );

        setStatusPagamento(
            controle.statusPagamento || ""
        );

        setLocalDescarga(
            controle.localDescarga || ""
        );

        setSaldoPendente(
            controle.saldoPendente !== null &&
            controle.saldoPendente !== undefined
                ? String(controle.saldoPendente)
                : ""
        );

        setEntregaDireto(
            controle.entregaDireto || ""
        );

        setErro("");
    }


    // ==============================
    // Fechar edição
    // ==============================

    function fecharEdicao() {

        setControleSelecionado(null);

        setTipoMovimentacao("");
        setDestino("");
        setTipoFrete("");
        setTipoFrota("");
        setValorTonelada("");
        setNumeroCTE("");
        setStatusPagamento("");
        setLocalDescarga("");
        setSaldoPendente("");
        setEntregaDireto("");

        setErro("");
    }


    // ==============================
    // Salvar edição
    // ==============================

    async function salvarEdicao() {

        if (!controleSelecionado) {
            return;
        }

        try {

            setSalvando(true);
            setErro("");

            await api.patch("/controleCarregamento", {

                idCarregamento:
                    controleSelecionado.idCarregamento,

                tipoMovimentacao:
                    tipoMovimentacao.trim() || null,

                destino:
                    destino.trim() || null,

                tipoFrete:
                    tipoFrete.trim() || null,

                tipoFrota:
                    tipoFrota.trim() || null,

                valorTonelada:
                    valorTonelada.trim() !== ""
                        ? Number(valorTonelada)
                        : null,

                numeroCTE:
                    numeroCTE.trim() || null,

                statusPagamento:
                    statusPagamento.trim() || null,

                localDescarga:
                    localDescarga.trim() || null,

                saldoPendente:
                    saldoPendente.trim() !== ""
                        ? Number(saldoPendente)
                        : null,

                entregaDireto:
                    entregaDireto.trim() || null,
            });


            await carregarControles();

            fecharEdicao();

        } catch (error: any) {

            console.error(error);

            if (error.response?.status === 403) {

                setErro(
                    "Você não tem permissão para editar este controle."
                );

            } else {

                setErro(
                    "Não foi possível salvar as alterações."
                );
            }

        } finally {

            setSalvando(false);
        }
    }


    // ==============================
    // Formatação de data
    // ==============================

    function formatarData(data: string) {

        if (!data) {
            return "-";
        }

        const dataFormatada = new Date(data);

        if (isNaN(dataFormatada.getTime())) {
            return data;
        }

        return dataFormatada.toLocaleDateString("pt-BR");
    }


    // ==============================
    // Formatação de número
    // ==============================

    function formatarNumero(valor: number | null | undefined) {

        if (valor === null || valor === undefined) {
            return "-";
        }

        return valor.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    }


    // ==============================
    // Tela
    // ==============================

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

                {/* Espaço para o Header */}
                <Box sx={{ height: "64px" }} />


                {/* Título */}

                <Typography
                    variant="h4"
                    sx={{ mb: 1, fontWeight: "bold" }}
                >
                    Controle de Carregamento
                </Typography>


                <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ mb: 3 }}
                >
                    Visualize e gerencie os controles de carregamento.
                </Typography>


                {/* Erro */}

                {erro && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >
                        {erro}
                    </Alert>
                )}


                {/* Lista */}

                {controlesExibidos.length === 0 ? (

                    <Paper
                        elevation={1}
                        sx={{
                            padding: 3,
                            textAlign: "center",
                        }}
                    >

                        <Typography color="text.secondary">
                            Nenhum controle de carregamento encontrado.
                        </Typography>

                    </Paper>

                ) : (

                    controlesExibidos.map((controle) => {

                        const carga =
                            controle.carga;

                        const ordem =
                            carga?.ordemCarregamento;

                        const cliente =
                            ordem?.cliente;


                        return (

                            <Paper
                                key={controle.idCarregamento}
                                elevation={1}
                                sx={{
                                    padding: 3,
                                    marginBottom: 3,
                                }}
                            >

                                {/* ============================== */}
                                {/* Cabeçalho */}
                                {/* ============================== */}

                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        gap: 2,
                                        flexWrap: "wrap",
                                        mb: 2,
                                    }}
                                >

                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: "bold" }}
                                    >
                                        Controle #
                                        {controle.idCarregamento}
                                    </Typography>


                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            abrirEdicao(controle)
                                        }
                                    >
                                        Editar
                                    </Button>

                                </Box>


                                {/* ============================== */}
                                {/* Dados do Controle */}
                                {/* ============================== */}

                                <Typography
                                    variant="h6"
                                    sx={{ mb: 2, fontWeight: "bold" }}
                                >
                                    Dados do Controle
                                </Typography>


                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            sm: "1fr 1fr",
                                            md: "1fr 1fr 1fr",
                                        },
                                        gap: 2,
                                    }}
                                >

                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Tipo de movimentação
                                        </Typography>

                                        <Typography>
                                            {controle.tipoMovimentacao || "-"}
                                        </Typography>
                                    </Box>


                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Destino
                                        </Typography>

                                        <Typography>
                                            {controle.destino || "-"}
                                        </Typography>
                                    </Box>


                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Tipo de frete
                                        </Typography>

                                        <Typography>
                                            {controle.tipoFrete || "-"}
                                        </Typography>
                                    </Box>


                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Tipo de frota
                                        </Typography>

                                        <Typography>
                                            {controle.tipoFrota || "-"}
                                        </Typography>
                                    </Box>


                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Valor por tonelada
                                        </Typography>

                                        <Typography>
                                            {controle.valorTonelada !== null &&
                                            controle.valorTonelada !== undefined
                                                ? `R$ ${formatarNumero(
                                                    controle.valorTonelada
                                                )}`
                                                : "-"}
                                        </Typography>
                                    </Box>


                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Número CTE
                                        </Typography>

                                        <Typography>
                                            {controle.numeroCTE || "-"}
                                        </Typography>
                                    </Box>


                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Status do pagamento
                                        </Typography>

                                        <Typography>
                                            {controle.statusPagamento || "-"}
                                        </Typography>
                                    </Box>


                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Local de descarga
                                        </Typography>

                                        <Typography>
                                            {controle.localDescarga || "-"}
                                        </Typography>
                                    </Box>


                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Saldo pendente
                                        </Typography>

                                        <Typography>
                                            {controle.saldoPendente !== null &&
                                            controle.saldoPendente !== undefined
                                                ? `R$ ${formatarNumero(
                                                    controle.saldoPendente
                                                )}`
                                                : "-"}
                                        </Typography>
                                    </Box>


                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Entrega direto
                                        </Typography>

                                        <Typography>
                                            {controle.entregaDireto || "-"}
                                        </Typography>
                                    </Box>

                                </Box>


                                <Divider sx={{ my: 3 }} />


                                {/* ============================== */}
                                {/* Dados da Carga */}
                                {/* ============================== */}

                                <Typography
                                    variant="h6"
                                    sx={{ mb: 2, fontWeight: "bold" }}
                                >
                                    Dados da Carga
                                </Typography>


                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            sm: "1fr 1fr",
                                            md: "1fr 1fr 1fr",
                                        },
                                        gap: 2,
                                    }}
                                >

                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Carga
                                        </Typography>

                                        <Typography>
                                            #{carga?.idCarga || "-"}
                                        </Typography>
                                    </Box>


                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Status
                                        </Typography>

                                        <Typography>
                                            {carga?.status || "-"}
                                        </Typography>
                                    </Box>


                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Nota fiscal
                                        </Typography>

                                        <Typography>
                                            {carga?.notaFiscal || "-"}
                                        </Typography>
                                    </Box>


                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Transportadora
                                        </Typography>

                                        <Typography>
                                            {carga?.transportadora || "-"}
                                        </Typography>
                                    </Box>


                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Local de saída
                                        </Typography>

                                        <Typography>
                                            {carga?.localSaida || "-"}
                                        </Typography>
                                    </Box>


                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Peso total
                                        </Typography>

                                        <Typography>
                                            {formatarNumero(
                                                carga?.pesoTotal
                                            )}
                                        </Typography>
                                    </Box>


                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Aproveitamento
                                        </Typography>

                                        <Typography>
                                            {carga?.aproveitamento !== undefined &&
                                            carga?.aproveitamento !== null
                                                ? `${formatarNumero(
                                                    carga.aproveitamento
                                                )}%`
                                                : "-"}
                                        </Typography>
                                    </Box>

                                </Box>


                                <Divider sx={{ my: 3 }} />


                                {/* ============================== */}
                                {/* Dados da Ordem */}
                                {/* ============================== */}

                                <Typography
                                    variant="h6"
                                    sx={{ mb: 2, fontWeight: "bold" }}
                                >
                                    Dados da Ordem
                                </Typography>


                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            sm: "1fr 1fr",
                                            md: "1fr 1fr 1fr",
                                        },
                                        gap: 2,
                                    }}
                                >

                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Ordem
                                        </Typography>

                                        <Typography>
                                            #
                                            {ordem?.idOrdemCarregamento || "-"}
                                        </Typography>
                                    </Box>


                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Cliente
                                        </Typography>

                                        <Typography>
                                            {cliente?.nomeCliente || "-"}
                                        </Typography>
                                    </Box>


                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Código do cliente
                                        </Typography>

                                        <Typography>
                                            {cliente?.codigoCliente || "-"}
                                        </Typography>
                                    </Box>


                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Número do pedido
                                        </Typography>

                                        <Typography>
                                            {ordem?.numeroPedido || "-"}
                                        </Typography>
                                    </Box>


                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Endereço
                                        </Typography>

                                        <Typography>
                                            {ordem?.endereco || "-"}
                                        </Typography>
                                    </Box>


                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Vencimento
                                        </Typography>

                                        <Typography>
                                            {ordem?.vencimento || "-"}
                                        </Typography>
                                    </Box>


                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Motorista
                                        </Typography>

                                        <Typography>
                                            {ordem?.motorista || "-"}
                                        </Typography>
                                    </Box>


                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Placa
                                        </Typography>

                                        <Typography>
                                            {ordem?.veiculo?.placaVeiculo || "-"}
                                        </Typography>
                                    </Box>


                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Data de entrega
                                        </Typography>

                                        <Typography>
                                            {ordem?.dataEntrega
                                                ? formatarData(
                                                    ordem.dataEntrega
                                                )
                                                : "-"}
                                        </Typography>
                                    </Box>


                                    <Box>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            Data de criação
                                        </Typography>

                                        <Typography>
                                            {ordem?.dataCriacao
                                                ? formatarData(
                                                    ordem.dataCriacao
                                                )
                                                : "-"}
                                        </Typography>
                                    </Box>

                                </Box>


                                {/* ============================== */}
                                {/* Observação */}
                                {/* ============================== */}

                                <Box sx={{ mt: 3 }}>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Observação
                                    </Typography>

                                    <Typography>
                                        {ordem?.observacao || "-"}
                                    </Typography>

                                </Box>


                                {/* ============================== */}
                                {/* Produtos */}
                                {/* ============================== */}

                                {ordem?.item &&
                                    ordem.item.length > 0 && (

                                        <>

                                            <Divider sx={{ my: 3 }} />

                                            <Typography
                                                variant="h6"
                                                sx={{ mb: 2, fontWeight: "bold" }}
                                            >
                                                Produtos
                                            </Typography>


                                            {ordem.item.map((item, index) => (

                                                <Box
                                                    key={index}
                                                    sx={{
                                                        mb: 2,
                                                        p: 2,
                                                        border: "1px solid",
                                                        borderColor:
                                                            "divider",
                                                        borderRadius: 1,
                                                    }}
                                                >

                                                    <Typography
                                                        sx={{ fontWeight: "bold" }}
                                                    >
                                                        {item.produto?.nomeProduto ||
                                                            "-"}
                                                    </Typography>


                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                    >
                                                        Código:{" "}
                                                        {item.codigoProduto}
                                                    </Typography>


                                                    <Typography
                                                        variant="body2"
                                                    >
                                                        Quantidade:{" "}
                                                        {item.quantidade}
                                                    </Typography>


                                                    <Typography
                                                        variant="body2"
                                                    >
                                                        Valor unitário: R${" "}
                                                        {formatarNumero(
                                                            item.valorUnitario
                                                        )}
                                                    </Typography>


                                                    <Typography
                                                        variant="body2"
                                                    >
                                                        Medida:{" "}
                                                        {item.produto
                                                            ?.medidaProduto ||
                                                            "-"}
                                                    </Typography>

                                                </Box>

                                            ))}

                                        </>

                                    )}

                            </Paper>

                        );

                    })

                )}

            </Box>


            {/* ============================== */}
            {/* Modal de edição */}
            {/* ============================== */}

            <Dialog
                open={controleSelecionado !== null}
                onClose={fecharEdicao}
                fullWidth
                maxWidth="md"
            >

                <DialogTitle>
                    Editar Controle de Carregamento
                </DialogTitle>


                <DialogContent>

                    {erro && (
                        <Alert
                            severity="error"
                            sx={{ mb: 2, mt: 1 }}
                        >
                            {erro}
                        </Alert>
                    )}


                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: {
                                xs: "1fr",
                                sm: "1fr 1fr",
                            },
                            gap: 2,
                            mt: 1,
                        }}
                    >

                        <TextField
                            label="Tipo de movimentação"
                            value={tipoMovimentacao}
                            onChange={(e) =>
                                setTipoMovimentacao(e.target.value)
                            }
                            fullWidth
                        />


                        <TextField
                            label="Destino"
                            value={destino}
                            onChange={(e) =>
                                setDestino(e.target.value)
                            }
                            fullWidth
                        />


                        <TextField
                            label="Tipo de frete"
                            value={tipoFrete}
                            onChange={(e) =>
                                setTipoFrete(e.target.value)
                            }
                            fullWidth
                        />


                        <TextField
                            label="Tipo de frota"
                            value={tipoFrota}
                            onChange={(e) =>
                                setTipoFrota(e.target.value)
                            }
                            fullWidth
                        />


                        <TextField
                            label="Valor por tonelada"
                            type="number"
                            value={valorTonelada}
                            onChange={(e) =>
                                setValorTonelada(e.target.value)
                            }
                            fullWidth
                        />


                        <TextField
                            label="Número CTE"
                            value={numeroCTE}
                            onChange={(e) =>
                                setNumeroCTE(e.target.value)
                            }
                            fullWidth
                        />


                        <TextField
                            label="Status do pagamento"
                            value={statusPagamento}
                            onChange={(e) =>
                                setStatusPagamento(e.target.value)
                            }
                            fullWidth
                        />


                        <TextField
                            label="Local de descarga"
                            value={localDescarga}
                            onChange={(e) =>
                                setLocalDescarga(e.target.value)
                            }
                            fullWidth
                        />


                        <TextField
                            label="Saldo pendente"
                            type="number"
                            value={saldoPendente}
                            onChange={(e) =>
                                setSaldoPendente(e.target.value)
                            }
                            fullWidth
                        />


                        <TextField
                            label="Entrega direto"
                            value={entregaDireto}
                            onChange={(e) =>
                                setEntregaDireto(e.target.value)
                            }
                            fullWidth
                        />

                    </Box>

                </DialogContent>


                <DialogActions>

                    <Button
                        onClick={fecharEdicao}
                        disabled={salvando}
                    >
                        Cancelar
                    </Button>


                    <Button
                        variant="contained"
                        onClick={salvarEdicao}
                        disabled={salvando}
                    >
                        {salvando ? "Salvando..." : "Salvar"}
                    </Button>

                </DialogActions>

            </Dialog>

        </Box>
    );
}

export default ControleCarregamento;