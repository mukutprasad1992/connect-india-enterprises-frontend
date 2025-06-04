"use client";

import { useRouter } from "next/navigation";
import {
    Box,
    Typography,
    useTheme,
    Chip,
    useMediaQuery,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import AccountBalanceSharpIcon from "@mui/icons-material/AccountBalanceSharp";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

type AnalyticCardProps = {
    title: "Policy" | "Insurance" | "Loan" | "Investment";
    amount: number;
    service: number;
    percentage: number;
    growth: "up" | "down";
    extra: number;
    loading: boolean;
    errorMessage: string | null;
};

const AnalyticCard: React.FC<AnalyticCardProps> = ({
    title,
    amount,
    service,
    percentage,
    growth,
    extra,
    loading,
    errorMessage,
}) => {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const roleId =
        typeof window !== "undefined" ? localStorage.getItem("roleId") : null;

    const iconMap: Record<string, JSX.Element> = {
        Policy: <ReceiptLongIcon fontSize="small" />,
        Insurance: <Diversity3Icon fontSize="small" />,
        Loan: <AccountBalanceSharpIcon fontSize="small" />,
        Investment: <CurrencyRupeeIcon fontSize="small" />,
    };

    const handleClick = () => {
        if (roleId === "3") {
            router.push(`/utilities/${title.toLowerCase()}`);
        }
    };

    const color = growth === "up" ? "primary" : "warning";
    const TrendIcon = growth === "up" ? TrendingUpIcon : TrendingDownIcon;

    return (
        <Box
            onClick={handleClick}
            sx={{
                cursor: "pointer",
                border: "1px solid #e0e0e0",
                borderRadius: "8px",
                p: 2,
                background: theme.palette.background.paper,
                transition: "all 0.2s",
                "&:hover": {
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                },
            }}
        >
            <Typography
                variant="subtitle2"
                sx={{
                    mb: 1,
                    color: "#8c8c8c",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                }}
            >
                Total {title}: {service}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography
                    variant="body1"
                    fontWeight={600}
                    sx={{ fontSize: 20, color: errorMessage ? "error.main" : "text.primary" }}
                >
                    {loading
                        ? "Loading..."
                        : errorMessage
                            ? errorMessage
                            : amount.toLocaleString()}
                </Typography>

                {!loading && !errorMessage && (
                    <Chip
                        icon={<TrendIcon />}
                        label={`${percentage}%`}
                        size="small"
                        sx={{
                            ml: 1,
                            fontWeight: 400,
                            fontSize: 13,
                            borderRadius: "4px",
                            px: 1,
                            border: 1,
                            borderColor: growth === "up" ? "#69b1ff" : "#ffd666",
                            backgroundColor: growth === "up" ? "#e6f4ff" : "#fffbe6",
                            color: growth === "up" ? "#1677ff" : "#faad14",
                        }}
                    />
                )}
            </Box>

            {!loading && !errorMessage && (
                <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
                    You made an extra{" "}
                    <Typography
                        component="span"
                        sx={{
                            fontWeight: 500,
                            fontSize: "0.85rem",
                            color: growth === "up" ? theme.palette.primary.main : "#faad14",
                        }}
                    >
                        ₹{extra.toLocaleString()}
                    </Typography>{" "}
                    this month
                </Typography>
            )}
        </Box>
    );
};

export default AnalyticCard;
