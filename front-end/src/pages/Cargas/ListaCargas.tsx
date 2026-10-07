import { Box, Typography } from "@mui/material";

import type { Carga } from "../../types/carga";

import CardCarga from "./CardCarga";

type ListaCargasProps = {
    cargas: Carga[];
    editarCarga: (carga: Carga) => void;
};

function ListaCargas({
    cargas,
    editarCarga,
}: ListaCargasProps) {

    if (cargas.length === 0) {
        return (
            <Typography>
                Nenhuma carga encontrada.
            </Typography>
        );
    }

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "1fr 1fr 1fr",
                },
                gap: 3,
            }}
        >
            {cargas.map((carga) => (
                <CardCarga
                    key={carga.idCarga}
                    carga={carga}
                    editarCarga={editarCarga}
                />
            ))}
        </Box>
    );
}

export default ListaCargas;