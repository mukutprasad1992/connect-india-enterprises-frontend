"use client";
import { FC, ReactNode } from "react";
import { CardContent, Typography, Box, Grid } from "@mui/material";

interface VerticalCardProps {
    icon: ReactNode;
    title: string;
    description: string;
}

const InfoCardVertical: FC<VerticalCardProps> = ({ icon, title, description }) => {
    return (
        <Grid
            sx={{
                maxWidth: { xs: 800, md: 330 },
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
                p: 3,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
            }}
        >
            {/* Icon */}
            <Box
                sx={{
                    fontSize: 30,
                    backgroundColor: "blue",
                    color: "white",
                    height: 90,
                    width: 90,
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {icon}
            </Box>

            {/* Content */}
            <CardContent
                sx={{
                    p: 0,
                    mt: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    sx={{ fontSize: 20, lineHeight: 1.2 }}
                >
                    {title}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                >
                    {description}
                </Typography>
            </CardContent>
        </Grid>
    );
};

export default InfoCardVertical;
