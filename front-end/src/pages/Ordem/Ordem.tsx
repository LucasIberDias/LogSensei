import { useState } from "react";

import {
    Box,
    Button,
    TextField,
    Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import PageHeader from "../../components/PageHeader/PageHeader";
import SectionBox from "../../components/SectionBox/SectionBox";
import ErroBox from "../../components/ErroBox/ErroBox";

import { buscarClientePorCodigo } from "../../services/clientesService";
import { buscarProdutoPorCodigo } from "../../services/produtosService";
import { criarOrdemCarregamento } from "../../services/ordemCarregamentoService";

import type { Cliente } from "../../types/cliente";
import type { Produto } from "../../types/produto";

interface ItemOrdem {
    codigoProduto: string;
    quantidade: number;
    valorUnitario: number;
    produto: Produto | null;
    erro: string;
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

function Ordem() {
    const [codigoCliente, setCodigoCliente] = useState("");
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [erroCliente, setErroCliente] = useState("");

    const [numeroPedido, setNumeroPedido] = useState("");
    const [endereco, setEndereco] = useState("");
    const [vencimento, setVencimento] = useState("");
    const [dataEntrega, setDataEntrega] = useState("");
    const [observacao, setObservacao] = useState("");

    const [itens, setItens] = useState<ItemOrdem[]>([
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
            const clienteEncontrado =
                await buscarClientePorCodigo(Number(codigoCliente));

            setCliente(clienteEncontrado);
            setErroCliente(
                clienteEncontrado ? "" : "Cliente não possui cadastro."
            );
        } catch (error) {
            console.error(error);
            setCliente(null);
            setErroCliente("Cliente não possui cadastro.");
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
            const produtoEncontrado = await buscarProdutoPorCodigo(
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
            {
                codigoProduto: "",
                quantidade: 0,
                valorUnitario: 0,
                produto: null,
                erro: "",
            },
        ]);
    }

    function removerItem(index: number) {
        if (itens.length === 1) {
            setItens([
                {
                    codigoProduto: "",
                    quantidade: 0,
                    valorUnitario: 0,
                    produto: null,
                    erro: "",
                },
            ]);
            return;
        }

        setItens((itensAtuais) =>
            itensAtuais.filter((_, itemIndex) => itemIndex !== index)
        );
    }

    async function criarOrdem() {
        if (!cliente) {
            alert("Consulte um cliente válido antes de criar a ordem.");
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
                endereco: endereco.toUpperCase(),
                numeroPedido: numeroPedido.toUpperCase(),
                vencimento: vencimento.toUpperCase(),
                observacao: observacao.toUpperCase(),
                dataEntrega: dataEntrega.toUpperCase(),
                idUsuario: Number(idUsuario),
                itens: itens.map((item) => ({
                    codigoProduto: Number(item.codigoProduto),
                    quantidade: item.quantidade,
                    valorUnitario: item.valorUnitario,
                })),
            };

            await criarOrdemCarregamento(dados);

            alert("Ordem de carregamento criada com sucesso!");
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Não foi possível criar a ordem de carregamento.");
        }
    }

    return (
        <Box>
            <Box
                component="main"
                sx={{
                    marginLeft: {
                        xs: 0,
                        md: "240px",
                    },
                    padding: 3,
                    paddingTop: 10,
                    boxSizing: "border-box",
                }}
            >
                <PageHeader
                    title="Ordem de Carregamento"
                    description="Preencha as informações abaixo para criar uma nova ordem de carregamento."
                />

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        width: "100%",
                    }}
                >
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
                                    setCodigoCliente(e.target.value);
                                    setCliente(null);
                                    setErroCliente("");
                                }}
                                sx={{ flex: 1 }}
                            />

                            <Button
                                variant="outlined"
                                startIcon={<SearchIcon />}
                                sx={buttonSx}
                                onClick={buscarCliente}
                            >
                                CONSULTAR
                            </Button>
                        </Box>

                        {cliente && (
                            <Box sx={resultadoSx}>
                                <Typography variant="body2">
                                    Código: {cliente.codigoCliente}
                                </Typography>

                                <Typography variant="body2">
                                    Nome: {cliente.nomeCliente}
                                </Typography>
                            </Box>
                        )}

                        {erroCliente && (
                            <ErroBox mensagem={erroCliente} />
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
                                    setNumeroPedido(e.target.value)
                                }
                                fullWidth
                            />

                            <TextField
                                label="Endereço"
                                placeholder="Ex: Fazenda - Cidade"
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
                                fullWidth
                                slotProps={dateLabelProps}
                            />

                            <TextField
                                label="Data de entrega"
                                type="date"
                                value={dataEntrega}
                                onChange={(e) =>
                                    setDataEntrega(e.target.value)
                                }
                                fullWidth
                                slotProps={dateLabelProps}
                            />
                            <Box />

                            <TextField
                                label="Observação"
                                placeholder="Ex: Sementes em Bag"
                                value={observacao}
                                onChange={(e) =>
                                    setObservacao(e.target.value)
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
                                        index === itens.length - 1 ? 0 : 3,
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
                                        value={item.codigoProduto}
                                        onChange={(e) =>
                                            atualizarItem(index, {
                                                codigoProduto: e.target.value,
                                                produto: null,
                                                erro: "",
                                            })
                                        }
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
                                        startIcon={<SearchIcon />}
                                        sx={buttonSx}
                                        onClick={() => buscarProduto(index)}
                                    >
                                        CONSULTAR
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        sx={buttonSx}
                                        onClick={() => removerItem(index)}
                                    >
                                        REMOVER
                                    </Button>
                                </Box>

                                {item.produto && (
                                    <Box sx={resultadoSx}>
                                        <Typography variant="body2">
                                            Código: {item.produto.codigoProduto}
                                        </Typography>

                                        <Typography variant="body2">
                                            Nome: {item.produto.nomeProduto}
                                        </Typography>

                                        <Typography variant="body2">
                                            Medida: {item.produto.medidaProduto}
                                        </Typography>

                                        <Typography variant="body2">
                                            Peso: {item.produto.pesoProduto}
                                        </Typography>
                                    </Box>
                                )}

                                {item.erro && (
                                    <ErroBox mensagem={item.erro} />
                                )}
                            </Box>
                        ))}

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-start",
                                marginTop: 2,
                            }}
                        >
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
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

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                        }}
                    >
                        <Button
                            variant="contained"
                            sx={{
                                ...buttonSx,
                                height: 44,
                            }}
                            onClick={criarOrdem}
                            disabled={
                                !cliente ||
                                itens.some((item) => !item.produto)
                            }
                        >
                            CRIAR ORDEM
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default Ordem;