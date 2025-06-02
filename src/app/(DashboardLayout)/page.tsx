"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Grid, Box, CircularProgress, Typography } from "@mui/material";
import PageContainer from "./components/container/PageContainer";
import MonthlyEarnings from "./components/dashboard/MonthlyEarnings"; // OLD component (commented)
import AnalyticCard from "./components/dashboard/AnalyticCard"; // ✅ NEW component
import PieAnimationPage from "./components/dashboard/pieChart";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [amounts, setAmounts] = useState<{ [key: string]: number }>({});
  const [services, setServices] = useState<{ [key: string]: number }>({});
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const roleId = localStorage.getItem("roleId");

    if (!token || !roleId) {
      localStorage.clear();
      router.replace("/authentication/login");
      return;
    }

    const numericRole = parseInt(roleId, 10);
    if (![1, 3].includes(numericRole)) {
      localStorage.clear();
      router.replace("/authentication/login");
      return;
    }

    try {
      if (token) {
        const decoded: any = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.clear();
          router.replace("/authentication/login");
          return;
        }
      }
    } catch {
      localStorage.clear();
      router.replace("/authentication/login");
      return;
    }

    setIsAuthenticated(true);
    fetchData(token);
  }, []);

  const fetchData = async (token: string) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/serviceType/getTotalAmountAndServiecsByUserIdServiceType`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.status) {
        const data = response.data.data;

        setAmounts({
          Investment: parseFloat(data.Investment?.totalAmount) || 0,
          Policy: parseFloat(data.Policy?.totalAmount) || 0,
          Insurance: parseFloat(data.Insurance?.totalAmount) || 0,
          Loan: parseFloat(data.Loan?.totalAmount) || 0,
        });
        setServices({
          Investment: parseInt(data.Investment?.totalServices) || 0,
          Policy: parseInt(data.Policy?.totalServices) || 0,
          Insurance: parseInt(data.Insurance?.totalServices) || 0,
          Loan: parseInt(data.Loan?.totalServices) || 0,
        });

        setErrorMessage(null);
      } else {
        setErrorMessage("Failed to retrieve data");
      }
    } catch (err) {
      console.error("API error:", err);
      setErrorMessage("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

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
          <Typography variant="h6" sx={{ mb: 3 }}>
            Dashboard
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {["Investment", "Policy", "Insurance", "Loan"].map((title) => (
                  <Grid item xs={12} sm={6} md={3} key={title}>
                    {/* OLD CARD — DEPRECATED */}
                    {/* <MonthlyEarnings
                      title={title}
                      amount={amounts[title] || 0}
                      service={services[title] || 0}
                      loading={loading}
                      errorMessage={errorMessage}
                    /> */}

                    {/* ✅ NEW CARD — MODERN VERSION */}
                    <AnalyticCard
                      title={title as "Investment" | "Policy" | "Insurance" | "Loan"}
                      amount={Math.floor(amounts[title] || 0)}
                      service={services[title] || 0}
                      percentage={Math.floor(Math.random() * 50) + 10} // Replace with real % if needed
                      growth={Math.random() > 0.5 ? "up" : "down"} // Replace with real trend
                      extra={Math.floor(Math.random() * 10000) + 1000} // Replace with real extra if needed
                      loading={loading}
                      errorMessage={errorMessage}
                    />
                  </Grid>
                ))}
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
