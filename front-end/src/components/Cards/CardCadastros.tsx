import type { ReactNode } from "react";

import {
    Box,
    Paper,
    Typography,
} from "@mui/material";

import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import "./CardCadastro.css";

interface CardCadastroProps {
    icon?: ReactNode;
    image?: string;
    title: string;
    description: string;
    onClick?: () => void;
}

export default function CardCadastro({
    icon,
    image,
    title,
    description,
    onClick,
}: CardCadastroProps) {
    return (
        <Paper
            className="card-cadastro"
            onClick={onClick}
            elevation={0}
            sx={{
                backgroundColor: "background.paper",
                border: 1,
                borderColor: "divider",

                "&:hover": {
                    boxShadow: 3,
                },
            }}
        >
            <Box className="card-cadastro-left">

                {image ? (
                    <Box
                        component="img"
                        src={image}
                        alt={title}
                        className="card-cadastro-image"
                    />
                ) : (
                    <Box
                        className="card-cadastro-icon"
                        sx={{
                            backgroundColor: "secondary.light",
                            color: "primary.main",
                        }}
                    >
                        {icon}
                    </Box>
                )}

                <Box className="card-cadastro-content">

                    <Typography
                        variant="h6"
                        className="card-cadastro-title"
                        sx={{
                            color: "text.primary",
                        }}
                    >
                        {title}
                    </Typography>

                    <Typography
                        className="card-cadastro-description"
                        sx={{
                            color: "text.secondary",
                        }}
                    >
                        {description}
                    </Typography>

                </Box>
            </Box>

            <ArrowForwardIosIcon
                className="card-cadastro-arrow"
                sx={{
                    color: "primary.light",
                }}
            />
        </Paper>
    );
}