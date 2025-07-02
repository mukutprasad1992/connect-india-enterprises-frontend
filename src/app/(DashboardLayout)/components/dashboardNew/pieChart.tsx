"use client";

import * as React from "react";
import { Box, Grid, Typography, Slider, Stack } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import { useState } from "react";

const PieChartPage = () => {
    const [radius, setRadius] = useState(50);
    const [itemNb, setItemNb] = useState(5);
    const [skipAnimation, setSkipAnimation] = useState(false);

    // ✅ Static sample data
    const stats = {
        Investment: { totalAmount: 120000, totalServices: 5 },
        Policy: { totalAmount: 80000, totalServices: 4 },
        Insurance: { totalAmount: 100000, totalServices: 3 },
        Loan: { totalAmount: 150000, totalServices: 6 },
    };

    const colorMap: Record<string, string> = {
        Investment: "#d2e8f7",
        Policy: "#d5f5d7",
        Insurance: "#f4daf7",
        Loan: "#fce3e7",
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
        { label: "Asset", value: stats.Investment.totalServices, color: "#d2e8f7" },
        {
            label: "Protection",
            value: stats.Policy.totalServices + stats.Insurance.totalServices,
            color: "#d5f5d7",
        },
        { label: "Liability", value: stats.Loan.totalServices, color: "#fce3e7" },
    ]
        .filter((item) => item.value > 0)
        .slice(0, itemNb);

    const renderPieOrMessage = (title: string, data: any[]) => (
        <Box>
            <Typography sx={{ textAlign: "center" }}>{title}</Typography>
            {data.length > 0 ? (
                <PieChart
                    height={300}
                    width={300}
                    series={[
                        {
                            data,
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

    return (
        <Box sx={{ width: "100%", mt: 5 }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
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
                <Box>
                    <Typography gutterBottom>Number of Items</Typography>
                    <Slider
                        value={itemNb}
                        onChange={(_, value) =>
                            typeof value === "number" && setItemNb(value)
                        }
                        valueLabelDisplay="auto"
                        min={1}
                        max={4}
                    />
                </Box>
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
