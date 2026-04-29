import React from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    LinearProgress,
    Tooltip,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { useRouter } from "next/navigation";
import CountUp from 'react-countup';
import { ResponsiveContainer, LineChart, Line } from "recharts";

interface Props {
    title: string;
    value: number;
    icon: React.ReactNode;
    backgroundColor?: string;
    navigateTo?: string;
    progress?: number;
    tooltip?: string;
    sparklineData?: number[];
}

const OverviewCard: React.FC<Props> = ({
    title,
    value,
    icon,
    backgroundColor,
    navigateTo,
    progress,
    tooltip,
    sparklineData,
}) => {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const isTablet = useMediaQuery(theme.breakpoints.between("xs", "sm"));

    const handleClick = () => {
        if (navigateTo) router.push(navigateTo);
    };
    const chartData =
        sparklineData?.map((val, idx) => ({ name: idx.toString(), value: val })) || [];

    return (
        <Card
            onClick={handleClick}
            sx={{
                backgroundColor: backgroundColor || "#fff",
                borderRadius: 3,
                boxShadow: 4,
                cursor: navigateTo ? "pointer" : "default",
                height: "100%",
                transition: "transform 0.2s ease-in-out",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                "&:hover": {
                    transform: navigateTo ? "scale(1.03)" : "none",
                    boxShadow: navigateTo ? 6 : 3,
                },
            }}
        >
            <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    flexWrap="wrap"
                    gap={2}
                >
                    <Box
                        sx={{
                            fontSize: isMobile ? 25 : isTablet ? 30 : 36,
                            display: "flex",
                            alignItems: "center",
                            color: "primary.main",
                        }}
                    >
                        {icon}
                    </Box>

                    <Box textAlign="right" flexGrow={1} minWidth={120}>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{
                                fontSize: { xs: 9, sm: 11, md: 12 },
                                whiteSpace: "nowrap",
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            sx={{ fontSize: { xs: 14, sm: 18, md: 22 } }}
                        >
                            <Tooltip title={tooltip || ""}>
                                <span>
                                    <CountUp end={value} duration={1.5} separator="," />
                                </span>
                            </Tooltip>
                        </Typography>
                    </Box>
                </Box>

                {progress !== undefined && (
                    <Box mt={2}>
                        <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                                height: 8,
                                borderRadius: 5,
                                backgroundColor: "#e0e0e0",
                                "& .MuiLinearProgress-bar": {
                                    borderRadius: 5,
                                    backgroundColor: "primary.main",
                                },
                            }}
                        />
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ mt: 1, display: "block" }}
                        >
                            {progress}% achieved
                        </Typography>
                    </Box>
                )}

                {sparklineData && sparklineData.length > 0 && (
                    <Box mt={2} flexGrow={1} minHeight={50}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke={theme.palette.primary.main}
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default OverviewCard;
