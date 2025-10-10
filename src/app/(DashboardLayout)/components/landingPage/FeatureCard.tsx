"use client";
import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

/* ------------------- FeatureCard Component ------------------- */
interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, subtitle }) => {
    return (
        <Box
            sx={{
                position: "relative",
                overflow: "hidden",
                p: 4,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 3,
                width: 350,
                height: 120,
                color: "#fff",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                borderTop: "4px solid  rgba(255, 255, 255, 1)",
                mx: "auto",
                transition: "all 0.4s ease",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: "-100%",
                    left: 0,
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(to bottom, #ffffff, #ffffff)",
                    transition: "top 0.5s ease",
                    zIndex: 0,
                },
                "&:hover::before": {
                    top: 0,
                },
                "&:hover": {
                    // transform: "translateY(-8px)",
                    // boxShadow: "0 8px 25px rgba(255,255,255,0.2)",
                },
                "&:hover .text-content": {
                    color: "#000",
                },
                "&:hover .sub-text": {
                    color: "rgba(0,0,0,0.7)",
                },
            }}
        >
            <Box sx={{ position: "relative", zIndex: 1 }}>{icon}</Box>
            <Box sx={{ position: "relative", zIndex: 1 }}>
                <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    className="text-content"
                    sx={{ transition: "color 0.3s ease" }}
                >
                    {title}
                </Typography>
                <Typography
                    variant="body2"
                    className="sub-text"
                    sx={{ color: "rgba(255,255,255,0.8)", transition: "color 0.3s ease" }}
                >
                    {subtitle}
                </Typography>
            </Box>
        </Box>
    );
};

export default FeatureCard;
