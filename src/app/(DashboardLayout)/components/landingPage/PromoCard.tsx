"use client";
import { FC, ReactNode } from "react";
import { CardContent, Typography, Box, Grid } from "@mui/material";

interface PromoCardProps {
    icon: ReactNode;
    description: string;
}

const PromoCard: FC<PromoCardProps> = ({ icon, description }) => {
    return (
        <Grid
            sx={{
                maxWidth: 380,
                height: 140,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                p: 3,
                borderBottom: "3px solid transparent",
                transition: "all 0.3s ease",
                borderRadius: 2,
                cursor: "pointer",
                ":hover": {
                    borderBottom: "3px solid #1976d2", // blue underline on hover
                    boxShadow: "0px 3px 10px rgba(0,0,0,0.1)",
                },
            }}
        >
            {/* Left Icon */}
            <Box
                sx={{
                    mr: 2,
                    fontSize: 32,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#1976d2",
                }}
            >
                {icon}
            </Box>
            {/* Right Content */}
            <CardContent
                sx={{
                    p: 0,
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                }}
            >
                <Typography
                    variant="body1"
                    color="text.primary"
                    sx={{
                        fontWeight: 500,
                        wordWrap: "break-word",
                    }}
                >
                    {description}
                </Typography>
            </CardContent>
        </Grid>
    );
};

export default PromoCard;
