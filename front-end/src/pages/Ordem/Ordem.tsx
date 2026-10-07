import {
    Box,
    Button,
    TextField,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import Header from "../../components/Header/Header";
import Sidebar from "../../components/Sidebar/Sidebar";
import PageHeader from "../../components/PageHeader/PageHeader";
import SectionBox from "../../components/SectionBox/SectionBox";

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

function Ordem() {

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
                                sx={{ flex: 1 }}
                            />

                            <Button
                                variant="outlined"
                                startIcon={<SearchIcon />}
                                sx={buttonSx}
                            >
                                CONSULTAR
                            </Button>
                        </Box>
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
                                fullWidth
                            />

                            <TextField
                                label="Endereço"
                                placeholder="Ex: Fazenda - Cidade"
                                fullWidth
                            />

                            <TextField
                                label="Vencimento"
                                type="date"
                                fullWidth
                                slotProps={dateLabelProps}
                            />

                            <TextField
                                label="Data de entrega"
                                type="date"
                                fullWidth
                                slotProps={dateLabelProps}
                            />

                            <TextField
                                label="Motorista"
                                fullWidth
                            />

                            <Box sx={{ display: { xs: "none", md: "block" } }} />

                            <TextField
                                label="Observação"
                                placeholder="Ex: Sementes em Bag"
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
                        titulo="Veículo"
                        descricao="Informe a placa do veículo que realizará o carregamento."
                        icone={<LocalShippingIcon />}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                            }}
                        >
                            <TextField
                                label="Placa do veículo"
                                placeholder="Ex: ABC1D23"
                                sx={{
                                    width: {
                                        xs: "100%",
                                        md: 250,
                                    },
                                }}
                            />

                            <Button
                                variant="outlined"
                                startIcon={<SearchIcon />}
                                sx={buttonSx}
                            >
                                CONSULTAR
                            </Button>
                        </Box>
                    </SectionBox>

                    <SectionBox
                        titulo="Produtos"
                        descricao="Informe os produtos que serão incluídos na ordem de carregamento."
                        icone={<Inventory2Icon />}
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
                                fullWidth
                            />

                            <TextField
                                label="Quantidade"
                                defaultValue={0}
                                fullWidth
                                slotProps={dateLabelProps}
                            />

                            <TextField
                                label="Valor unitário"
                                defaultValue={0}
                                fullWidth
                                slotProps={dateLabelProps}
                            />

                            <Button
                                variant="outlined"
                                startIcon={<SearchIcon />}
                                sx={buttonSx}
                            >
                                CONSULTAR
                            </Button>

                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteIcon />}
                                sx={buttonSx}
                            >
                                REMOVER
                            </Button>
                        </Box>

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