import {
    Box,
    Card,
    IconButton,
    Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PendingIcon from "@mui/icons-material/Pending";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import type { Carga } from "../../types/carga";

import { temPermissao } from "../../services/permissionService";

interface CardCargaProps {
    carga: Carga;
    editarCarga: (carga: Carga) => void;
    visualizarCarga: (carga: Carga) => void;
    cancelarCarga: (carga: Carga) => void;
}

function CardCarga({
    carga,
    editarCarga,
    visualizarCarga,
    cancelarCarga,
}: CardCargaProps) {

    function obterStatus(status: string) {
        switch (status) {
            case "PRÓXIMO":
                return {
                    icone: <ScheduleIcon />,
                    borda: "info.main",
                    fundo: "info.light",
                };

            case "PENDENTE":
                return {
                    icone: <PendingIcon />,
                    borda: "warning.main",
                    fundo: "warning.light",
                };

            case "ENTREGUE":
                return {
                    icone: <CheckCircleIcon />,
                    borda: "success.main",
                    fundo: "success.light",
                };

            case "CANCELADA":
                return {
                    icone: <CancelIcon />,
                    borda: "error.main",
                    fundo: "error.light",
                };

            default:
                return {
                    icone: <PendingIcon />,
                    borda: "grey.400",
                    fundo: "grey.100",
                };
        }
    }

    const status = obterStatus(carga.status);

    return (
        <Card
            sx={{
                border: "1px solid",
                borderColor: status.borda,
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 1,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: status.fundo,
                    padding: 1.5,
                    borderBottom: "1px solid",
                    borderColor: status.borda,
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            color: status.borda,
                        }}
                    >
                        {status.icone}
                    </Box>

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 600,
                        }}
                    >
                        Carga #{carga.idCarga}
                    </Typography>
                </Box>

                <Box>
                    {(temPermissao("GERENTE LOGISTICA") ||
                        temPermissao("DESENVOLVEDOR")) && (
                            <IconButton
                                size="small"
                                color="error"
                                title="Cancelar carga"
                                onClick={() => cancelarCarga(carga)}
                            >
                                <CloseIcon fontSize="small" />
                            </IconButton>
                        )}

                    <IconButton
                        size="small"
                        color="warning"
                        title="Editar carga"
                        onClick={() => editarCarga(carga)}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>

                    <IconButton
                        size="small"
                        color="info"
                        title="Visualizar carga"
                        onClick={() => visualizarCarga(carga)}
                    >
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            <Box
                sx={{
                    padding: 2,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                }}
            >
                <Typography sx={{ fontWeight: 600 }}>
                    {carga.ordemCarregamento.cliente.nomeCliente}
                </Typography>

                <Typography>
                    Veículo:{" "}
                    {carga.ordemCarregamento.veiculo?.placaVeiculo ||
                        "Não informado"}
                </Typography>

                <Typography>
                    Motorista:{" "}
                    {carga.ordemCarregamento.motorista ||
                        "Não informado"}
                </Typography>

                <Typography>
                    Local de carga:{" "}
                    {carga.localSaida || "Não informado"}
                </Typography>

                <Typography>
                    Data de Entrega:{" "}
                    {carga.ordemCarregamento.dataEntrega || "Não informado"}
                </Typography>
            </Box>
        </Card>
    );
}

export default CardCarga;