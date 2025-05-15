"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { ApexOptions } from "apexcharts";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

import { useTheme } from "@mui/material/styles";
import { Stack, Typography, Avatar, Fab } from "@mui/material";
import { IconArrowDownRight } from "@tabler/icons-react";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import AccountBalanceSharpIcon from "@mui/icons-material/AccountBalanceSharp";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useRouter } from "next/navigation";

const RupeeIcon = () => (
  <Typography fontSize="20px" fontWeight="bold" color="#fff">
    ₹
  </Typography>
);
const categoryIds: Record<string, number> = {
  Investment: 1,
  Policy: 2,
  Insurance: 3,
  Loan: 4,
};

const MonthlyEarnings = ({ title }: { title: string }) => {
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = "#f5fcff";
  const errorlight = "#fdede8";
  const router = useRouter();
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
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

  const getToken = () =>
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
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
            let url = "";
            if (roleId === "1") {
              url = `${BASE_URL}/serviceType/getTotalAmountServiceType/${id}`;
            } else {
              url = `${BASE_URL}/serviceType/getTotalAmountByUserIdServiceTypeById/${id}`;
            }

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

        setAmounts((prev) =>
          results.reduce(
            (acc, { category, totalAmount }) => ({
              ...acc,
              [category]: totalAmount,
            }),
            prev
          )
        );

        setServices((prev) =>
          results.reduce(
            (acc, { category, totalServices }) => ({
              ...acc,
              [category]: totalServices,
            }),
            prev
          )
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("Unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const iconMap: Record<string, JSX.Element> = {
    Investment: (
      <Fab
        color="secondary"
        size="medium"
        sx={{ color: "#ffffff" }}
        onClick={() => {
          if (roleId === '3') {
            handleNavigate("utilities/investment")
          }
        }}
      >
        <RupeeIcon />
      </Fab>
    ),
    Policy: (
      <Fab
        color="secondary"
        size="medium"
        sx={{ color: "#ffffff" }}
        onClick={() => {
          if (roleId === '3') {
            handleNavigate("utilities/policy");
          }
        }}
      >
        <ReceiptLongIcon />
      </Fab>
    ),

    Insurance: (
      <Fab
        color="secondary"
        size="medium"
        sx={{ color: "#ffffff" }}
        onClick={() => {
          if (roleId === '3') {
            handleNavigate("utilities/insurance")

          }
        }}
      >
        <Diversity3Icon />
      </Fab>
    ),
    Loan: (
      <Fab
        color="secondary"
        size="medium"
        sx={{ color: "#ffffff" }}
        onClick={() => {
          if (roleId === '3') {
            handleNavigate("utilities/loan")
          }
        }
        }
      >
        <AccountBalanceSharpIcon />
      </Fab>
    ),
  };

  // Chart options
  const optionscolumnchart: ApexOptions = {
    chart: {
      type: "area",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: { show: false },
      height: 60,
      sparkline: { enabled: true },
      group: "sparklines",
    },
    stroke: { curve: "smooth", width: 2 },
    fill: { colors: [secondarylight], type: "solid", opacity: 0.05 },
    markers: { size: 0 },
    tooltip: { theme: theme.palette.mode === "dark" ? "dark" : "light" },
  };

  const seriescolumnchart = [
    { name: "", color: secondary, data: [25, 66, 20, 40, 12, 58, 20] },
  ];

  return (
    <DashboardCard
      title={title}
      action={
        iconMap[title] || (
          <Fab color="secondary" size="medium" sx={{ color: "#ffffff" }}>
            <RupeeIcon />
          </Fab>
        )
      }
      footer={
        <Chart
          options={optionscolumnchart}
          series={seriescolumnchart}
          type="area"
          height={60}
          width="100%"
        />
      }
    >
      <>
        <Typography variant="h3" fontWeight="700" mt="-20px">
          {loading
            ? "Loading..."
            : errorMessage
              ? errorMessage
              : `Total service:${services[title]}`}
        </Typography>
        <Stack direction="row" spacing={1} my={1} alignItems="center">

          <Typography variant="subtitle2" fontWeight="600">
            {loading
              ? "Loading..."
              : errorMessage
                ? errorMessage
                : `Amount: ${amounts[title]}`}
          </Typography>
        </Stack>
      </>
    </DashboardCard>
  );
};

export default MonthlyEarnings;
