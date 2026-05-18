"use client";
import React from "react";
import {
    Box,
    Typography,
    Button,
    IconButton,
    Fade,
    useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import FeatureCard from "./FeatureCard"; // Your responsive FeatureCard component

interface SlideProps {
    image: string;
    title: string;
    subtitle: string;
    buttonText: string;
}

interface HeroSectionProps {
    slide: SlideProps;
    handleApplyLoan: () => void;
    handlePrev: () => void;
    handleNext: () => void;
    features: {
        icon: React.ReactNode;
        title: string;
        subtitle: string;
    }[];
}

const HeroSection: React.FC<HeroSectionProps> = ({
    slide,
    handleApplyLoan,
    handlePrev,
    handleNext,
    features,
}) => {
    const theme = useTheme();

    return (
        <Box sx={{ position: "relative", width: "100%", pb: { xs: 10, md: 14 } }}>
            {/* HERO SECTION */}
            <Box
                sx={{
                    position: "relative",
                    height: { xs: 480, sm: 520, md: 600, lg: 650 },
                    width: "100%",
                    overflow: "hidden",
                }}
            >
                {/* Background Image */}
                <motion.div
                    key={slide.image}
                    initial={{ scale: 1 }}
                    animate={{ scale: 1.15 }}
                    transition={{ duration: 5, ease: "easeInOut" }}
                    style={{
                        backgroundImage: `url(${slide.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        zIndex: 1,
                    }}
                >
                    {/* Gradient Overlay */}
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background:
                                "linear-gradient(to right, rgba(0,0,0,0.7) 35%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)",
                            zIndex: 2,
                        }}
                    />
                </motion.div>

                {/* Slide Content */}
                <Fade in timeout={600}>
                    <Box
                        sx={{
                            position: "relative",
                            zIndex: 3,
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            alignItems: { xs: "flex-start", md: "center" },
                            justifyContent: { xs: "flex-start", md: "flex-start" },
                            height: { xs: "auto", md: "100%" },
                            px: { xs: 2, sm: 4, md: 8, lg: 12 },
                            pt: { xs: 6, sm: 0 },
                            textAlign: { xs: "center", md: "left" },
                        }}
                    >
                        <Box
                            sx={{
                                maxWidth: { xs: "100%", sm: "85%", md: "600px" },
                                color: "#fff",
                                mx: { xs: "auto", md: 0 },
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{
                                    mb: 2,
                                    color: "#d3d3d3",
                                    fontSize: { xs: "0.9rem", sm: "1rem" },
                                }}
                            >
                                {slide.subtitle}
                            </Typography>

                            <Typography
                                variant="h3"
                                sx={{
                                    mb: 3,
                                    fontWeight: "bold",
                                    lineHeight: 1.2,
                                    fontSize: {
                                        xs: "1.8rem",
                                        sm: "2.4rem",
                                        md: "3rem",
                                        lg: "3.5rem",
                                    },
                                }}
                            >
                                {slide.title}
                            </Typography>

                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#1976d2",
                                    textTransform: "none",
                                    fontWeight: "bold",
                                    px: { xs: 2.5, sm: 3 },
                                    py: { xs: 1, sm: 1.2 },
                                    borderRadius: "8px",
                                    fontSize: { xs: "0.8rem", sm: "0.9rem", md: "1rem" },
                                    "&:hover": { backgroundColor: "#1565c0" },
                                }}
                                onClick={handleApplyLoan}
                            >
                                {slide.buttonText}
                            </Button>
                        </Box>
                    </Box>
                </Fade>

                {/* Navigation Arrows */}
                <IconButton
                    onClick={handlePrev}
                    sx={{
                        position: "absolute",
                        top: "42%",
                        right: { xs: 10, sm: 30, md: 50 },
                        transform: "translateY(-50%)",
                        color: "#fff",
                        border: "2px solid #fff",
                        borderRadius: "50%",
                        width: { xs: 36, sm: 50, md: 60 },
                        height: { xs: 36, sm: 50, md: 60 },
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                        zIndex: 4,
                    }}
                >
                    <KeyboardBackspaceOutlinedIcon
                        sx={{ fontSize: { xs: 16, sm: 20 } }}
                    />
                </IconButton>

                <IconButton
                    onClick={handleNext}
                    sx={{
                        position: "absolute",
                        top: "58%",
                        right: { xs: 10, sm: 30, md: 50 },
                        transform: "translateY(-50%)",
                        color: "#fff",
                        border: "2px solid #fff",
                        borderRadius: "50%",
                        width: { xs: 36, sm: 50, md: 60 },
                        height: { xs: 36, sm: 50, md: 60 },
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                        zIndex: 4,
                    }}
                >
                    <EastOutlinedIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
                </IconButton>
            </Box>

            {/* ✅ Floating Feature Cards Section */}
            <Box
                sx={{
                    position: "absolute",
                    bottom: { xs: -80, sm: -90, md: -100 },
                    left: 0,
                    width: "100%",
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: "center",
                    justifyContent: "center",
                    flexWrap: "wrap",
                    gap: { xs: 2, sm: 3 },
                    px: { xs: 2, sm: 4, md: 8 },
                    zIndex: 5,
                }}
            >
                {features.map((feature) => (
                    <FeatureCard
                        key={feature.title}
                        icon={feature.icon}
                        title={feature.title}
                        subtitle={feature.subtitle}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default HeroSection;
