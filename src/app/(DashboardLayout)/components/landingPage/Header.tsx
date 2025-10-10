'use client';
import React from 'react';
import Link from 'next/link';
import { AppBar, Toolbar, Typography, Grid, Stack, useMediaQuery, useTheme, Button, Box } from '@mui/material';
import { Facebook, Twitter, Pinterest, Instagram } from '@mui/icons-material';
import Logo from '../layout/Logo';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const router = useRouter();
    return (
        <Grid container direction="column">
            {/* Top Bar */}


            {/* Main Navigation */}
            <AppBar position="static" elevation={0} sx={{ backgroundColor: '#ffffff' }}>
                <Toolbar sx={{ justifyContent: 'space-between', flexWrap: 'wrap', px: { xs: 2, md: 10 } }}>
                    {/* Logo */}
                    <Grid item>
                        <Logo />
                    </Grid>

                    {/* Call to Action */}
                    <Grid item>
                        <Stack
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                            spacing={2}
                            sx={{ mt: { xs: 1, md: 0 }, width: "100%" }}
                        >
                            {/* LEFT SIDE - Icon + Texts */}
                            <Stack direction="row" alignItems="center" spacing={1}>
                                {/* Icon */}
                                <Stack
                                    alignItems="center"
                                    justifyContent="center"
                                    sx={{
                                        border: "1px solid #112d49ff",
                                        borderRadius: "50%",
                                        p: 1,
                                        minWidth: 40,
                                        minHeight: 40,
                                    }}
                                >
                                    <SupportAgentOutlinedIcon sx={{ color: "#000" }} />
                                </Stack>

                                {/* Call Info */}
                                <Box>
                                    <Typography sx={{ fontWeight: "bold", color: "#000", lineHeight: 1.2 }}>
                                        Call Anytime
                                    </Typography>
                                    <Typography sx={{ fontWeight: "bold", color: "#000", lineHeight: 1.2 }}>
                                        +91 7898191919
                                    </Typography>
                                </Box>
                            </Stack>

                            {/* RIGHT SIDE - Login Button */}
                            <Button
                                sx={{
                                    color: "white",
                                    borderRadius: 1.5,
                                    backgroundColor: "blue",
                                    px: 3,
                                    py: 0.8,
                                    fontWeight: "bold",
                                    "&:hover": { backgroundColor: "#1565c0" },
                                }}
                                onClick={() => router.push("/authentication/login")}
                            >
                                Login
                            </Button>
                        </Stack>
                    </Grid>
                </Toolbar>
            </AppBar>
        </Grid>
    );
};

export default Header;
