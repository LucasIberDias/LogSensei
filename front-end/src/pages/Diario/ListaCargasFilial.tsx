import { Box, Typography } from "@mui/material";

import type { Carga } from "../../types/carga";

import CardCarga from "../Cargas/CardCarga";

type ListaCargasProps = {
    cargas: Carga[];
    editarCarga?: (carga: Carga) => void;
    visualizarCarga: (carga: Carga) => void;
    cancelarCarga?: (carga: Carga) => void;
};

function ListaCargas({
    cargas,
    editarCarga,
    visualizarCarga,
    cancelarCarga,
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
                    visualizarCarga={visualizarCarga}
                    cancelarCarga={cancelarCarga}
                />
            ))}
        </Box>
    );
}

export default ListaCargas;