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

const LoanCalculator: React.FC = () => {
    // States
    const [loanAmount, setLoanAmount] = useState(100000); // Principal amount
    const [months, setMonths] = useState(12); // Loan duration in months
    const [annualRate, setAnnualRate] = useState(10); // Annual interest rate (%)
    const router = useRouter();

    // Loan EMI calculation formula
    const calculateEMI = (principal: number, months: number, annualRate: number) => {
        const monthlyRate = annualRate / 12 / 100;
        if (monthlyRate === 0) return principal / months; // Handle 0% interest case
        const emi =
            (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
            (Math.pow(1 + monthlyRate, months) - 1);
        return emi;
    };

    const emi = calculateEMI(loanAmount, months, annualRate);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - loanAmount;

    const formatCurrency = (val: number) =>
        `₹${val.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

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
                    backgroundColor: "#1976d2",
                    color: "#fff",
                    textAlign: "center",
                    py: { xs: 3, md: 4.6 },
                    borderRadius: "8px 8px 0 0",
                    position: "relative",
                }}
            >
                <Typography
                    variant="h4"
                    fontWeight="bold"
                    sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
                >
                    Loan Calculator
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
                        borderTop: "12px solid #1976d2",
                    }}
                />
            </Box>

            {/* Body */}
            <Box
                sx={{
                    px: 3,
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <Box>
                    {/* Loan Amount */}
                    <Box display="flex" justifyContent="space-between" mb={1} mt={4}>
                        <Typography variant="caption">₹10,000</Typography>
                        <Typography variant="body1" color="primary">
                            {formatCurrency(loanAmount)}
                        </Typography>
                        <Typography variant="caption">₹1,00,00,000</Typography>
                    </Box>
                    <Slider
                        value={loanAmount}
                        onChange={(e, val) => setLoanAmount(val as number)}
                        min={10000}
                        max={10000000}
                        step={10000}
                        valueLabelDisplay="auto"
                    />

                    {/* Duration (Months) */}
                    <Box display="flex" justifyContent="space-between" mb={1.5}>
                        <Typography variant="caption">1 Month</Typography>
                        <Typography variant="body1" color="primary">
                            {months} Months
                        </Typography>
                        <Typography variant="caption">360 Months</Typography>
                    </Box>
                    <Slider
                        value={months}
                        onChange={(e, val) => setMonths(val as number)}
                        min={1}
                        max={360}
                        step={1}
                        valueLabelDisplay="auto"
                    />

                    {/* Interest Rate */}
                    <Box display="flex" justifyContent="space-between" mb={1.5}>
                        <Typography variant="caption">1%</Typography>
                        <Typography variant="body1" color="primary">
                            {annualRate}%
                        </Typography>
                        <Typography variant="caption">25%</Typography>
                    </Box>
                    <Slider
                        value={annualRate}
                        onChange={(e, val) => setAnnualRate(val as number)}
                        min={1}
                        max={25}
                        step={0.1}
                        valueLabelDisplay="auto"
                    />

                    {/* Results */}
                    <Grid container spacing={1}>
                        <Grid
                            item
                            xs={12}
                            display="flex"
                            justifyContent="space-between"
                        >
                            <Typography
                                fontWeight="bold"
                                variant="body2"
                                color="text.secondary"
                            >
                                Monthly EMI
                            </Typography>
                            <Typography variant="body2" color="primary">
                                {formatCurrency(emi)}
                            </Typography>
                        </Grid>
                        <Divider sx={{ my: 1, width: "100%" }} />

                        <Grid
                            item
                            xs={12}
                            display="flex"
                            justifyContent="space-between"
                        >
                            <Typography
                                fontWeight="bold"
                                variant="body2"
                                color="text.secondary"
                            >
                                Total Interest
                            </Typography>
                            <Typography variant="body2" color="primary">
                                {formatCurrency(totalInterest)}
                            </Typography>
                        </Grid>
                        <Divider sx={{ my: 1, width: "100%" }} />

                        <Grid
                            item
                            xs={12}
                            display="flex"
                            justifyContent="space-between"
                        >
                            <Typography
                                fontWeight="bold"
                                variant="body2"
                                color="text.secondary"
                            >
                                Total Payment
                            </Typography>
                            <Typography variant="body2" color="primary">
                                {formatCurrency(totalPayment)}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Button
                    fullWidth
                    sx={{
                        height: 44,
                        mt: 3,
                        mb: 5,
                        backgroundColor: "#1976d2",
                        color: "#fff",
                        fontWeight: "bold",
                        "&:hover": { backgroundColor: "#1976d2" },
                    }}
                    onClick={() => router.push("/authentication/login")}
                >
                    Apply for Loan
                </Button>
            </Box>
        </Paper>
    );
};

export default LoanCalculator;
