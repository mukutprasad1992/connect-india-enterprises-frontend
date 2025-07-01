"use client";

import * as React from "react";
import { Box, Grid, Typography, Slider, Stack } from "@mui/material";
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
                // Gracefully fallback to zero stats
                setStats({
                    Investment: { totalAmount: 0, totalServices: 0 },
                    Policy: { totalAmount: 0, totalServices: 0 },
                    Insurance: { totalAmount: 0, totalServices: 0 },
                    Loan: { totalAmount: 0, totalServices: 0 },
                });
            }
        } catch (error) {
            // Unexpected error fallback
            setHasError(true);
            setStats({
                Investment: { totalAmount: 0, totalServices: 0 },
                Policy: { totalAmount: 0, totalServices: 0 },
                Insurance: { totalAmount: 0, totalServices: 0 },
                Loan: { totalAmount: 0, totalServices: 0 },
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServiceData();
    }, []);

    const colorMap: Record<string, string> = {
        Investment: "#42a5f5",
        Policy: "#66bb6a",
        Insurance: "#26a69a",
        Loan: "#ef5350",
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
        { label: "Asset", value: stats.Investment.totalServices, color: "#42a5f5" },
        {
            label: "Protection",
            value: stats.Policy.totalServices + stats.Insurance.totalServices,
            color: "#46b182",
        },
        { label: "Liability", value: stats.Loan.totalServices, color: "#ef5350" },
    ]
        .filter((item) => item.value > 0)
        .slice(0, itemNb);

    const renderPieOrMessage = (title: string, data: any[]) => {
        return (
            <Box

            >
                <Typography sx={{ textAlign: 'center' }}  >
                    {title}
                </Typography>

                {data.length > 0 ? (
                    <PieChart
                        height={300}
                        width={300}
                        series={[
                            {
                                data: data,
                                innerRadius: radius,
                                arcLabel: (params) => `${params.label}`,
                                arcLabelMinAngle: 10,
                            },
                        ]}
                        skipAnimation={skipAnimation}
                    />
                ) : (
                    <Box
                        height={300}
                        width={300}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        border="1px dashed #ccc"
                        borderRadius={2}
                        color="gray"
                    >
                        <Typography variant="body1">No data available</Typography>
                    </Box>
                )}
            </Box>
        );
    };

    return (
        <Box sx={{ width: "100%", mt: 5 }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
                Pie Chart Overview
            </Typography>

            <Grid container spacing={3} sx={{ mt: 3 }}>
                <Grid item xs={12} md={6}>
                    {renderPieOrMessage("Total Amount by Category", amountData)}
                </Grid>
                <Grid item xs={12} md={6}>
                    {renderPieOrMessage("Number of Services by Category", serviceData)}
                </Grid>

            </Grid>

            <Stack mt={4} spacing={3}>
                {(stats.Investment.totalAmount > 0 ||
                    stats.Policy.totalAmount > 0 ||
                    stats.Loan.totalAmount > 0 ||
                    stats.Insurance.totalAmount > 0) && (
                        <Box>
                            <Typography gutterBottom>Number of Items</Typography>
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
                    <Typography gutterBottom>Radius</Typography>
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
        </Box>
    );
};

export default PieChartPage;
