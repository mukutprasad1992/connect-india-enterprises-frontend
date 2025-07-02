import React from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    LinearProgress,
    Tooltip,
} from "@mui/material";
import { useRouter } from "next/navigation";
import CountUp from "react-countup";
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

    const handleClick = () => {
        if (navigateTo) router.push(navigateTo);
    };
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
                "&:hover": {
                    transform: navigateTo ? "scale(1.03)" : "none",
                    boxShadow: navigateTo ? 6 : 3,
                },
            }}
        >
            <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box
                        sx={{
                            fontSize: { xs: 32, sm: 40 },
                            display: "flex",
                            alignItems: "center",
                            color: "primary.main",
                        }}
                    >
                        {icon}
                    </Box>
                    <Box textAlign="right">
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{ fontSize: { xs: 12, sm: 14 } }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            sx={{ fontSize: { xs: 18, sm: 24 } }}
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
                        <Typography variant="caption" color="text.secondary" mt={1}>
                            {progress}% achieved
                        </Typography>
                    </Box>
                )}

                {sparklineData && (
                    <Box mt={2} height={50}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={sparklineData}>
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#3f51b5"
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
