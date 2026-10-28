import { useState } from "react";

import {
    Box,
    Button,
} from "@mui/material";

import Header from "../../../components/Header/Header";
import Sidebar from "../../../components/Sidebar/Sidebar";
import PageHeader from "../../../components/PageHeader/PageHeader";

import ListaProdutos from "./ListaProdutos";
import FormProdutos from "./FormProdutos";

function Produtos() {

    const [abrirFormulario, setAbrirFormulario] = useState(false);

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
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 3,
                    }}
                >
                    <PageHeader
                        title="Produtos"
                        description="Gerencie os produtos do sistema"
                    />

                    <Button
                        variant="contained"
                        sx={{ mt: 3 }}
                        onClick={() => setAbrirFormulario(true)}
                    >
                        Novo Produto
                    </Button>
                </Box>

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
                </Box>

                <ListaProdutos />

                <FormProdutos
                    abrir={abrirFormulario}
                    fechar={() => setAbrirFormulario(false)}
                />

            </Box>
        </Box>
    );
}

export default Produtos;