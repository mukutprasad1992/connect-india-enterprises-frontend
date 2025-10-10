"use client";
import React, { useState } from "react";
import {
    Box,
    Typography,
    Button,
    IconButton,
    Fade,
    Grid,
} from "@mui/material";
import { motion } from "framer-motion";
import EastOutlinedIcon from "@mui/icons-material/EastOutlined";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import FeatureCard from "./FeatureCard";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LoanCalculator from "./LoanCalculator";

const slides = [
    {
        image: "images/landingPage/main-slider1.jpg",
        title: "Connecting Your Loan Needs",
        subtitle: "Simple & Secure Payment Process",
        buttonText: "Apply for Loan",
    },
    {
        image: "images/landingPage/main-slider2.jpg",
        title: "Connecting Your Loan Needs",
        subtitle: "Simple & Secure Payment Process",
        buttonText: "Apply for Loan",
    },
];

const HeroSection: React.FC = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const handleNext = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const handlePrev = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const slide = slides[currentSlide];

    const features = [
        {
            icon: <PaymentIcon sx={{ fontSize: 56, color: "#0d6efd" }} />,
            title: "Quick Payment",
            subtitle: "Process",
        },
        {
            icon: <ReceiptLongIcon sx={{ fontSize: 56, color: "#0d6efd" }} />,
            title: "No Prepayment",
            subtitle: "Fees",
        },
    ];

    return (
        <>
            {/* ===== HERO SECTION (TOP BANNER) ===== */}
            <Box
                sx={{
                    position: "relative",
                    height: { xs: 500, md: 600 },
                    width: "100%",
                    overflow: "hidden",
                }}
            >
                {/* Animated Background */}
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
                    }}
                />

                {/* Overlay */}
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        backgroundColor: "rgba(0,0,0,0.3)",
                    }}
                />

                {/* Navigation Arrows */}
                <IconButton
                    onClick={handlePrev}
                    sx={{
                        position: "absolute",
                        top: "45%",
                        right: 30,
                        transform: "translateY(-50%)",
                        color: "#fff",
                        border: "2px solid #fff",
                        borderRadius: "50%",
                        width: 50,
                        height: 50,
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                        zIndex: 3,
                    }}
                >
                    <KeyboardBackspaceOutlinedIcon sx={{ fontSize: 20 }} />
                </IconButton>

                <IconButton
                    onClick={handleNext}
                    sx={{
                        position: "absolute",
                        top: "55%",
                        right: 30,
                        transform: "translateY(-50%)",
                        color: "#fff",
                        border: "2px solid #fff",
                        borderRadius: "50%",
                        width: 50,
                        height: 50,
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                        zIndex: 3,
                    }}
                >
                    <EastOutlinedIcon sx={{ fontSize: 20 }} />
                </IconButton>

                {/* Slide Text */}
                <Fade in timeout={800}>
                    <Box
                        sx={{
                            position: "relative",
                            zIndex: 2,
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            px: { xs: 3, sm: 6, md: 10 },
                            textAlign: "left",
                        }}
                    >
                        <Box sx={{ maxWidth: "600px", color: "#fff" }}>
                            <Typography
                                variant="subtitle1"
                                sx={{ mb: 2, color: "#d3d3d3", fontSize: "1rem" }}
                            >
                                {slide.subtitle}
                            </Typography>

                            <Typography
                                variant="h3"
                                sx={{
                                    mb: 3,
                                    fontWeight: "bold",
                                    lineHeight: 1.2,
                                    fontSize: { xs: "2rem", md: "3rem" },
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
                                    px: 3,
                                    py: 1.2,
                                    borderRadius: "8px",
                                    "&:hover": { backgroundColor: "#1565c0" },
                                }}
                            >
                                {slide.buttonText}
                            </Button>
                        </Box>
                    </Box>
                </Fade>
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        left: { xs: 20, sm: 40, md: 80 },
                        zIndex: 4,
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 2,
                    }}
                >
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            subtitle={feature.subtitle}
                        />
                    ))}
                </Box>
                <Box
                    sx={{
                        position: "absolute",
                        bottom: -635,
                        left: { xs: "50%", md: "50%" },
                        zIndex: 10,
                        px: 4,
                        py: 2,
                    }}
                >
                    <LoanCalculator />
                </Box>
            </Box>
            <Grid>
                Hello
            </Grid>
        </>
    );
};

export default HeroSection;
