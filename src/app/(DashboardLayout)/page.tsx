"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Grid, Box, CircularProgress } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
// components
import MonthlyEarnings from "@/app/(DashboardLayout)/components/dashboard/MonthlyEarnings";
import PieAnimationPage from "./components/dashboard/pieChart";

const Dashboard = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const getToken = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem('accessToken');
      return token;
    }
  }
  const token = getToken();
  const getRoleId = () => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("roleId");
      const roleId = storedRole ? parseInt(storedRole, 10) : null;
      return roleId;
    }
  }
  const roleId = getRoleId();
  useEffect(() => {
    setLoading(true);
    if (!token && !roleId) {
      localStorage.clear();
      router.replace("/authentication/login");
    } if (roleId === 2) {
      localStorage.clear();
      router.push("/authentication/login");
    }
    if (roleId !== 1 && roleId !== 3) {
      localStorage.clear();
      router.push("/authentication/login");
    }
    else {
      setIsAuthenticated(true);
    }
    setTimeout(() => setLoading(false), 500);
  }, [router]);

  useEffect(() => {
    const users = localStorage.getItem("user");
    if (users) {
      const user = JSON.parse(users);
    }
  }, []);

  if (!isAuthenticated) {

    return null;

  }
  return (
    <>
      {loading && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
          }}
        >
          <CircularProgress />
        </div>
      )}
      <PageContainer title="Dashboard" description="This is Dashboard">
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid container spacing={2} direction="row" justifyContent="flex-start">
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
          </Grid>
        </Box>
        <PieAnimationPage />
      </PageContainer>
    </>
  );
};

export default Dashboard;