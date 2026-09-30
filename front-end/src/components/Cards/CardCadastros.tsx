import type { ReactNode } from "react";
import { Paper, Typography } from "@mui/material";
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
        >
            {image ? (
                <img
                    src={image}
                    alt={title}
                    className="card-cadastro-image"
                />
            ) : (
                <div className="card-cadastro-icon">
                    {icon}
                </div>
            )}

            <Typography variant="h6" className="card-cadastro-title">
                {title}
            </Typography>

            <Typography
                color="text.secondary"
                className="card-cadastro-description"
            >
                {description}
            </Typography>
        </Paper>
    );
}