"use client";
import React, { useEffect, useState, useRef } from "react";
import { Box, Fade, IconButton } from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LoanCalculator from "./LoanCalculator";
import SIPCalculator from "./SIPCalculator";
import LumpSumCalculator from "./LumpSumCalculator";

const AutoRotateCalculators: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [paused, setPaused] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const calculators = [
        <LoanCalculator key="loan" />,
        <SIPCalculator key="sip" />,
        <LumpSumCalculator key="lump" />
    ];

    // Auto-rotation effect
    useEffect(() => {
        if (!paused) {
            timerRef.current = setInterval(() => {
                setActiveIndex((prev) => (prev + 1) % calculators.length);
            }, 5000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [paused]);

    // Manual button click
    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % calculators.length);
        setPaused(true); // pause auto-rotation temporarily when user clicks
        setTimeout(() => setPaused(false), 5000); // resume auto after 5s
    };

    return (
        <Box
            sx={{
                position: { xs: "relative", md: "absolute" },
                right: { xs: 'auto', sm: 20, md: 140 },
                zIndex: 8,
                top: { xs: 'auto', md: 500 },
                pointerEvents: "auto",
                mb: { xs: 4, md: 0 },
                width: { xs: "100%", md: 460 },
            }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {/* Floating Next Button */}
            <IconButton
                onClick={handleNext}
                sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    bgcolor: "background.paper",
                    "&:hover": { bgcolor: "grey.300" },
                    zIndex: 10
                }}
            >
                <ArrowForwardIosIcon />
            </IconButton>

            {calculators.map((calc, index) => (
                <Fade
                    key={index}
                    in={index === activeIndex}
                    timeout={0}
                    mountOnEnter
                    unmountOnExit
                >
                    <Box>{calc}</Box>
                </Fade>
            ))}
        </Box>
    );
};

export default AutoRotateCalculators;
