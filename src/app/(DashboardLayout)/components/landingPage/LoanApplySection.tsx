"use client";
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useRouter } from 'next/navigation';

interface HeroProps { }

const LoanApplySection: React.FC<HeroProps> = () => {
    const router = useRouter();
    return (
        <Box
            sx={{
                position: "relative",
                height: { xs: 200, md: 200 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                textAlign: { xs: "center", md: "left" },
                backgroundSize: "cover",
                backgroundPosition: "center",
                px: 2,
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    bgcolor: "rgba(0, 91, 187, 0.7)", // blue overlay
                    zIndex: 1,
                },
            }}
        >
            <Box
                sx={{
                    position: "relative",
                    zIndex: 2,
                    maxWidth: 1200,
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexDirection: { xs: "column", md: "row" },
                }}
            >
                {/* Left Side: Text */}
                <Box sx={{ mb: { xs: 2, md: 0 } }}>
                    <Typography
                        variant="subtitle1"
                        sx={{ mb: 1.5, fontWeight: 500, color: "#fff", letterSpacing: 0.5 }}
                    >
                        Simple / Transparent / Secure
                    </Typography>

                    <Typography
                        variant="h3"
                        sx={{
                            fontWeight: 700,
                            color: "#fff",
                            fontSize: { xs: "1.8rem", md: "2.5rem" },
                        }}
                    >
                        Get a Business Loan Quickly
                    </Typography>
                </Box>

                {/* Right Side: Button */}
                <Button
                    variant="contained"
                    color="primary"
                    sx={{ px: 4, py: 1.5, fontWeight: 600 }}
                    onClick={() => router.push("/authentication/login")}
                >
                    Apply For Loan
                </Button>
            </Box>
        </Box>
    );
};

export default LoanApplySection;
