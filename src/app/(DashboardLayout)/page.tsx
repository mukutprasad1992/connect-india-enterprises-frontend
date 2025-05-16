"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Grid, Box, CircularProgress } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import MonthlyEarnings from "@/app/(DashboardLayout)/components/dashboard/MonthlyEarnings";
import PieAnimationPage from "./components/dashboard/pieChart";
import axios from "axios";

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
      router.push("/authentication/login");
      return;
    }

    setIsAuthenticated(true);

    const fetchData = async () => {
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

    fetchData();
  }, [router]);

  if (!isAuthenticated) return null;

  return (
    <>
      {loading && (
        <div style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
        }}>
          <CircularProgress />
        </div>
      )}
      <PageContainer title="Dashboard" description="This is Dashboard">
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                {["Investment", "Policy", "Insurance", "Loan"].map((title) => (
                  <Grid item xs={12} sm={6} md={3} key={title}>
                    <MonthlyEarnings
                      title={title}
                      amount={amounts[title] || 0}
                      service={services[title] || 0}
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
