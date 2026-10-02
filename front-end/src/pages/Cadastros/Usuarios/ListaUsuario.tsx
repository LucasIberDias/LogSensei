import { useEffect, useState } from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
} from "@mui/material";

import { listarUsuarios } from "../../../services/usuariosService";

import type { Usuario } from "../../../types/usuario";

function ListaUsuarios() {

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);

    useEffect(() => {
        carregarUsuarios();
    }, []);

    async function carregarUsuarios() {
        try {
            const usuarios = await listarUsuarios();

            setUsuarios(usuarios);
        } catch (error) {
            console.error("Erro ao listar usuários:", error);
        }
    }

    function formatarNome(nome: string) {
        return nome
            .toLowerCase()
            .split(" ")
            .map(
                palavra =>
                    palavra.charAt(0).toUpperCase() + palavra.slice(1)
            )
            .join(" ");
    }

    function formatarCargo(cargo: string) {
        return cargo
            .toLowerCase()
            .split(" ")
            .map(
                palavra =>
                    palavra.charAt(0).toUpperCase() + palavra.slice(1)
            )
            .join(" ");
    }

    return (
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
            {usuarios.map((usuario) => (
                <Card key={usuario.idUsuario}>
                    <CardContent>
                        <Typography variant="h6">
                            {formatarNome(usuario.nomeUsuario)}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {formatarCargo(usuario.cargo)}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}

export default ListaUsuarios;