"use client";
import React, { useState } from "react";
import {
    Box,
    Typography,
    Slider,
    Paper,
    Divider,
    Grid,
    Button,
} from "@mui/material";
import { useRouter } from "next/navigation";

const SIPCalculator: React.FC = () => {
    const [monthlyInvestment, setMonthlyInvestment] = useState(5000);
    const [years, setYears] = useState(10);
    const [annualRate, setAnnualRate] = useState(12);
    const router = useRouter();
    const n = 12;
    const r = annualRate / 100 / n;
    const totalMonths = years * n;

    const maturityValue =
        monthlyInvestment * ((Math.pow(1 + r, totalMonths) - 1) / r) * (1 + r);
    const investedAmount = monthlyInvestment * totalMonths;
    const estimatedReturns = maturityValue - investedAmount;

    const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

    return (
        <Paper
            elevation={6}
            sx={{
                borderRadius: 2,
                width: { xs: "100%", sm: 400, md: 455 },
                height: { xs: "auto", sm: "auto", md: 600 },
                mx: "auto",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    backgroundColor: "#04b488",
                    color: "#fff",
                    textAlign: "center",
                    py: { xs: 3, md: 4.6 },
                    borderRadius: "8px 8px 0 0",
                    position: "relative",
                }}
            >
                <Typography variant="h4" fontWeight="bold" sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}>
                    SIP Calculator
                </Typography>

                {/* Arrow at bottom */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: -10,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 0,
                        height: 0,
                        borderLeft: "25px solid transparent",
                        borderRight: "25px solid transparent",
                        borderTop: "12px solid #04b488",
                    }}
                />
            </Box>

            {/* Body */}
            <Box sx={{ px: 3, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Box>
                    {/* Monthly Investment */}
                    <Box display="flex" justifyContent="space-between" mb={1} mt={4}>
                        <Typography variant="caption">₹500</Typography>
                        <Typography variant="body1" color="#04b488">{formatCurrency(monthlyInvestment)}</Typography>
                        <Typography variant="caption">₹1,00,000</Typography>
                    </Box>
                    <Slider
                        value={monthlyInvestment}
                        onChange={(e, val) => setMonthlyInvestment(val as number)}
                        min={500}
                        max={100000}
                        step={500}
                        valueLabelDisplay="auto"
                        sx={{ color: "#04b488" }}
                    />

                    {/* Years */}
                    <Box display="flex" justifyContent="space-between" mb={1.5}>
                        <Typography variant="caption">1 Yr</Typography>
                        <Typography variant="body1" color="#04b488">{years} Years</Typography>
                        <Typography variant="caption">40 Yrs</Typography>
                    </Box>
                    <Slider
                        value={years}
                        onChange={(e, val) => setYears(val as number)}
                        min={1}
                        max={40}
                        step={1}
                        valueLabelDisplay="auto"
                        sx={{ color: "#04b488" }}
                    />

                    {/* Rate */}
                    <Box display="flex" justifyContent="space-between" mb={1.5}>
                        <Typography variant="caption">1%</Typography>
                        <Typography variant="body1" color="#04b488">{annualRate}%</Typography>
                        <Typography variant="caption">30%</Typography>
                    </Box>
                    <Slider
                        value={annualRate}
                        onChange={(e, val) => setAnnualRate(val as number)}
                        min={1}
                        max={30}
                        step={0.5}
                        valueLabelDisplay="auto"
                        sx={{ color: "#04b488" }}
                    />

                    {/* Results */}
                    <Grid container spacing={1}>
                        <Grid item xs={12} display="flex" justifyContent="space-between">
                            <Typography fontWeight="bold" variant="body2" color="text.secondary">Invested Amount</Typography>
                            <Typography variant="body2" color="#04b488">{formatCurrency(investedAmount)}</Typography>
                        </Grid>
                        <Divider sx={{ my: 1, width: "100%" }} />
                        <Grid item xs={12} display="flex" justifyContent="space-between">
                            <Typography fontWeight="bold" variant="body2" color="text.secondary">Estimated Returns</Typography>
                            <Typography variant="body2" color="#04b488">{formatCurrency(estimatedReturns)}</Typography>
                        </Grid>
                        <Divider sx={{ my: 1, width: "100%" }} />
                        <Grid item xs={12} display="flex" justifyContent="space-between">
                            <Typography fontWeight="bold" variant="body2" color="text.secondary">Total Value</Typography>
                            <Typography variant="body2" color="#04b488">{formatCurrency(maturityValue)}</Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Button
                    fullWidth
                    sx={{
                        height: 44,
                        mt: 3,
                        mb: 5,
                        backgroundColor: "#04b488",
                        color: "#fff",
                        fontWeight: "bold",
                        "&:hover": { backgroundColor: "#04b488" },
                    }}
                    onClick={() => router.push("/authentication/login")}
                >
                    Start SIP
                </Button>
            </Box>
        </Paper >
    );
};

export default SIPCalculator;
