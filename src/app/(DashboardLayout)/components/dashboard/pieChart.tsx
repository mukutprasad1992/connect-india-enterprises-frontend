"use client";

import * as React from 'react';
import { Box, Grid, Typography, Slider, FormControlLabel, Checkbox } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from "next/navigation";

const categoryIds: Record<string, number> = {
    Investment: 1,
    Policy: 2,
    Insurance: 3,
    Loan: 4,
};

const PieChartPage = () => {
    const [radius, setRadius] = useState(50);
    const [itemNb, setItemNb] = useState(5);
    const [skipAnimation, setSkipAnimation] = useState(false);
    const router = useRouter();
    const [amounts, setAmounts] = useState<{ [key: string]: number }>({
        Investment: 0,
        Policy: 0,
        Insurance: 0,
        Loan: 0,
    });
    const [services, setServices] = useState<{ [key: string]: number }>({
        Investment: 0,
        Policy: 0,
        Insurance: 0,
        Loan: 0,
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const getToken = () => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem('accessToken');
            return token;
        }
    }
    const token = getToken();

    const getRoleId = () =>
        typeof window !== "undefined" ? localStorage.getItem("roleId") : null;
    const roleId = getRoleId();

    useEffect(() => {
        if (!token || !roleId) {
            router.push("/authentication/login");
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const requests = Object.entries(categoryIds).map(async ([category, id]) => {
                    try {
                        const url = roleId === "1"
                            ? `http://localhost:4000/serviceType/getTotalAmountServiceType/${id}`
                            : `http://localhost:4000/serviceType/getTotalAmountByUserIdServiceTypeById/${id}`;

                        const response = await axios.get(url, {
                            headers: { Authorization: `Bearer ${token}` },
                        });

                        const data = response.data?.data ?? { totalAmount: 0, totalServices: 0 };

                        return {
                            category,
                            totalAmount: parseFloat(data.totalAmount),
                            totalServices: parseInt(data.totalServices),
                        };
                    } catch (error) {
                        console.error(`Error fetching ${category} data:`, error);
                        return {
                            category,
                            totalAmount: 0,
                            totalServices: 0,
                        };
                    }
                });

                const results = await Promise.all(requests);

                const newAmounts: { [key: string]: number } = {};
                const newServices: { [key: string]: number } = {};

                results.forEach(({ category, totalAmount, totalServices }) => {
                    newAmounts[category] = totalAmount;
                    newServices[category] = totalServices;
                });

                setAmounts(newAmounts);
                setServices(newServices);
            } catch (error) {
                console.error("Error fetching data:", error);
                setErrorMessage("Unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const colorMap: Record<string, string> = {
        Investment: '#42a5f5', // Blue
        Policy: '#66bb6a',     // Green
        Insurance: '#26a69a',  // Teal
        Loan: '#ef5350',       // Red
    };
    const amountData = Object.entries(amounts)
        .map(([label, value]) => ({
            label,
            value,
            color: colorMap[label] || '#9e9e9e'
        }))
        .filter((item) => item.value > 0)
        .slice(0, itemNb);

    const serviceData = [
        { label: 'Asset', value: services.Investment, color: '#42a5f5' }, // Blue
        { label: 'Protection', value: services.Policy + services.Insurance, color: '#46b182' }, // Green
        { label: 'Liability', value: services.Loan, color: '#ef5350' }, // Red
    ]
        .filter((item) => item.value > 0)
        .slice(0, itemNb);

    const handleItemNbChange = (_: Event, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            setItemNb(newValue);
        }
    };

    const handleRadiusChange = (_: Event, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            setRadius(newValue);
        }
    };

    return (
        <Box sx={{ width: '100%', padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Pie Chart Overview
            </Typography>

            {errorMessage && (
                <Typography color="error" gutterBottom>
                    {errorMessage}
                </Typography>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                        Total Amount by Category
                    </Typography>
                    <PieChart
                        height={300}
                        width={300}
                        series={[{
                            data: amountData,
                            innerRadius: radius,
                            arcLabel: (params) => `${params.label}`,
                            arcLabelMinAngle: 20,
                        }]}
                        skipAnimation={skipAnimation}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                        Number of Services by Category
                    </Typography>
                    <PieChart
                        height={300}
                        width={300}
                        series={[
                            {
                                data: serviceData,
                                innerRadius: radius,
                                arcLabel: (params) => `${params.label}:\n${params.value}`,
                                arcLabelMinAngle: 5,
                            },
                        ]}

                        skipAnimation={skipAnimation}
                    />
                </Grid>
            </Grid>
            <Typography gutterBottom>Number of items</Typography>
            <Slider
                value={itemNb}
                onChange={handleItemNbChange}
                valueLabelDisplay="auto"
                min={1}
                max={8}
            />

            <Typography gutterBottom>Radius</Typography>
            <Slider
                value={radius}
                onChange={handleRadiusChange}
                valueLabelDisplay="auto"
                min={15}
                max={100}
            />
        </Box>
    );
};

export default PieChartPage;
