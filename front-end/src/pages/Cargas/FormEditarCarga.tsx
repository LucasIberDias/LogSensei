import { useEffect, useState } from "react";

import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import SectionBox from "../../components/SectionBox/SectionBox";
import ErroBox from "../../components/ErroBox/ErroBox";

import { buscarClientePorCodigo } from "../../services/clientesService";
import { buscarProdutoPorCodigo } from "../../services/produtosService";
import { buscarVeiculoPorPlaca } from "../../services/veiculosService";
import { atualizarCarga } from "../../services/cargasService";
import { buscarUsuariosFilial } from "../../services/usuariosService";

import type { Carga } from "../../types/carga";
import type { Cliente } from "../../types/cliente";
import type { Produto } from "../../types/produto";
import type { Veiculo } from "../../types/veiculo";

interface ItemOrdem {
    codigoProduto: string;
    quantidade: number;
    valorUnitario: number;
    produto: Produto | null;
    erro: string;
}

interface FormEditarCargaProps {
    abrir: boolean;
    carga: Carga | null;
    fechar: () => void;
    atualizar: () => Promise<void>;
}

const buttonSx = {
    height: 56,
    minWidth: 130,
    px: 3,
    whiteSpace: "nowrap",
};

const dateLabelProps = {
    inputLabel: {
        shrink: true,
    },
};

const resultadoSx = {
    display: "flex",
    flexWrap: "wrap",
    gap: 4,
    marginTop: 2,
    padding: 2,
    borderRadius: 1,
    backgroundColor: "action.hover",
};

function itemVazio(): ItemOrdem {
    return {
        codigoProduto: "",
        quantidade: 0,
        valorUnitario: 0,
        produto: null,
        erro: "",
    };
}

function formatarData(valor?: string | null) {
    return valor ? valor.slice(0, 10) : "";
}

function FormEditarCarga({
    abrir,
    carga,
    fechar,
    atualizar,
}: FormEditarCargaProps) {
    const [codigoCliente, setCodigoCliente] = useState("");
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [erroCliente, setErroCliente] = useState("");

    const [numeroPedido, setNumeroPedido] = useState("");
    const [endereco, setEndereco] = useState("");
    const [vencimento, setVencimento] = useState("");
    const [dataEntrega, setDataEntrega] = useState("");
    const [observacao, setObservacao] = useState("");

    const [localSaida, setLocalSaida] = useState("");
    const [filiais, setFiliais] = useState<string[]>([]);
    const [transportadora, setTransportadora] = useState("");
    const [notaFiscal, setNotaFiscal] = useState("");
    const [motorista, setMotorista] = useState("");

    const [placaVeiculo, setPlacaVeiculo] = useState("");
    const [veiculo, setVeiculo] = useState<Veiculo | null>(null);
    const [erroVeiculo, setErroVeiculo] = useState("");

    const [itens, setItens] = useState<ItemOrdem[]>([itemVazio()]);

    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [salvando, setSalvando] = useState(false);

    // Carrega as filiais uma vez, quando o dialog abre
    useEffect(() => {
        if (!abrir) return;

        let cancelado = false;

        async function carregarFiliais() {
            try {
                const resposta = await buscarUsuariosFilial();

                if (!cancelado) {
                    setFiliais(resposta);
                }
            } catch (error) {
                console.error("Erro ao buscar filiais:", error);

                if (!cancelado) {
                    setErro("Não foi possível carregar as filiais.");
                }
            }
        }

        carregarFiliais();

        return () => {
            cancelado = true;
        };
    }, [abrir]);

    // Preenche o formulário com os dados da carga
    useEffect(() => {
        if (!carga || !abrir) {
            return;
        }

        let cancelado = false;

        const ordem = carga.ordemCarregamento;

        setNumeroPedido(ordem.numeroPedido || "");
        setEndereco(ordem.endereco || "");
        setVencimento(formatarData(ordem.vencimento));
        setDataEntrega(formatarData(ordem.dataEntrega));
        setObservacao(ordem.observacao || "");

        setLocalSaida(carga.localSaida || "");
        setTransportadora(carga.transportadora || "");
        setNotaFiscal(carga.notaFiscal || "");
        setMotorista(ordem.motorista || "");

        setPlacaVeiculo(ordem.veiculo?.placaVeiculo || "");
        setVeiculo((ordem.veiculo as Veiculo) || null);
        setErroVeiculo("");

        setCodigoCliente(ordem.cliente?.codigoCliente?.toString() || "");
        setCliente((ordem.cliente as Cliente) || null);

        setItens([itemVazio()]);

        setErro("");
        setErroCliente("");

        async function carregarRelacionados() {
            setCarregando(true);

            if (ordem.cliente?.codigoCliente) {
                try {
                    const clienteEncontrado = await buscarClientePorCodigo(
                        Number(ordem.cliente.codigoCliente)
                    );

                    if (!cancelado && clienteEncontrado) {
                        setCliente(clienteEncontrado);
                    }
                } catch (error) {
                    console.error(error);
                }
            }

            if (ordem.veiculo?.placaVeiculo) {
                try {
                    const veiculoEncontrado = await buscarVeiculoPorPlaca(
                        ordem.veiculo.placaVeiculo
                    );

                    if (!cancelado && veiculoEncontrado) {
                        setVeiculo(veiculoEncontrado);
                    }
                } catch (error) {
                    console.error(error);
                }
            }

            const itensCarregados = await Promise.all(
                (ordem.item ?? []).map(async (item): Promise<ItemOrdem> => {
                    const codigo =
                        item.produto?.codigoProduto ?? item.codigoProduto;

                    try {
                        const produto = await buscarProdutoPorCodigo(
                            Number(codigo)
                        );

                        return {
                            codigoProduto: String(codigo),
                            quantidade: item.quantidade,
                            valorUnitario: item.valorUnitario,
                            produto,
                            erro: "",
                        };
                    } catch (error) {
                        console.error(error);

                        return {
                            codigoProduto: String(codigo),
                            quantidade: item.quantidade,
                            valorUnitario: item.valorUnitario,
                            produto: null,
                            erro: "Produto não possui cadastro.",
                        };
                    }
                })
            );

            if (!cancelado) {
                setItens(
                    itensCarregados.length > 0 ? itensCarregados : [itemVazio()]
                );

                setCarregando(false);
            }
        }

        carregarRelacionados();

        return () => {
            cancelado = true;
        };
    }, [carga, abrir]);

    async function buscarCliente() {
        if (!codigoCliente) {
            setCliente(null);
            setErroCliente("Informe o código do cliente.");
            return;
        }

        try {
            const clienteEncontrado =
                await buscarClientePorCodigo(
                    Number(codigoCliente)
                );

            setCliente(clienteEncontrado);

            setErroCliente(
                clienteEncontrado
                    ? ""
                    : "Cliente não possui cadastro."
            );
        } catch (error) {
            console.error(error);

            setCliente(null);
            setErroCliente("Cliente não possui cadastro.");
        }
    }

    async function buscarVeiculo() {
        const placa = placaVeiculo.trim().toUpperCase();

        if (!placa) {
            setVeiculo(null);
            setErroVeiculo("Informe a placa do veículo.");
            return;
        }

        try {
            const veiculoEncontrado =
                await buscarVeiculoPorPlaca(placa);

            setVeiculo(veiculoEncontrado);
            setErroVeiculo(
                veiculoEncontrado
                    ? ""
                    : "Veículo não possui cadastro."
            );
        } catch (error) {
            console.error("Erro ao buscar veículo:", error);
            setVeiculo(null);
            setErroVeiculo("Veículo não possui cadastro.");
        }
    }

    function atualizarItem(
        index: number,
        dados: Partial<ItemOrdem>
    ) {
        setItens((itensAtuais) => {
            const novosItens = [...itensAtuais];

            novosItens[index] = {
                ...novosItens[index],
                ...dados,
            };

            return novosItens;
        });
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
            const produtoEncontrado =
                await buscarProdutoPorCodigo(
                    Number(item.codigoProduto)
                );

            atualizarItem(index, {
                produto: produtoEncontrado,
                erro: "",
            });
        } catch (error) {
            console.error(error);

            atualizarItem(index, {
                produto: null,
                erro: "Produto não possui cadastro.",
            });
        }
    }

    function adicionarItem() {
        setItens((itensAtuais) => [
            ...itensAtuais,
            itemVazio(),
        ]);
    }

    function removerItem(index: number) {
        if (itens.length === 1) {
            setItens([itemVazio()]);
            return;
        }

        setItens((itensAtuais) =>
            itensAtuais.filter(
                (_, itemIndex) => itemIndex !== index
            )
        );
    }

    async function salvarAlteracoes() {
        if (!carga) {
            return;
        }

        setErro("");

        if (!cliente) {
            setErro(
                "Consulte um cliente válido antes de salvar."
            );

            return;
        }

        if (!veiculo) {
            setErro(
                "Consulte um veículo válido antes de salvar."
            );

            return;
        }

        if (itens.some((item) => !item.produto)) {
            setErro(
                "Todos os produtos precisam estar cadastrados."
            );

            return;
        }

        if (itens.some((item) => item.quantidade <= 0)) {
            setErro(
                "Informe a quantidade de todos os produtos."
            );

            return;
        }

        const idUsuario =
            localStorage.getItem("idUsuario");

        if (!idUsuario) {
            setErro("Usuário não encontrado.");
            return;
        }

        try {
            setSalvando(true);

            const dados = {
                idCarga: carga.idCarga,

                localSaida: localSaida.trim(),
                transportadora: transportadora.trim(),
                notaFiscal: notaFiscal.trim(),

                codigoCliente:
                    Number(cliente.codigoCliente),

                endereco: endereco.trim(),
                numeroPedido: numeroPedido.trim(),

                vencimento: vencimento || null,

                observacao: observacao.trim(),

                dataEntrega: dataEntrega || null,

                motorista: motorista.trim(),

                placaVeiculo:
                    veiculo.placaVeiculo,

                idUsuario: Number(idUsuario),

                itens: itens.map((item) => ({
                    codigoProduto:
                        Number(item.codigoProduto),

                    quantidade: item.quantidade,

                    valorUnitario:
                        item.valorUnitario,
                })),
            };

            await atualizarCarga(dados);

            await atualizar();

            fechar();
        } catch (error) {
            console.error(error);

            setErro(
                "Não foi possível atualizar a carga."
            );
        } finally {
            setSalvando(false);
        }
    }

    function cancelar() {
        setErro("");
        fechar();
    }

    if (!carga) {
        return null;
    }

    return (
        <Dialog
            open={abrir}
            onClose={cancelar}
            fullWidth
            maxWidth="xl"
        >
            <DialogTitle sx={{ fontWeight: 600 }}>
                Editar Carga #{carga.idCarga}
            </DialogTitle>

            <DialogContent>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        width: "100%",
                        paddingTop: 1,
                    }}
                >
                    {erro && <ErroBox mensagem={erro} />}

                    <SectionBox
                        titulo="Cliente"
                        descricao="Informe o código do cliente para carregar os dados automaticamente."
                        icone={<PersonIcon />}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                width: "100%",
                            }}
                        >
                            <TextField
                                label="Código do cliente"
                                placeholder="Ex: 12345"
                                value={codigoCliente}
                                onChange={(e) => {
                                    setCodigoCliente(
                                        e.target.value
                                    );

                                    setCliente(null);
                                    setErroCliente("");
                                }}
                                sx={{ flex: 1 }}
                            />

                            <Button
                                variant="outlined"
                                startIcon={
                                    <SearchIcon />
                                }
                                sx={buttonSx}
                                onClick={buscarCliente}
                            >
                                CONSULTAR
                            </Button>
                        </Box>

                        {cliente && (
                            <Box sx={resultadoSx}>
                                <Typography variant="body2">
                                    Código:{" "}
                                    {
                                        cliente.codigoCliente
                                    }
                                </Typography>

                                <Typography variant="body2">
                                    Nome:{" "}
                                    {
                                        cliente.nomeCliente
                                    }
                                </Typography>
                            </Box>
                        )}

                        {erroCliente && (
                            <ErroBox
                                mensagem={erroCliente}
                            />
                        )}
                    </SectionBox>

                    <SectionBox
                        titulo="Dados da Ordem"
                        descricao="Informe as informações gerais da ordem de carregamento."
                        icone={<AssignmentIcon />}
                    >
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "repeat(2, 1fr)",
                                },
                                gap: 2,
                            }}
                        >
                            <TextField
                                label="Número do pedido"
                                placeholder="Ex: 101010"
                                value={numeroPedido}
                                onChange={(e) =>
                                    setNumeroPedido(
                                        e.target.value
                                    )
                                }
                                fullWidth
                            />

                            <TextField
                                label="Endereço"
                                placeholder="Ex: Fazenda - Cidade"
                                value={endereco}
                                onChange={(e) =>
                                    setEndereco(
                                        e.target.value
                                    )
                                }
                                fullWidth
                            />

                            <TextField
                                label="Vencimento"
                                type="date"
                                value={vencimento}
                                onChange={(e) =>
                                    setVencimento(
                                        e.target.value
                                    )
                                }
                                fullWidth
                                slotProps={
                                    dateLabelProps
                                }
                            />

                            <TextField
                                label="Data de entrega"
                                type="date"
                                value={dataEntrega}
                                onChange={(e) =>
                                    setDataEntrega(
                                        e.target.value
                                    )
                                }
                                fullWidth
                                slotProps={
                                    dateLabelProps
                                }
                            />

                            <Box />

                            <TextField
                                label="Observação"
                                placeholder="Ex: Sementes em Bag"
                                value={observacao}
                                onChange={(e) =>
                                    setObservacao(
                                        e.target.value
                                    )
                                }
                                fullWidth
                                multiline
                                minRows={2}
                                sx={{
                                    gridColumn: {
                                        xs: "span 1",
                                        md: "span 2",
                                    },
                                }}
                            />
                        </Box>
                    </SectionBox>

                    <SectionBox
                        titulo="Produtos"
                        descricao="Informe os produtos que serão incluídos na ordem de carregamento."
                        icone={<Inventory2Icon />}
                    >
                        {itens.map((item, index) => (
                            <Box
                                key={index}
                                sx={{
                                    marginBottom:
                                        index ===
                                            itens.length - 1
                                            ? 0
                                            : 3,
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            md: "2fr 1fr 1fr auto auto",
                                        },
                                        gap: 2,
                                        alignItems: "center",
                                    }}
                                >
                                    <TextField
                                        label="Código do produto"
                                        placeholder="Ex: 6252"
                                        value={
                                            item.codigoProduto
                                        }
                                        onChange={(e) =>
                                            atualizarItem(
                                                index,
                                                {
                                                    codigoProduto:
                                                        e.target
                                                            .value,
                                                    produto: null,
                                                    erro: "",
                                                }
                                            )
                                        }
                                        fullWidth
                                    />

                                    <TextField
                                        label="Quantidade"
                                        type="number"
                                        value={
                                            item.quantidade
                                        }
                                        onChange={(e) =>
                                            atualizarItem(
                                                index,
                                                {
                                                    quantidade:
                                                        Number(
                                                            e
                                                                .target
                                                                .value
                                                        ),
                                                }
                                            )
                                        }
                                        fullWidth
                                    />

                                    <TextField
                                        label="Valor unitário"
                                        type="number"
                                        value={
                                            item.valorUnitario
                                        }
                                        onChange={(e) =>
                                            atualizarItem(
                                                index,
                                                {
                                                    valorUnitario:
                                                        Number(
                                                            e
                                                                .target
                                                                .value
                                                        ),
                                                }
                                            )
                                        }
                                        fullWidth
                                    />

                                    <Button
                                        variant="outlined"
                                        startIcon={
                                            <SearchIcon />
                                        }
                                        sx={buttonSx}
                                        onClick={() =>
                                            buscarProduto(
                                                index
                                            )
                                        }
                                    >
                                        CONSULTAR
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={
                                            <DeleteIcon />
                                        }
                                        sx={buttonSx}
                                        onClick={() =>
                                            removerItem(
                                                index
                                            )
                                        }
                                    >
                                        REMOVER
                                    </Button>
                                </Box>

                                {item.produto && (
                                    <Box
                                        sx={resultadoSx}
                                    >
                                        <Typography variant="body2">
                                            Código:{" "}
                                            {
                                                item.produto
                                                    .codigoProduto
                                            }
                                        </Typography>

                                        <Typography variant="body2">
                                            Nome:{" "}
                                            {
                                                item.produto
                                                    .nomeProduto
                                            }
                                        </Typography>

                                        <Typography variant="body2">
                                            Medida:{" "}
                                            {
                                                item.produto
                                                    .medidaProduto
                                            }
                                        </Typography>

                                        <Typography variant="body2">
                                            Peso:{" "}
                                            {
                                                item.produto
                                                    .pesoProduto
                                            }
                                        </Typography>
                                    </Box>
                                )}

                                {item.erro && (
                                    <ErroBox
                                        mensagem={
                                            item.erro
                                        }
                                    />
                                )}
                            </Box>
                        ))}

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent:
                                    "flex-start",
                                marginTop: 2,
                            }}
                        >
                            <Button
                                variant="outlined"
                                startIcon={
                                    <AddIcon />
                                }
                                sx={{
                                    ...buttonSx,
                                    height: 40,
                                }}
                                onClick={adicionarItem}
                            >
                                ADICIONAR PRODUTO
                            </Button>
                        </Box>
                    </SectionBox>

                    <SectionBox
                        titulo="Dados da Carga"
                        descricao="Informe os dados relacionados ao transporte da carga."
                        icone={
                            <LocalShippingIcon />
                        }
                    >
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "repeat(2, 1fr)",
                                },
                                gap: 2,
                            }}
                        >
                            <FormControl fullWidth>
                                <InputLabel id="local-saida-label">Local de Saída</InputLabel>

                                <Select
                                    labelId="local-saida-label"
                                    value={localSaida}
                                    label="Local de Saída"
                                    onChange={(e) => setLocalSaida(e.target.value)}
                                >
                                    {localSaida && !filiais.includes(localSaida) && (
                                        <MenuItem value={localSaida}>{localSaida}</MenuItem>
                                    )}

                                    {filiais.map((item) => (
                                        <MenuItem key={item} value={item}>
                                            {item}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                label="Transportadora"
                                placeholder="Ex: Transportadora ABC"
                                value={transportadora}
                                onChange={(e) =>
                                    setTransportadora(
                                        e.target.value
                                    )
                                }
                                fullWidth
                            />

                            <TextField
                                label="Nota fiscal"
                                placeholder="Ex: 123456"
                                value={notaFiscal}
                                onChange={(e) =>
                                    setNotaFiscal(
                                        e.target.value
                                    )
                                }
                                fullWidth
                            />

                            <TextField
                                label="Motorista"
                                placeholder="Nome do motorista"
                                value={motorista}
                                onChange={(e) =>
                                    setMotorista(
                                        e.target.value
                                    )
                                }
                                fullWidth
                            />

                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection:
                                        "column",
                                    gap: 2,
                                    gridColumn: {
                                        xs: "span 1",
                                        md: "span 2",
                                    },
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems:
                                            "center",
                                        gap: 2,
                                        width: "100%",
                                    }}
                                >
                                    <TextField
                                        label="Placa do veículo"
                                        placeholder="Ex: ABC1D23"
                                        value={
                                            placaVeiculo
                                        }
                                        onChange={(e) => {
                                            setPlacaVeiculo(
                                                e.target.value
                                            );

                                            setVeiculo(
                                                null
                                            );

                                            setErroVeiculo(
                                                ""
                                            );
                                        }}
                                        sx={{
                                            flex: 1,
                                        }}
                                    />

                                    <Button
                                        variant="outlined"
                                        startIcon={
                                            <SearchIcon />
                                        }
                                        sx={buttonSx}
                                        onClick={
                                            buscarVeiculo
                                        }
                                    >
                                        CONSULTAR
                                    </Button>
                                </Box>

                                {veiculo && (
                                    <Box
                                        sx={
                                            resultadoSx
                                        }
                                    >
                                        <Typography variant="body2">
                                            Placa:{" "}
                                            {
                                                veiculo.placaVeiculo
                                            }
                                        </Typography>

                                        <Typography variant="body2">
                                            Tipo:{" "}
                                            {
                                                veiculo.tipoVeiculo
                                            }
                                        </Typography>

                                        <Typography variant="body2">
                                            Capacidade:{" "}
                                            {
                                                veiculo.capacidadeVeiculo
                                            }
                                        </Typography>
                                    </Box>
                                )}

                                {erroVeiculo && (
                                    <ErroBox
                                        mensagem={
                                            erroVeiculo
                                        }
                                    />
                                )}
                            </Box>
                        </Box>
                    </SectionBox>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent:
                                "flex-end",
                            gap: 2,
                            paddingBottom: 2,
                        }}
                    >
                        <Button
                            variant="outlined"
                            color="error"
                            sx={{
                                ...buttonSx,
                                height: 44,
                            }}
                            onClick={cancelar}
                            disabled={salvando}
                        >
                            CANCELAR
                        </Button>

                        <Button
                            variant="contained"
                            sx={{
                                ...buttonSx,
                                height: 44,
                            }}
                            onClick={
                                salvarAlteracoes
                            }
                            disabled={
                                salvando ||
                                carregando ||
                                !cliente ||
                                !veiculo ||
                                itens.some((item) => !item.produto
                                )
                            }
                        >
                            {salvando
                                ? "SALVANDO..."
                                : "SALVAR ALTERAÇÕES"}
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default FormEditarCarga;