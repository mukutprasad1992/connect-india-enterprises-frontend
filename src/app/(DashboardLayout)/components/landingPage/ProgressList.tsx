"use client";
import React from "react";
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
    },
}));

const ProgressList = () => {
    const data = [
        { label: "Loan Process", value: 90 },
        { label: "Consultancy", value: 80 },
        { label: "Payment Benefits", value: 85 },
    ];

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
                                    {item.value}%
                                </Typography>
                            </Grid>
                        </Grid>

                        {/* Progress Bar */}
                        <Box sx={{ mt: 1 }}>
                            <CustomLinearProgress variant="determinate" value={item.value} />
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ProgressList;
