"use client";
import { useTheme } from "@mui/material/styles";
import { Stack, Typography, Fab, Box } from "@mui/material";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import AccountBalanceSharpIcon from "@mui/icons-material/AccountBalanceSharp";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { ApexOptions } from "apexcharts";
import { jwtDecode } from "jwt-decode";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const RupeeIcon = () => (
  <Typography fontSize="20px" fontWeight="bold" color="#fff">₹</Typography>
);

type MonthlyEarningsProps = {
  title: string;
  amount: number;
  service: number;
  loading: boolean;
  errorMessage: string | null;
};

const MonthlyEarnings: React.FC<MonthlyEarningsProps> = ({
  title,
  amount,
  service,
  loading,
  errorMessage,
}) => {
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = "#f5fcff";
  const router = useRouter();
  const roleId = typeof window !== "undefined" ? localStorage.getItem("roleId") : null;

  const handleNavigate = (path: string) => {
    router.push(path);
  };
  const getToken = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem('accessToken');
      return token;
    }
  }
  const token = getToken();
  if (token) {
    const decoded: any = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.clear();
      router.push("/authentication/login");
    }
  } else {
    localStorage.clear();
    router.push("/authentication/login");
  }
  const iconMap: Record<string, JSX.Element> = {
    Investment: (
      <Fab color="secondary" size="medium" sx={{ color: "#ffffff" }} onClick={() => {
        if (roleId === "3") handleNavigate("utilities/investment");
      }}>
        <RupeeIcon />
      </Fab>
    ),
    Policy: (
      <Fab color="secondary" size="medium" sx={{ color: "#ffffff" }} onClick={() => {
        if (roleId === "3") handleNavigate("utilities/policy");
      }}>
        <ReceiptLongIcon />
      </Fab>
    ),
    Insurance: (
      <Fab color="secondary" size="medium" sx={{ color: "#ffffff" }} onClick={() => {
        if (roleId === "3") handleNavigate("utilities/insurance");
      }}>
        <Diversity3Icon />
      </Fab>
    ),
    Loan: (
      <Fab color="secondary" size="medium" sx={{ color: "#ffffff" }} onClick={() => {
        if (roleId === "3") handleNavigate("utilities/loan");
      }}>
        <AccountBalanceSharpIcon />
      </Fab>
    ),
  };

  const optionscolumnchart: ApexOptions = {
    chart: {
      type: "area",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
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
      action={iconMap[title]}
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
      <Box>
        <Typography variant="h3" fontWeight="700" mt="-20px">
          {loading ? "Loading..." : errorMessage ? errorMessage : `Total service: ${service || 0}`}
        </Typography>
        <Stack direction="row" spacing={1} my={1} alignItems="center">
          <Typography variant="subtitle2" fontWeight="600">
            {loading ? "Loading..." : errorMessage ? errorMessage : `Amount: ₹${amount || 0}`}
          </Typography>
        </Stack>
      </Box>
    </DashboardCard>
  );
};

export default MonthlyEarnings;
