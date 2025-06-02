"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import {
    Box,
    Typography,
    Stack,
    useTheme,
    Chip,
    Avatar,
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

    const getToken = () => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("accessToken");
        }
    };

    useEffect(() => {
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
    }, [router]);

    const iconMap: Record<string, JSX.Element> = {
        Policy: <ReceiptLongIcon fontSize="small" />,
        Insurance: <Diversity3Icon fontSize="small" />,
        Loan: <AccountBalanceSharpIcon fontSize="small" />,
        Investment: <CurrencyRupeeIcon fontSize="small" />,
    };

    const handleClick = () => {
        if (roleId === "3") {
            router.push(`utilities/${title.toLowerCase()}`);
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
                borderRadius: '3px',
                p: 2,
                background: theme.palette.background.paper,
            }}
        >
            <Typography variant="subtitle2" color="textSecondary"
                sx={{
                    py: 1,
                    m: 0,
                    fontWeight: 400,
                    fontSize: "0.875rem",
                    lineHeight: 1.5,
                    fontFamily: "'Public Sans', sans-serif",
                    color: "#8c8c8c",
                }}
            >
                Total {title}: {service}
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ fontSize: 20 }}
                >
                    {loading
                        ? "Loading..."
                        : errorMessage
                            ? errorMessage
                            : amount.toLocaleString()}
                </Typography>

                <Chip
                    icon={<TrendIcon />}
                    label={`${percentage}%`}
                    size="small"
                    sx={{
                        ml: 1,
                        fontWeight: 400,
                        lineHeight: 1.66,
                        fontFamily: "'Public Sans', sans-serif",
                        border: 1,
                        borderColor: growth === "up" ? "#69b1ff" : "#ffd666",
                        backgroundColor: growth === "up" ? "#e6f4ff" : "#fffbe6",
                        color: growth === "up" ? "#1677ff" : "#faad14",
                        fontSize: 13,
                        borderRadius: "4px",
                        px: 1,
                    }}
                />
            </Box>

            <Typography
                variant="body2"
                color="textSecondary"
                sx={{ mt: 2 }}
            >
                You made an extra{" "}
                <Typography
                    component="span"
                    sx={{
                        m: 0,
                        fontWeight: 400,
                        fontSize: "0.75rem",
                        lineHeight: 1.66,
                        fontFamily: "'Public Sans', sans-serif",
                        color: growth === "up" ? theme.palette.primary.main : "#faad14",
                        py: 1,
                    }}
                >
                    {extra.toLocaleString()}
                </Typography>{" "}
                this year
            </Typography>
        </Box >
    );
};

export default AnalyticCard;
