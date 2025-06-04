"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Grid, Box, CircularProgress, Typography } from "@mui/material";
import PageContainer from "./components/container/PageContainer";
import AnalyticCard from "./components/dashboard/AnalyticCard";
import PieAnimationPage from "./components/dashboard/pieChart";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

type ServiceType = "Investment" | "Policy" | "Insurance" | "Loan";

interface ServiceStats {
  totalAmount: number;
  totalServices: number;
  current: number;
  previous: number;
  extra: number;
  percent: number;
}

const Dashboard = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Record<ServiceType, ServiceStats>>({
    Investment: {
      totalAmount: 0,
      totalServices: 0,
      current: 0,
      previous: 0,
      extra: 0,
      percent: 0,
    },
    Policy: {
      totalAmount: 0,
      totalServices: 0,
      current: 0,
      previous: 0,
      extra: 0,
      percent: 0,
    },
    Insurance: {
      totalAmount: 0,
      totalServices: 0,
      current: 0,
      previous: 0,
      extra: 0,
      percent: 0,
    },
    Loan: {
      totalAmount: 0,
      totalServices: 0,
      current: 0,
      previous: 0,
      extra: 0,
      percent: 0,
    },
  });
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
      const decoded: any = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
        router.replace("/authentication/login");
        return;
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

        setStats({
          Investment: {
            totalAmount: parseFloat(data.Investment?.totalAmount) || 0,
            totalServices: parseInt(data.Investment?.totalServices) || 0,
            current: parseFloat(data.Investment?.current) || 0,
            previous: parseFloat(data.Investment?.previous) || 0,
            extra: parseFloat(data.Investment?.extra) || 0,
            percent: parseFloat(data.Investment?.percent) || 0,
          },
          Policy: {
            totalAmount: parseFloat(data.Policy?.totalAmount) || 0,
            totalServices: parseInt(data.Policy?.totalServices) || 0,
            current: parseFloat(data.Policy?.current) || 0,
            previous: parseFloat(data.Policy?.previous) || 0,
            extra: parseFloat(data.Policy?.extra) || 0,
            percent: parseFloat(data.Policy?.percent) || 0,
          },
          Insurance: {
            totalAmount: parseFloat(data.Insurance?.totalAmount) || 0,
            totalServices: parseInt(data.Insurance?.totalServices) || 0,
            current: parseFloat(data.Insurance?.current) || 0,
            previous: parseFloat(data.Insurance?.previous) || 0,
            extra: parseFloat(data.Insurance?.extra) || 0,
            percent: parseFloat(data.Insurance?.percent) || 0,
          },
          Loan: {
            totalAmount: parseFloat(data.Loan?.totalAmount) || 0,
            totalServices: parseInt(data.Loan?.totalServices) || 0,
            current: parseFloat(data.Loan?.current) || 0,
            previous: parseFloat(data.Loan?.previous) || 0,
            extra: parseFloat(data.Loan?.extra) || 0,
            percent: parseFloat(data.Loan?.percent) || 0,
          },
        });

        setErrorMessage(null);
      } else if (
        response.status === 400 &&
        response.data.message?.toLowerCase().includes("service not found")
      ) {
        setStats({
          Investment: {
            totalAmount: 0,
            totalServices: 0,
            current: 0,
            previous: 0,
            extra: 0,
            percent: 0,
          },
          Policy: {
            totalAmount: 0,
            totalServices: 0,
            current: 0,
            previous: 0,
            extra: 0,
            percent: 0,
          },
          Insurance: {
            totalAmount: 0,
            totalServices: 0,
            current: 0,
            previous: 0,
            extra: 0,
            percent: 0,
          },
          Loan: {
            totalAmount: 0,
            totalServices: 0,
            current: 0,
            previous: 0,
            extra: 0,
            percent: 0,
          },
        });
        setErrorMessage(null);
      } else {
        console.warn("API returned unexpected error", response.data);
        setErrorMessage(null);
      }
    } catch (err: any) {
      if (
        axios.isAxiosError(err) &&
        err.response?.status === 400 &&
        err.response?.data?.message?.toLowerCase().includes("service not found")
      ) {
        setErrorMessage(null);
      } else {
        console.error("API error:", err);
        setErrorMessage(null);
      }
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
                {(["Investment", "Policy", "Insurance", "Loan"] as ServiceType[]).map(
                  (title) => (
                    <Grid item xs={12} sm={6} md={3} key={title}>
                      <AnalyticCard
                        title={title}
                        amount={Math.floor(stats[title].totalAmount)}
                        service={stats[title].totalServices}
                        percentage={stats[title].percent}
                        growth={stats[title].extra >= 0 ? "up" : "down"}
                        extra={stats[title].extra}
                        loading={loading}
                        errorMessage={errorMessage}
                      />
                    </Grid>
                  )
                )}
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
