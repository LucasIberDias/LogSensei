import {
    Box,
    List,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AddBoxIcon from "@mui/icons-material/AddBox";
import MenuBookIcon from "@mui/icons-material/MenuBook";

import SidebarItem from "./SidebarItem";
import { temPermissao } from "../../services/permissionService";

function Sidebar() {
    const podeAcessarPadrao = temPermissao("GERENTE LOGISTICA") || temPermissao("DESENVOLVEDOR") || temPermissao("ANALISTA");
    const podeAcessarFilial = temPermissao("FILIAL");

    return (
        <Box
            sx={{
                width: 240,
                height: "100vh",
                position: "fixed",
                left: 0,
                top: 64,
                backgroundColor: "primary.main",
                color: "white",
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
            </List>
        </Box>
    );
}

export default Sidebar;