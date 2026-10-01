import {
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from "@mui/material";

import type { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface SidebarItemProps {
    icon: ReactNode;
    text: string;
    path: string;
}

function SidebarItem({ icon, text, path }: SidebarItemProps) {

    const navigate = useNavigate();
    const location = useLocation();

    const selected = location.pathname === path;

    return (
        <ListItemButton
            selected={selected}
            onClick={() => navigate(path)}
            sx={{
                mx: 1,
                borderRadius: 2,
                borderLeft: "4px solid transparent",

                "&.Mui-selected": {
                    backgroundColor: "primary.light",
                    color: "white",
                    borderLeftColor: "secondary.main",
                },

                "&.Mui-selected:hover": {
                    backgroundColor: "primary.light",
                    borderLeftColor: "secondary.main",
                },

                "&:hover": {
                    backgroundColor: "primary.light",
                    borderLeftColor: "secondary.main",
                },
            }}
        >
            <ListItemIcon
                sx={{
                    color: "inherit",
                    minWidth: 40,
                }}
            >
                {icon}
            </ListItemIcon>

            <ListItemText primary={text} />
        </ListItemButton>
    );
}

export default SidebarItem;