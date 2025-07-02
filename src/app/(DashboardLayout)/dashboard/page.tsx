"use client";

import DashboardContent from "../components/dashboardNew/DashboardContent";
import PieChartPage from "../components/dashboardNew/pieChart";
import RootLayout from "../components/layout/rootLayout";
import { Grid } from "@mui/material";

export default function DashboardPage() {
    return (
        <>
            <Grid sx={{ ml: 2, fontSize: 24, my: 5 }}>
                Dashboard page
            </Grid>
            <DashboardContent />
            <PieChartPage />
        </>
    );
}
