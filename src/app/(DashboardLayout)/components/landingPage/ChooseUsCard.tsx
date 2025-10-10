"use client";
import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import StarIcon from '@mui/icons-material/Star'; // Example icon, replace if needed

const ChooseUsCard: React.FC = () => {
    return (
        <Box
            sx={{
                width: 730,
                ml: 0.5,
                px: { xs: 2, md: .6 },
                borderTopRightRadius: 4,
                borderBottomRightRadius: 4,
                backgroundColor: "#113e97ff",
                textAlign: "start",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "end",
                pt: 3.5,
            }}
        >
            {/* Top Icon */}
            <Grid container>
                <Grid item xs={3} sx={{ pl: 14 }}>
                    <StarIcon sx={{ color: "#FFD700", fontSize: 36 }} />
                </Grid>
                <Grid item xs={8} >
                    {/* Text */}
                    <Typography
                        variant="h4"
                        sx={{
                            color: "white",
                            mb: 3,
                            fontSize: { xs: 18, md: 26 }, // responsive
                            fontWeight: "bold",
                        }}
                    >
                        26 years of working experience
                    </Typography>
                </Grid></Grid>
            {/* Image below text */}
            <Box
                component="img"
                src="/images/landingPage/IMG20250224152930.jpg"
                alt="Choose Us"
                sx={{
                    width: 570,
                    height: 570,
                    mt: 2,
                    bottom: 0,
                    right: 0
                }}
            />
        </Box >
    );
};

export default ChooseUsCard;
