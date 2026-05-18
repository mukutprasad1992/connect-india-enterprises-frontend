"use client";
import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import StepCard from "./StepCard";

const TrustedCompanyCard: React.FC = () => {
    const steps = [
        { number: 1, text: "Apply online easily with a quick form." },
        { number: 2, text: "Get instant approval within minutes." },
        { number: 3, text: "Receive funds directly in your account." },
        { number: 4, text: "Repay easily with flexible EMIs." },
    ];

    return (
        <Box
            sx={{
                width: { xs: "100%", sm: "100%", md: 500, lg: 600 },
                ml: { md: 1 },
                px: { xs: 2, md: 2 },
                pt: { xs: 3, md: 12 },
                pb: { xs: 3, md: 4 },
                // borderRadius: 1,
                borderTopLeftRadius: 4,
                backgroundColor: "#113e97ff",
                textAlign: "start",
            }}
        >

            <Grid
                container
                spacing={3}
                justifyContent="start"
                alignItems="start"
            >
                {steps.map((step) => (
                    <Grid item xs={12} sm={12} md={10} key={step.number} sx={{ display: "flex", justifyContent: "center" }}>
                        <StepCard number={step.number} text={step.text} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default TrustedCompanyCard;
