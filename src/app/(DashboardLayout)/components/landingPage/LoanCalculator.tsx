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

const LoanCalculator: React.FC = () => {
    const [amount, setAmount] = useState(1000);
    const [months, setMonths] = useState(6);
    const [interestRate, setInterestRate] = useState(5);

    const totalPayback = Math.round(amount * (1 + interestRate / 100));
    const monthlyPayment = Math.round(totalPayback / months);

    const formatCurrency = (val: number) => `₹${val.toLocaleString("en-IN")}`;

    return (
        <Paper
            elevation={6}
            sx={{
                borderRadius: 2,
                maxWidth: 455,
                minWidth: 455,
                width: "100%",
                height: 600,
                mx: "auto",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                transition: "all 0.3s ease",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    textAlign: "center",
                    py: 5.3,
                    borderRadius: "8px 8px 0 0",
                    position: "relative",
                    flexShrink: 0,
                }}
            >
                <Typography variant="h2" fontWeight="bold">
                    How Much You Need
                </Typography>
                <Box
                    sx={{
                        content: '""',
                        position: "absolute",
                        bottom: -8,
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: 0,
                        height: 0,
                        borderLeft: "20px solid transparent",
                        borderRight: "20px solid transparent",
                        borderTop: "8px solid #1976d2",
                    }}
                />
            </Box>

            {/* Body */}
            <Box
                sx={{
                    pl: 2,
                    pr: 2,
                    background: "#fff",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <Box>
                    {/* Loan Amount */}
                    <Box display="flex" justifyContent="space-between" mb={1} sx={{ mt: 4 }}>
                        <Typography variant="caption">{formatCurrency(1000)}</Typography>
                        <Typography
                            variant="body1"
                            color="primary"
                            sx={{
                                fontVariantNumeric: "tabular-nums",
                                minWidth: 160,
                                textAlign: "center",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {formatCurrency(amount)}
                        </Typography>
                        <Typography variant="caption">{formatCurrency(4000000)}</Typography>
                    </Box>
                    <Slider
                        value={amount}
                        onChange={(e, val) => setAmount(val as number)}
                        min={1000}
                        max={4000000}
                        step={500}
                        valueLabelDisplay="auto"
                        sx={{ mb: 1 }}
                    />

                    {/* Loan Term */}
                    <Box display="flex" justifyContent="space-between" mb={1.5}>
                        <Typography variant="caption">1 Month</Typography>
                        <Typography
                            variant="body1"
                            color="primary"
                            sx={{
                                fontVariantNumeric: "tabular-nums",
                                minWidth: 90,
                                textAlign: "center",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {months} {months === 1 ? "Month" : "Months"}
                        </Typography>
                        <Typography variant="caption">60 Months</Typography>
                    </Box>
                    <Slider
                        value={months}
                        onChange={(e, val) => setMonths(val as number)}
                        min={1}
                        max={60}
                        step={1}
                        valueLabelDisplay="auto"
                        sx={{ mb: 1.5 }}
                    />

                    {/* Interest Rate */}
                    <Box display="flex" justifyContent="space-between" mb={1.5}>
                        <Typography variant="caption">1%</Typography>
                        <Typography
                            variant="body1"
                            color="primary"
                            sx={{
                                fontVariantNumeric: "tabular-nums",
                                minWidth: 90,
                                textAlign: "center",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {interestRate.toFixed(1)}%
                        </Typography>
                        <Typography variant="caption">25%</Typography>
                    </Box>
                    <Slider
                        value={interestRate}
                        onChange={(e, val) => setInterestRate(val as number)}
                        min={1}
                        max={25}
                        step={0.5}
                        valueLabelDisplay="auto"
                        sx={{ mb: .5 }}
                    />

                    {/* Results */}
                    <Grid container spacing={1}>
                        <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography fontWeight="bold" variant="body2" color="text.secondary">
                                Pay Monthly
                            </Typography>
                            <Typography
                                variant="body2"
                                color="primary"
                                sx={{ fontVariantNumeric: "tabular-nums" }}
                            >
                                {formatCurrency(monthlyPayment)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider sx={{ my: 1 }} />
                        </Grid>
                        <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography fontWeight="bold" variant="body2" color="text.secondary">
                                Total Payback
                            </Typography>
                            <Typography
                                variant="body2"
                                color="primary"
                                sx={{ fontVariantNumeric: "tabular-nums" }}
                            >
                                {formatCurrency(totalPayback)}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider sx={{ my: 1 }} />
                        </Grid>
                        <Grid item xs={12} sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography fontWeight="bold" variant="body2" color="text.secondary">
                                Term of Use
                            </Typography>
                            <Typography variant="body2" color="primary">
                                {months} {months === 1 ? "Month" : "Months"}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Divider sx={{ my: 1 }} />

                {/* Apply Button */}
                <Button
                    fullWidth
                    sx={{
                        height: 44,
                        mt: 2,
                        mb: 5,
                        backgroundColor: "#1976d2",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: 13,
                        borderRadius: 1.5,
                        "&:hover": { backgroundColor: "#1565c0" },
                    }}
                >
                    Apply For Loan
                </Button>
            </Box>
        </Paper>
    );
};

export default LoanCalculator;
