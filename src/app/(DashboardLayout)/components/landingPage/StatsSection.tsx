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

// Ease out function
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

const StatsSection: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [counts, setCounts] = useState<number[]>(statsData.map(() => 0));
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    animateCounts();
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const animateCounts = () => {
        const duration = 1000; // total duration in ms (faster)
        const startTime = performance.now();

        const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOut(progress);

            const newCounts = statsData.map((stat) =>
                Math.floor(stat.value * easedProgress)
            );
            setCounts(newCounts);

            if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    };

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
