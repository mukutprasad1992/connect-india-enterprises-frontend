"use client";
import { FC, ReactNode } from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";

interface HorizontalCardProps {
    icon: ReactNode;
    title: string;
    description: string;
}

const InfoCard: FC<HorizontalCardProps> = ({ icon, title, description }) => {
    return (
        <Grid
            sx={{
                maxWidth: { xs: 800, md: 330 },
                display: "flex",
                alignItems: "center",
                pt: 3,
                pl: { xs: 2, md: 0 },
            }}
        >
            {/* Left Icon */}
            < Box sx={{ mr: 1.5, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {icon}
            </Box >

            {/* Right Content */}
            < CardContent sx={{ p: 0, flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ wordWrap: "break-word" }}>
                    {description}
                </Typography>
            </CardContent >
        </Grid >
    );
};

export default InfoCard;
