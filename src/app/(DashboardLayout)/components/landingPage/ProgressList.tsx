"use client";
import React, { useEffect, useState } from "react";
import { Box, Grid, LinearProgress, Typography } from "@mui/material";
import { styled } from "@mui/system";

// Custom styled progress bar
const CustomLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 4,
    borderRadius: 5,
    backgroundColor: "#e0e0e0",
    "& .MuiLinearProgress-bar": {
        borderRadius: 5,
        backgroundColor: "#0288d1", // blue color
        transition: "width 1s ease-in-out", // smooth animation
    },
}));

const ProgressList = () => {
    const data = [
        { label: "Loan Process", value: 90 },
        { label: "Consultancy", value: 80 },
        { label: "Payment Benefits", value: 85 },
    ];

    const [progress, setProgress] = useState(data.map(() => 0));

    useEffect(() => {
        const timers = data.map((item, index) =>
            setTimeout(() => {
                setProgress((prev) => {
                    const updated = [...prev];
                    updated[index] = item.value;
                    return updated;
                });
            }, index * 400) // delay each bar animation slightly
        );

        return () => timers.forEach((t) => clearTimeout(t));
    }, []);

    return (
        <Box sx={{ width: "100%", mt: 5, ml: 4 }}>
            <Grid container spacing={3}>
                {data.map((item, index) => (
                    <Grid item xs={12} key={index}>
                        <Grid container alignItems="center" justifyContent="space-between">
                            {/* Left Label */}
                            <Grid item>
                                <Typography
                                    variant="subtitle1"
                                    sx={{ fontWeight: 600, color: "#000" }}
                                >
                                    {item.label}
                                </Typography>
                            </Grid>

                            {/* Right Percentage */}
                            <Grid item>
                                <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                                    {progress[index]}%
                                </Typography>
                            </Grid>
                        </Grid>

                        {/* Progress Bar */}
                        <Box sx={{ mt: 1 }}>
                            <CustomLinearProgress
                                variant="determinate"
                                value={progress[index]}
                            />
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ProgressList;
