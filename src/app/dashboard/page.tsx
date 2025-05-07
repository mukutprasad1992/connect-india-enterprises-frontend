"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import ProductPerformance from "@/app/(DashboardLayout)/components/dashboard/ProductPerformance";
import MonthlyEarnings from "@/app/(DashboardLayout)/components/dashboard/MonthlyEarnings";
const Dashboard = () => {
  const router = useRouter();

  const getToken = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem('accessToken');
      return token;
    }
  }
  const getTokenData = getToken();
  useEffect(() => {
    if (!getTokenData) {
      router.push("/authentication/login");
    }
  }, [router]);

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>

          <Grid item xs={12}>
            <Grid
              container
              spacing={2}
              direction="row"
              justifyContent="flex-start"
            >
              <Grid item xs={12} sm={6} md={3}>
                <MonthlyEarnings title="Investment" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MonthlyEarnings title="Policy" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MonthlyEarnings title="Insurance" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MonthlyEarnings title="Loan" />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <ProductPerformance title="Investment" />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
