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
const LumpSumCalculator: React.FC = () => {
    const [principal, setPrincipal] = useState(100000);
    const [years, setYears] = useState(10);
    const [rate, setRate] = useState(12);
    const router = useRouter();
    const n = 12;
    const r = rate / 100 / n;
    const amount = principal * Math.pow(1 + r, n * years);
    const totalReturns = amount - principal;

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
            <Box
                sx={{
                    backgroundColor: "#3e648d",
                    color: "#fff",
                    textAlign: "center",
                    py: { xs: 3, md: 4.6 },
                    borderRadius: "8px 8px 0 0",
                    position: "relative",
                }}
            >
                <Typography variant="h4" fontWeight="bold" sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}>
                    Lump Sum Calculator
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
                        borderTop: "12px solid #3e648d",
                    }}
                />
            </Box>

            <Box sx={{ px: 3, flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Box>
                    {/* Principal */}
                    <Box display="flex" justifyContent="space-between" mb={1} mt={4}>
                        <Typography variant="caption">₹1,000</Typography>
                        <Typography variant="body1" color="#3e648d">{formatCurrency(principal)}</Typography>
                        <Typography variant="caption">₹10,00,000</Typography>
                    </Box>
                    <Slider
                        value={principal}
                        onChange={(e, val) => setPrincipal(val as number)}
                        min={1000}
                        max={1000000}
                        step={1000}
                        valueLabelDisplay="auto"
                        sx={{ color: "#3e648d" }}
                    />

                    {/* Years */}
                    <Box display="flex" justifyContent="space-between" mb={1.5}>
                        <Typography variant="caption">1 Yr</Typography>
                        <Typography variant="body1" color="#3e648d">{years} Years</Typography>
                        <Typography variant="caption">40 Yrs</Typography>
                    </Box>
                    <Slider
                        value={years}
                        onChange={(e, val) => setYears(val as number)}
                        min={1}
                        max={40}
                        step={1}
                        valueLabelDisplay="auto"
                        sx={{ color: "#3e648d" }}
                    />

                    {/* Rate */}
                    <Box display="flex" justifyContent="space-between" mb={1.5}>
                        <Typography variant="caption">1%</Typography>
                        <Typography variant="body1" color="#3e648d">{rate}%</Typography>
                        <Typography variant="caption">30%</Typography>
                    </Box>
                    <Slider
                        value={rate}
                        onChange={(e, val) => setRate(val as number)}
                        min={1}
                        max={30}
                        step={0.5}
                        valueLabelDisplay="auto"
                        sx={{ color: "#3e648d" }}
                    />

                    {/* Results */}
                    <Grid container spacing={1}>
                        <Grid item xs={12} display="flex" justifyContent="space-between">
                            <Typography fontWeight="bold" variant="body2" color="text.secondary">Invested Amount</Typography>
                            <Typography variant="body2" color="#3e648d">{formatCurrency(principal)}</Typography>
                        </Grid>
                        <Divider sx={{ my: 1, width: "100%" }} />
                        <Grid item xs={12} display="flex" justifyContent="space-between">
                            <Typography fontWeight="bold" variant="body2" color="text.secondary">Total Returns</Typography>
                            <Typography variant="body2" color="#3e648d">{formatCurrency(totalReturns)}</Typography>
                        </Grid>
                        <Divider sx={{ my: 1, width: "100%" }} />
                        <Grid item xs={12} display="flex" justifyContent="space-between">
                            <Typography fontWeight="bold" variant="body2" color="text.secondary">Total Value</Typography>
                            <Typography variant="body2" color="#3e648d">{formatCurrency(amount)}</Typography>
                        </Grid>
                    </Grid>
                </Box>

                <Button
                    fullWidth
                    sx={{
                        height: 44,
                        mt: 3,
                        mb: 5,
                        backgroundColor: "#3e648d",
                        color: "#fff",
                        fontWeight: "bold",
                        "&:hover": { backgroundColor: "#3e648d" },
                    }}
                    onClick={() => router.push("/authentication/login")}
                >
                    Invest Now
                </Button>
            </Box>
        </Paper>
    );
};

export default LumpSumCalculator;
