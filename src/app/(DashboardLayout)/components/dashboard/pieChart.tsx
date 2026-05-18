"use client";

import * as React from "react";
import {
    Box,
    Grid,
    Typography,
    Slider,
    Stack,
    Paper,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

const PieChartPage = () => {
    const [radius, setRadius] = useState(50);
    const [itemNb, setItemNb] = useState(5);
    const [skipAnimation, setSkipAnimation] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);

    const router = useRouter();
    const theme = useTheme();

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
    const isLaptop = useMediaQuery(theme.breakpoints.up("md"))

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const [stats, setStats] = useState<{
        Investment: any;
        Policy: any;
        Insurance: any;
        Loan: any;
    }>({
        Investment: { totalAmount: 0, totalServices: 0 },
        Policy: { totalAmount: 0, totalServices: 0 },
        Insurance: { totalAmount: 0, totalServices: 0 },
        Loan: { totalAmount: 0, totalServices: 0 },
    });

    const [hasError, setHasError] = useState(false);

    const getToken = () =>
        typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    const getRoleId = () =>
        typeof window !== "undefined" ? localStorage.getItem("roleId") : null;

    const token = getToken();
    const roleId = getRoleId();

    const fetchServiceData = async () => {
        if (!token || !roleId) {
            localStorage.clear();
            router.push("/authentication/login");
            return;
        }

        const decoded: any = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
            localStorage.clear();
            router.push("/authentication/login");
            return;
        }

        setLoading(true);
        setHasError(false);

        try {
            const response = await axios.get(
                `${BASE_URL}/serviceType/getTotalAmountAndServiecsByUserIdServiceType`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const data = response.data.data;

            if (response.data.status && data) {
                setStats({
                    Investment: {
                        totalAmount: parseFloat(data?.Investment?.totalAmount) || 0,
                        totalServices: parseInt(data?.Investment?.totalServices) || 0,
                    },
                    Policy: {
                        totalAmount: parseFloat(data?.Policy?.totalAmount) || 0,
                        totalServices: parseInt(data?.Policy?.totalServices) || 0,
                    },
                    Insurance: {
                        totalAmount: parseFloat(data?.Insurance?.totalAmount) || 0,
                        totalServices: parseInt(data?.Insurance?.totalServices) || 0,
                    },
                    Loan: {
                        totalAmount: parseFloat(data?.Loan?.totalAmount) || 0,
                        totalServices: parseInt(data?.Loan?.totalServices) || 0,
                    },
                });
            } else {
                resetStats();
            }
        } catch (error) {
            setHasError(true);
            resetStats();
        } finally {
            setLoading(false);
        }
    };

    const resetStats = () => {
        setStats({
            Investment: { totalAmount: 0, totalServices: 0 },
            Policy: { totalAmount: 0, totalServices: 0 },
            Insurance: { totalAmount: 0, totalServices: 0 },
            Loan: { totalAmount: 0, totalServices: 0 },
        });
    };

    useEffect(() => {
        fetchServiceData();
    }, []);

    const colorMap: Record<string, string> = {
        Investment: "#a4d4f5",
        Policy: "#b4fab8",
        Insurance: "#efabf7",
        Loan: "#faa7b5",
    };

    const amountData = Object.entries(stats)
        .map(([label, value]) => ({
            label,
            value: value.totalAmount || 0,
            color: colorMap[label] || "#9e9e9e",
        }))
        .filter((item) => item.value > 0)
        .slice(0, itemNb);

    const serviceData = [
        { label: "Asset", value: stats.Investment.totalServices, color: "#a4d4f5" },
        {
            label: "Protection",
            value: stats.Policy.totalServices + stats.Insurance.totalServices,
            color: "#99cc9c",
        },
        { label: "Liability", value: stats.Loan.totalServices, color: "#faa7b5" },
    ]
        .filter((item) => item.value > 0)
        .slice(0, itemNb);

    const chartSize = isMobile ? 220 : isTablet ? 280 : 350;
    const dynamicRadius = isMobile ? radius * 0.7 : isTablet ? radius * 0.9 : radius;

    const renderPieOrMessage = (title: string, data: any[]) => {
        return (
            <Paper
                elevation={4}
                sx={{
                    p: { xs: 2, sm: 3 },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 4,
                    height: "100%",
                }}
            >
                <Typography
                    variant={isMobile ? "subtitle1" : "h6"}
                    sx={{ mb: 2, fontWeight: 600, textAlign: "center" }}
                >
                    {title}
                </Typography>

                {data.length > 0 ? (
                    <PieChart
                        height={chartSize}
                        width={chartSize}
                        series={[
                            {
                                data,
                                innerRadius: dynamicRadius,
                                arcLabel: (params) => `${params.label}`,
                                arcLabelMinAngle: 20,
                                highlightScope: { fade: "global" },
                            },
                        ]}
                        skipAnimation={skipAnimation}
                    />
                ) : (
                    <Box
                        height={chartSize}
                        width={chartSize}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        border="1px dashed #ccc"
                        borderRadius={3}
                        color="gray"
                    >
                        <Typography variant="body2">No data available</Typography>
                    </Box>
                )}
            </Paper>
        );
    };

    return (
        <Box sx={{ width: "100%", p: { xs: 2, sm: 4 }, mt: 2 }}>
            {/* Page Title */}
            <Typography
                variant={isMobile ? "h5" : isTablet ? "h4" : "h3"}
                gutterBottom
                sx={{ textAlign: "center", fontWeight: 700, mb: { xs: 3, sm: 6 } }}
            >
                Pie Chart Overview
            </Typography>

            {/* Charts Grid */}
            <Grid
                container
                spacing={3}
                justifyContent="center"
                alignItems="stretch"
            >
                <Grid item xs={12} md={6}>
                    {renderPieOrMessage("Total Amount by Category", amountData)}
                </Grid>
                <Grid item xs={12} md={6}>
                    {renderPieOrMessage("Number of Services by Category", serviceData)}
                </Grid>
            </Grid>

            {/* Sliders Section */}
            <Paper
                elevation={3}
                sx={{
                    mt: { xs: 3, sm: 5 },
                    p: { xs: 2, sm: 4 },
                    borderRadius: 4,
                }}
            >
                <Stack spacing={4}>
                    {(stats.Investment.totalAmount > 0 ||
                        stats.Policy.totalAmount > 0 ||
                        stats.Loan.totalAmount > 0 ||
                        stats.Insurance.totalAmount > 0) && (
                            <Box>
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={600}
                                    gutterBottom
                                >
                                    Number of Items
                                </Typography>
                                <Slider
                                    value={itemNb}
                                    onChange={(_, value) =>
                                        typeof value === "number" && setItemNb(value)
                                    }
                                    valueLabelDisplay="auto"
                                    min={1}
                                    max={[
                                        stats.Investment.totalAmount > 0,
                                        stats.Policy.totalAmount > 0,
                                        stats.Loan.totalAmount > 0,
                                        stats.Insurance.totalAmount > 0,
                                    ].filter(Boolean).length}
                                />
                            </Box>
                        )}

                    <Box>
                        <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            gutterBottom
                        >
                            Radius
                        </Typography>
                        <Slider
                            value={radius}
                            onChange={(_, value) =>
                                typeof value === "number" && setRadius(value)
                            }
                            valueLabelDisplay="auto"
                            min={5}
                            max={100}
                        />
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
};

export default PieChartPage;
