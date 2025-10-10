"use client";
import { Grid, Box, Typography, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TrustedCompanyCard from "./TrustedCompanyCard";

export default function TrustedCompanySection() {
    return (
        <Grid
            container
            spacing={0}
            sx={{
                overflow: "hidden",
                display: 'relative',
                borderRadius: 0,
                backgroundColor: "#0d0d30ff",
                color: "#fff",
                backgroundImage: "url('/images/landingPage/pattern-bg.png')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",

                px: { xs: 3, md: 8 },
                alignItems: "center",
            }}
        >
            {/* LEFT SIDE */}
            <Grid item xs={12} md={6}>
                <Typography
                    variant="subtitle2"
                    sx={{
                        color: "#1E90FF",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                        fontWeight: 600,
                        mb: 1,
                    }}
                >
                    Trusted Company
                </Typography>

                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: "bold",
                        mb: 2,
                        lineHeight: 1.4,
                    }}
                >
                    Most of the People Trust on Us For Fast Services
                </Typography>

                <Typography
                    variant="body1"
                    sx={{ opacity: 0.8, mb: 3, maxWidth: 480 }}
                >
                    There are many variations of passages of lorem ipsum available,
                    the majority have suffered alteration in some form by injected humour.
                    Duis aute irure dolor in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </Typography>

                {/* Image */}
                <Box
                    component="img"
                    src="/images/landingPage/trusted-company.jpg"
                    alt="Trusted Company"
                    sx={{
                        width: 180,
                        borderRadius: 2,
                        mb: 2,
                        boxShadow: 3,
                    }}
                />

                {/* Loan Type List */}
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <List dense>
                            {["Credit Card Per Day", "Personal Loan", "Car / Auto Loan", "Home Loan"].map((item, i) => (
                                <ListItem key={i} sx={{ p: 0.5 }}>
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        <CheckCircleIcon sx={{ color: "#1E90FF" }} />
                                    </ListItemIcon>
                                    <ListItemText primary={item} />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                    <Grid item xs={6}>
                        <List dense>
                            {["Gold Loan Per Day", "Mortgage Loan", "Education / Student Loan", "Wedding Loan"].map(
                                (item, i) => (
                                    <ListItem key={i} sx={{ p: 0.5 }}>
                                        <ListItemIcon sx={{ minWidth: 32 }}>
                                            <CheckCircleIcon sx={{ color: "#1E90FF" }} />
                                        </ListItemIcon>
                                        <ListItemText primary={item} />
                                    </ListItem>
                                )
                            )}
                        </List>
                    </Grid>
                </Grid>
            </Grid>

            {/* RIGHT SIDE */}
            <Grid
                item
                xs={12}
                top={-10}
                md={6}
                sx={{
                    display: "absolute",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <TrustedCompanyCard />
            </Grid>
        </Grid>
    );
}
