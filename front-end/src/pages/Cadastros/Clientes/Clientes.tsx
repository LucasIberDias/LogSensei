import { useState } from "react";

import {
    Box,
    Button,
} from "@mui/material";

import PageHeader from "../../../components/PageHeader/PageHeader";

import ListaClientes from "./ListaClientes";
import FormCliente from "./FormClientes";

function Clientes() {

    const [abrirFormulario, setAbrirFormulario] = useState(false);

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

            <FormCliente
                abrir={abrirFormulario}
                fechar={() => setAbrirFormulario(false)}
            />

        </Box>
    );
}

export default Clientes;