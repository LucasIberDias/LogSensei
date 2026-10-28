import { useState } from "react";

import {
    Box,
    Button,
} from "@mui/material";

import PageHeader from "../../../components/PageHeader/PageHeader";
import ListaUsuarios from "./ListaUsuario";

import FormUsuario from "./FormUsuario";

function Usuarios() {

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
                        title="Usuários"
                        description="Gerencie os usuários do sistema"
                    />

                    <Button
                        variant="contained"
                        sx={{ mt: 3 }}
                        onClick={() => setAbrirFormulario(true)}
                    >
                        Novo usuário
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

                <ListaUsuarios />

                <FormUsuario
                    abrir={abrirFormulario}
                    fechar={() => setAbrirFormulario(false)}
                />

            </Box>
        </Box>
    );
}

export default Usuarios;