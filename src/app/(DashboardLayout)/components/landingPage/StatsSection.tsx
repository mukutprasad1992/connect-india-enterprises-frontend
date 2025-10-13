"use client";
import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, Divider, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface StatItem {
    value: number;
    label: string;
    suffix?: string;
}

const statsData: StatItem[] = [
    { value: 99, label: "We Approve Loans", suffix: "%" },
    { value: 90, label: "Daily Payments", suffix: "K" },
    { value: 8900, label: "Happy Customers" },
    { value: 346, label: "Staff Members" },
];

const StatsSection: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [isVisible, setIsVisible] = useState(false);
    const [counts, setCounts] = useState<number[]>(statsData.map(() => 0));
    const ref = useRef<HTMLDivElement | null>(null);

    // Detect when component is visible on screen
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    // Animate numbers when visible
    useEffect(() => {
        if (isVisible) {
            statsData.forEach((stat, index) => {
                let start = 0;
                const end = stat.value;
                const duration = 2000; // 2 seconds
                const stepTime = Math.abs(Math.floor(duration / end));

                const timer = setInterval(() => {
                    start += 1;
                    setCounts((prev) => {
                        const newCounts = [...prev];
                        newCounts[index] = start;
                        return newCounts;
                    });
                    if (start >= end) clearInterval(timer);
                }, stepTime);
            });
        }
    }, [isVisible]);

    return (
        <Box
            ref={ref}
            sx={{
                width: "100%",
                height: 200,
                background: "linear-gradient(90deg, #0a84d1 0%, #1095e4 100%)",
                color: "#fff",
                py: 6,
                px: 6,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Optional background overlay */}
            <Box
                sx={{
                    position: "absolute",
                    inset: 0,
                    backgroundImage: "url('/images/landingPage/bg-stats.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.08,
                    zIndex: 0,
                }}
            />

            {/* Stats Content */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: isMobile ? "column" : "row",
                    gap: isMobile ? 3 : 6,
                    zIndex: 1,
                    position: "relative",
                }}
            >
                {statsData.map((stat, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            px: 3,
                            position: "relative",
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: "bold",
                                mb: 1,
                                fontSize: isMobile ? "2rem" : "2.5rem",
                            }}
                        >
                            {counts[index].toLocaleString()}
                            {stat.suffix ?? ""}
                        </Typography>
                        <Typography
                            variant="subtitle1"
                            sx={{
                                fontWeight: 500,
                                fontSize: isMobile ? "1rem" : "1.1rem",
                                color: "rgba(255,255,255,0.9)",
                            }}
                        >
                            {stat.label}
                        </Typography>

                        {/* Divider */}
                        {!isMobile && index < statsData.length - 1 && (
                            <Divider
                                orientation="vertical"
                                flexItem
                                sx={{
                                    position: "absolute",
                                    right: -20,
                                    height: "50%",
                                    backgroundColor: "rgba(255,255,255,0.4)",
                                }}
                            />
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default StatsSection;
