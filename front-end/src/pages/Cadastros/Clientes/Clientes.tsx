import { useState } from "react";

import {
    Box,
    Button,
} from "@mui/material";

import Header from "../../../components/Header/Header";
import Sidebar from "../../../components/Sidebar/Sidebar";
import PageHeader from "../../../components/PageHeader/PageHeader";
import ListaClientes from "./ListaClientes";

function Clientes() {

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
                        title="Clientes"
                        description="Gerencie os clientes do sistema"
                    />

                    <Button
                        variant="contained"
                        sx={{ mt: 3 }}
                        onClick={() => setAbrirFormulario(true)}
                    >
                        Novo Cliente
                    </Button>

                </Box>

                <Box>
                    <ListaClientes />
                </Box>

            </Box>

        </Box>
    );
}

export default Clientes;
