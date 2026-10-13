import {
    Box,
    Card,
    Typography,
} from "@mui/material";

import type { Carga } from "../../types/carga";

function formatarData(data: string | null | undefined): string {
    if (!data) {
        return "Não informado";
    }

    const dataFormatada = new Date(data);

    if (isNaN(dataFormatada.getTime())) {
        return "Não informado";
    }

    return dataFormatada.toLocaleDateString("pt-BR", {
        timeZone: "UTC",
    });
}

function CardCargaFilial({ carga }: { carga: Carga }) {
    return (
        <Card
            sx={{
                border: "1px solid",
                borderColor: "info.main",
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 1,
                backgroundColor: "background.paper",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "info.light",
                    padding: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "info.main",
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontWeight: 600,
                        color: "text.primary",
                    }}
                >
                    Carga #{carga.idCarga}
                </Typography>
            </Box>

            <Box
                sx={{
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                }}
            >
                <Typography
                    sx={{
                        fontWeight: 600,
                        color: "text.primary",
                    }}
                >
                    {carga.ordemCarregamento.cliente.nomeCliente}
                </Typography>

                <Typography color="text.secondary">
                    Veículo:{" "}
                    {carga.ordemCarregamento.veiculo?.placaVeiculo ||
                        "Não informado"}
                </Typography>

                <Typography color="text.secondary">
                    Motorista:{" "}
                    {carga.ordemCarregamento.motorista ||
                        "Não informado"}
                </Typography>

                <Typography color="text.secondary">
                    Local de carga:{" "}
                    {carga.localSaida || "Não informado"}
                </Typography>

                <Typography color="text.secondary">
                    Data de Entrega:{" "}
                    {formatarData(carga.ordemCarregamento.dataEntrega)}
                </Typography>
            </Box>
        </Card>
    );
}

export default CardCargaFilial;