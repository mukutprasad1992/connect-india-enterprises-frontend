"use client";
import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import OverviewCard from "./OverviewCard";
import {
    People,
    AttachMoney,
    ShoppingCart,
    SupportAgent,
} from "@mui/icons-material";

const getCardData = (filter: string) => {
    return [
        {
            title: "Users",
            value: filter === "today" ? 24 : filter === "week" ? 140 : 1024,
            icon: <People fontSize="inherit" />,
            color: "#E3F2FD",
            link: "/users",
            progress: 78,
            tooltip: "User growth trend",
            sparklineData: [
                { name: "T1", value: 100 },
                { name: "T2", value: 200 },
                { name: "T3", value: 400 },
                { name: "T4", value: 800 },
            ],
        },
        {
            title: "Revenue",
            value: filter === "today" ? 2300 : filter === "week" ? 12000 : 23000,
            icon: <AttachMoney fontSize="inherit" />,
            color: "#E8F5E9",
            link: "/revenue",
            progress: 60,
            tooltip: "Revenue trend",
            sparklineData: [
                { name: "T1", value: 100 },
                { name: "T2", value: 200 },
                { name: "T3", value: 400 },
                { name: "T4", value: 800 },
            ],
        },
        {
            title: "Orders",
            value: filter === "today" ? 12 : filter === "week" ? 89 : 312,
            icon: <ShoppingCart fontSize="inherit" />,
            color: "#F3E5F5",
            link: "/orders",
            progress: 45,
            tooltip: "Order trend",
            sparklineData: [
                { name: "T1", value: 100 },
                { name: "T2", value: 200 },
                { name: "T3", value: 400 },
                { name: "T4", value: 800 },
            ],
        },
        {
            title: "Support Tickets",
            value: filter === "today" ? 4 : filter === "week" ? 10 : 14,
            icon: <SupportAgent fontSize="inherit" />,
            color: "#FFEBEE",
            link: "/support",
            progress: 20,
            tooltip: "Support ticket trend",
            sparklineData: [
                { name: "T1", value: 100 },
                { name: "T2", value: 200 },
                { name: "T3", value: 400 },
                { name: "T4", value: 800 },
            ],
        },
    ];
};

export default function DashboardContent() {
    const [filter, setFilter] = useState("month");

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setFilter(newValue);
    };

    const cardData = getCardData(filter);

    return (
        <Box>
            {/* Filter Tabs */}
            <Tabs
                value={filter}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 2 }}
            >
                <Tab value="today" label="Today" />
                <Tab value="week" label="This Week" />
                <Tab value="month" label="This Month" />
            </Tabs>

            {/* Cards */}
            <Grid container spacing={3}>
                {cardData.map((card, index) => (
                    <Grid item key={index} xs={12} sm={6} md={6} lg={3}>
                        <OverviewCard
                            title={card.title}
                            value={card.value}
                            icon={card.icon}
                            backgroundColor={card.color}
                            navigateTo={card.link}
                            progress={card.progress}
                            tooltip={card.tooltip}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
