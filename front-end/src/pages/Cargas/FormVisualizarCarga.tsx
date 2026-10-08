import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
} from "@mui/material";

import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PrintIcon from "@mui/icons-material/Print";

import NumbersIcon from "@mui/icons-material/Numbers";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EventIcon from "@mui/icons-material/Event";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import DescriptionIcon from "@mui/icons-material/Description";
import CategoryIcon from "@mui/icons-material/Category";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ScaleIcon from "@mui/icons-material/Scale";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import BusinessIcon from "@mui/icons-material/Business";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BadgeIcon from "@mui/icons-material/Badge";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SpeedIcon from "@mui/icons-material/Speed";
import PercentIcon from "@mui/icons-material/Percent";
import InfoIcon from "@mui/icons-material/Info";

import SectionBox from "../../components/SectionBox/SectionBox";

import type { Carga } from "../../types/carga";

interface FormVisualizarCargaProps {
    abrir: boolean;
    carga: Carga | null;
    fechar: () => void;
    imprimir: () => void;
}

const resultadoSx = {
    display: "flex",
    alignItems: "center",
    gap: 1,
    minHeight: 48,
    padding: 1.5,
    borderRadius: 1,
    backgroundColor: "action.hover",
};

const iconeSx = {
    fontSize: 20,
    color: "text.secondary",
};

const buttonSx = {
    height: 44,
    minWidth: 130,
    px: 3,
    whiteSpace: "nowrap",
};

function formatarData(valor?: string | null) {
    return valor ? valor.slice(0, 10) : "Não informado";
}

function FormVisualizarCarga({
    abrir,
    carga,
    fechar,
    imprimir,
}: FormVisualizarCargaProps) {
    if (!carga) {
        return null;
    }

    const ordem = carga.ordemCarregamento;

    return (
        <Dialog
            open={abrir}
            onClose={fechar}
            fullWidth
            maxWidth="xl"
        >
            <DialogTitle
                sx={{
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                <LocalShippingIcon />

                Visualizar Carga #{carga.idCarga}
            </DialogTitle>

            <DialogContent>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        width: "100%",
                        paddingTop: 1,
                    }}
                >
                    {/* CLIENTE */}
                    <SectionBox
                        titulo="Cliente"
                        descricao="Dados do cliente relacionado à carga."
                        icone={<PersonIcon />}
                    >
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "repeat(2, 1fr)",
                                },
                                gap: 2,
                                marginTop: 2,
                            }}
                        >
                            <Box sx={resultadoSx}>
                                <NumbersIcon sx={iconeSx} />

                                <Typography variant="body2">
                                    <strong>Código:</strong>{" "}
                                    {ordem.cliente?.codigoCliente ??
                                        "Não informado"}
                                </Typography>
                            </Box>

                            <Box sx={resultadoSx}>
                                <PersonIcon sx={iconeSx} />

                                <Typography variant="body2">
                                    <strong>Nome:</strong>{" "}
                                    {ordem.cliente?.nomeCliente ||
                                        "Não informado"}
                                </Typography>
                            </Box>
                        </Box>
                    </SectionBox>

                    <SectionBox
                        titulo="Dados da Ordem"
                        descricao="Informações gerais da ordem de carregamento."
                        icone={<AssignmentIcon />}
                    >
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "repeat(2, 1fr)",
                                },
                                gap: 2,
                                marginTop: 2,
                            }}
                        >
                            <Box sx={resultadoSx}>
                                <NumbersIcon sx={iconeSx} />

                                <Typography variant="body2">
                                    <strong>Número do pedido:</strong>{" "}
                                    {ordem.numeroPedido ||
                                        "Não informado"}
                                </Typography>
                            </Box>

                            <Box sx={resultadoSx}>
                                <LocationOnIcon sx={iconeSx} />

                                <Typography variant="body2">
                                    <strong>Endereço:</strong>{" "}
                                    {ordem.endereco ||
                                        "Não informado"}
                                </Typography>
                            </Box>

                            <Box sx={resultadoSx}>
                                <EventIcon sx={iconeSx} />

                                <Typography variant="body2">
                                    <strong>Vencimento:</strong>{" "}
                                    {formatarData(ordem.vencimento)}
                                </Typography>
                            </Box>

                            <Box sx={resultadoSx}>
                                <EventAvailableIcon sx={iconeSx} />

                                <Typography variant="body2">
                                    <strong>Data de entrega:</strong>{" "}
                                    {formatarData(ordem.dataEntrega)}
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    ...resultadoSx,
                                    gridColumn: {
                                        xs: "span 1",
                                        md: "span 2",
                                    },
                                }}
                            >
                                <DescriptionIcon sx={iconeSx} />

                                <Typography variant="body2">
                                    <strong>Observação:</strong>{" "}
                                    {ordem.observacao ||
                                        "Não informado"}
                                </Typography>
                            </Box>
                        </Box>
                    </SectionBox>

                    <SectionBox
                        titulo="Produtos"
                        descricao="Produtos incluídos na ordem de carregamento."
                        icone={<Inventory2Icon />}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                marginTop: 2,
                            }}
                        >
                            {(ordem.item ?? []).map(
                                (item, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            padding: 2,
                                            borderRadius: 1,
                                            backgroundColor:
                                                "action.hover",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                display: "grid",
                                                gridTemplateColumns: {
                                                    xs: "1fr",
                                                    md: "repeat(3, 1fr)",
                                                },
                                                gap: 2,
                                            }}
                                        >
                                            <Box sx={resultadoSx}>
                                                <NumbersIcon
                                                    sx={iconeSx}
                                                />

                                                <Typography variant="body2">
                                                    <strong>
                                                        Código:
                                                    </strong>{" "}
                                                    {item.produto
                                                        ?.codigoProduto ??
                                                        item.codigoProduto}
                                                </Typography>
                                            </Box>

                                            <Box sx={resultadoSx}>
                                                <Inventory2Icon
                                                    sx={iconeSx}
                                                />

                                                <Typography variant="body2">
                                                    <strong>
                                                        Nome:
                                                    </strong>{" "}
                                                    {item.produto
                                                        ?.nomeProduto ||
                                                        "Não informado"}
                                                </Typography>
                                            </Box>

                                            <Box sx={resultadoSx}>
                                                <CategoryIcon
                                                    sx={iconeSx}
                                                />

                                                <Typography variant="body2">
                                                    <strong>
                                                        Medida:
                                                    </strong>{" "}
                                                    {item.produto
                                                        ?.medidaProduto ||
                                                        "Não informado"}
                                                </Typography>
                                            </Box>

                                            <Box sx={resultadoSx}>
                                                <ProductionQuantityLimitsIcon
                                                    sx={iconeSx}
                                                />

                                                <Typography variant="body2">
                                                    <strong>
                                                        Quantidade:
                                                    </strong>{" "}
                                                    {item.quantidade}
                                                </Typography>
                                            </Box>

                                            <Box sx={resultadoSx}>
                                                <AttachMoneyIcon
                                                    sx={iconeSx}
                                                />

                                                <Typography variant="body2">
                                                    <strong>
                                                        Valor unitário:
                                                    </strong>{" "}
                                                    {item.valorUnitario !=
                                                        null
                                                        ? `R$ ${Number(
                                                            item.valorUnitario
                                                        ).toFixed(2)}`
                                                        : "Não informado"}
                                                </Typography>
                                            </Box>

                                            <Box sx={resultadoSx}>
                                                <ScaleIcon
                                                    sx={iconeSx}
                                                />

                                                <Typography variant="body2">
                                                    <strong>
                                                        Peso:
                                                    </strong>{" "}
                                                    {item.produto
                                                        ?.pesoProduto ??
                                                        "Não informado"}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                )
                            )}
                        </Box>
                    </SectionBox>

                    <SectionBox
                        titulo="Dados da Carga"
                        descricao="Informações relacionadas ao transporte da carga."
                        icone={<LocalShippingIcon />}
                    >
                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "repeat(2, 1fr)",
                                },
                                gap: 2,
                                marginTop: 2,
                            }}
                        >
                            <Box sx={resultadoSx}>
                                <WarehouseIcon sx={iconeSx} />

                                <Typography variant="body2">
                                    <strong>Local de saída:</strong>{" "}
                                    {carga.localSaida ||
                                        "Não informado"}
                                </Typography>
                            </Box>

                            <Box sx={resultadoSx}>
                                <BusinessIcon sx={iconeSx} />

                                <Typography variant="body2">
                                    <strong>Transportadora:</strong>{" "}
                                    {carga.transportadora ||
                                        "Não informado"}
                                </Typography>
                            </Box>

                            <Box sx={resultadoSx}>
                                <ReceiptIcon sx={iconeSx} />

                                <Typography variant="body2">
                                    <strong>Nota fiscal:</strong>{" "}
                                    {carga.notaFiscal ||
                                        "Não informado"}
                                </Typography>
                            </Box>

                            <Box sx={resultadoSx}>
                                <BadgeIcon sx={iconeSx} />

                                <Typography variant="body2">
                                    <strong>Motorista:</strong>{" "}
                                    {ordem.motorista ||
                                        "Não informado"}
                                </Typography>
                            </Box>

                            <Box sx={resultadoSx}>
                                <DirectionsCarIcon sx={iconeSx} />

                                <Typography variant="body2">
                                    <strong>Placa:</strong>{" "}
                                    {ordem.veiculo?.placaVeiculo ||
                                        "Não informado"}
                                </Typography>
                            </Box>

                            <Box sx={resultadoSx}>
                                <DirectionsCarIcon sx={iconeSx} />

                                <Typography variant="body2">
                                    <strong>
                                        Tipo do veículo:
                                    </strong>{" "}
                                    {ordem.veiculo?.tipoVeiculo ||
                                        "Não informado"}
                                </Typography>
                            </Box>

                            <Box sx={resultadoSx}>
                                <SpeedIcon sx={iconeSx} />

                                <Typography variant="body2">
                                    <strong>Capacidade:</strong>{" "}
                                    {ordem.veiculo
                                        ?.capacidadeVeiculo ??
                                        "Não informado"}
                                </Typography>
                            </Box>

                            <Box sx={resultadoSx}>
                                <ScaleIcon sx={iconeSx} />

                                <Typography variant="body2">
                                    <strong>Peso total:</strong>{" "}
                                    {carga.pesoTotal ??
                                        "Não informado"}
                                </Typography>
                            </Box>

                            <Box sx={resultadoSx}>
                                <PercentIcon sx={iconeSx} />

                                <Typography variant="body2">
                                    <strong>
                                        Aproveitamento:
                                    </strong>{" "}
                                    {carga.aproveitamento != null
                                        ? `${carga.aproveitamento}%`
                                        : "Não informado"}
                                </Typography>
                            </Box>

                            <Box sx={resultadoSx}>
                                <InfoIcon sx={iconeSx} />

                                <Typography variant="body2">
                                    <strong>Status:</strong>{" "}
                                    {carga.status ||
                                        "Não informado"}
                                </Typography>
                            </Box>
                        </Box>
                    </SectionBox>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 2,
                            paddingBottom: 2,
                        }}
                    >
                        <Button
                            variant="outlined"
                            color="error"
                            sx={buttonSx}
                            onClick={fechar}
                        >
                            FECHAR
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={<PrintIcon />}
                            sx={buttonSx}
                            onClick={imprimir}
                        >
                            IMPRIMIR
                        </Button>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

export default FormVisualizarCarga;