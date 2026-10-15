import {
    Box,
    List,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AddBoxIcon from "@mui/icons-material/AddBox";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

import SidebarItem from "./SidebarItem";
import { temPermissao } from "../../services/permissionService";

function Sidebar() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const alturaMobile = "76px";

    const podeAcessarPadrao =
        temPermissao("GERENTE LOGISTICA") ||
        temPermissao("DESENVOLVEDOR") ||
        temPermissao("ANALISTA");

    const podeAcessarFilial = temPermissao("FILIAL");

    return (
        <Box
            sx={{
                width: isMobile ? "100%" : 240,
                height: isMobile
                    ? `calc(${alturaMobile} + env(safe-area-inset-bottom, 0px))`
                    : "calc(100dvh - 64px)",

                position: "fixed",
                left: 0,
                top: isMobile ? "auto" : 64,
                bottom: isMobile ? 0 : "auto",

                backgroundColor: "primary.main",
                color: "white",
                zIndex: theme.zIndex.appBar - 1,

                overflow: "hidden",
                boxSizing: "border-box",

                paddingBottom: isMobile
                    ? "env(safe-area-inset-bottom, 0px)"
                    : 0,

                "& .MuiList-root": {
                    display: isMobile ? "flex" : "block",
                    flexDirection: isMobile ? "row" : "column",
                    alignItems: isMobile ? "center" : "stretch",

                    height: "100%",
                    padding: isMobile ? "4px 8px 0" : "8px 0",
                    margin: 0,

                    overflowX: isMobile ? "auto" : "visible",
                    overflowY: "hidden",
                    scrollbarWidth: "none",

                    "&::-webkit-scrollbar": {
                        display: "none",
                    },
                },

                "& .MuiListItemButton-root": {
                    minHeight: isMobile ? 64 : 48,

                    ...(isMobile && {
                        flex: "1 0 76px",
                        minWidth: 76,
                        maxWidth: 110,
                        padding: "6px 4px",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: "3px",
                    }),
                },

                "& .MuiListItemIcon-root": {
                    color: "inherit",

                    ...(isMobile && {
                        minWidth: 0,
                        margin: 0,
                        justifyContent: "center",
                    }),
                },

                ...(isMobile && {
                    "& .MuiListItemText-root": {
                        margin: 0,
                        textAlign: "center",
                    },

                    "& .MuiListItemText-primary": {
                        fontSize: "0.68rem",
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                    },
                }),
            }}
        >
            <List>
                <SidebarItem
                    icon={<DashboardIcon />}
                    text="Dashboard"
                    path="/"
                />

                {podeAcessarPadrao && (
                    <SidebarItem
                        icon={<AssignmentIcon />}
                        text="Ordem"
                        path="/ordem"
                    />
                )}

                {podeAcessarPadrao && (
                    <SidebarItem
                        icon={<LocalShippingIcon />}
                        text="Cargas"
                        path="/cargas"
                    />
                )}

                {podeAcessarPadrao && (
                    <SidebarItem
                        icon={<AddBoxIcon />}
                        text="Cadastros"
                        path="/cadastros"
                    />
                )}

                {podeAcessarFilial && (
                    <SidebarItem
                        icon={<MenuBookIcon />}
                        text="Diário"
                        path="/diario"
                    />
                )}

                {podeAcessarFilial && (
                    <SidebarItem
                        icon={<SwapHorizIcon />}
                        text="Transferência"
                        path="/transferencia"
                    />
                )}
            </List>
        </Box>
    );
}

export default Sidebar;