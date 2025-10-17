"use client";
import React from "react";
import { Box, Typography, Grid } from "@mui/material";

const ChooseUsCard: React.FC = () => {
    return (
        <Box
            sx={{
                width: { xs: "100%", sm: 600, md: 730 },
                mx: "auto",
                px: { xs: 2, sm: 3, md: 0.6 },
                borderTopRightRadius: { xs: 2, md: 4 },
                borderBottomRightRadius: { xs: 2, md: 4 },
                backgroundColor: "#113e97ff",
                textAlign: "start",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                pt: { xs: 3, md: 3.5 },
                position: "relative",
            }}
        >
            {/* Top Icon and Text */}
            <Grid container alignItems="center">
                <Grid
                    item
                    xs={3}
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: { xs: "flex-start", md: "center" },
                        pl: { xs: 0, md: 20 },
                    }}
                >
                    <Box
                        component="img"
                        src="/images/landingPage/business-growth-1.png"
                        alt="Choose Us Icon"
                        sx={{
                            width: { xs: 30, md: 40 },
                            height: { xs: 30, md: 40 },
                            filter: "brightness(0) invert(1)",
                        }}
                    />
                </Grid>

                <Grid item xs={9} sm={9} md={8}>
                    <Typography
                        variant="h4"
                        sx={{
                            color: "white",
                            mb: { xs: 0, md: 1 },
                            fontSize: { xs: 16, sm: 20, md: 24 },
                            fontWeight: "bold",
                            pt: { xs: 0, md: 2 },
                            pl: { xs: 1, md: 2 },
                        }}
                    >
                        26 years of working experience
                    </Typography>
                </Grid>
            </Grid>

            {/* Image below text */}
            <Box
                component="img"
                src="/images/landingPage/DSC_7789.jpg"
                alt="Choose Us"
                sx={{
                    width: { xs: "80%", sm: 400, md: 570 },
                    height: "auto",
                    mt: { xs: 2, md: 2 },
                    alignSelf: "flex-end",
                    borderRadius: { xs: 2, md: 0 },
                }}
            />
        </Box>
    );
};

export default ChooseUsCard;
