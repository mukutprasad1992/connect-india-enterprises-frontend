"use client";
import React from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, subtitle }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

    return (
        <Box
            sx={{
                position: "relative",
                overflow: "hidden",
                p: { xs: 2, sm: 3, md: 2, lg: 4 },
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                cursor: "pointer",
                display: "flex",
                // flexDirection: { xs: "column", sm: "row" },
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: { xs: "center", sm: "flex-start" },
                gap: { xs: 1, sm: 2 },
                width: { xs: "100%", sm: 300, md: 300 },
                height: { xs: 70, sm: 80, md: 100 },
                minHeight: { xs: 70, sm: 80, md: 100 },
                color: "#fff",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                borderTop: "4px solid rgba(255, 255, 255, 1)",
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
                "&:hover .text-content": {
                    color: "#000",
                },
                "&:hover .sub-text": {
                    color: "rgba(0,0,0,0.7)",
                },
            }}
        >
            {/* Icon */}
            <Box
                sx={{
                    position: "relative",
                    zIndex: 1,
                    fontSize: { xs: 32, sm: 36, md: 40 },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {icon}
            </Box>

            {/* Text */}
            <Box sx={{ position: "relative", zIndex: 1 }}>
                <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    className="text-content"
                    sx={{
                        transition: "color 0.3s ease",
                        fontSize: { xs: "0.7rem", sm: "0.9em", lg: "1rem" },
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    variant="body2"
                    className="sub-text"
                    sx={{
                        color: "rgba(255,255,255,0.8)",
                        transition: "color 0.3s ease",
                        fontSize: { xs: "0.6rem", sm: "0.7rem", lg: "0.8rem" },
                    }}
                >
                    {subtitle}
                </Typography>
            </Box>
        </Box>
    );
};

export default FeatureCard;
