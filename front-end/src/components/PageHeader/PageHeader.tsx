import { Typography } from "@mui/material";
import "./PageHeader.css";

interface PageHeaderProps {
    title: string;
    description: string;
    image?: string;
}

export default function PageHeader({
    title,
    description,
    image,
}: PageHeaderProps) {
    return (
        <div className="page-header">
            <div className="page-header-content">
                <Typography
                    variant="h4"
                    className="page-header-title"
                >
                    {title}
                </Typography>

                <Typography
                    className="page-header-description"
                >
                    {description}
                </Typography>
            </div>

            {image && (
                <img
                    src={image}
                    alt=""
                    className="page-header-image"
                />
            )}
        </div>
    );
}