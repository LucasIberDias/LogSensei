import { useEffect, useState } from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
} from "@mui/material";

import { listarClientes } from "../../../services/clientesService";

import type { Cliente } from "../../../types/cliente";

function ListaClientes() {

    const [clientes, setClientes] = useState<Cliente[]>([]);

    useEffect(() => {
        carregarClientes();
    }, []);

    async function carregarClientes() {
        try {
            const clientes = await listarClientes();

            setClientes(clientes);
        } catch (error) {
            console.error("Erro ao listar clientes:", error);
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
            {clientes.map((cliente) => (
                <Card key={cliente.codigoCliente}>
                    <CardContent>
                        <Typography variant="h6">
                            {formatarNome(cliente.nomeCliente)}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Código: {cliente.codigoCliente}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
}

export default ListaClientes;