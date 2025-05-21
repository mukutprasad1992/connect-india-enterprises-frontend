"use client";

import { usePathname } from "next/navigation";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import { baselightTheme } from "@/utils/theme/DefaultColors";
import React from "react";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = [
        "/authentication/register",
        "/authentication/login",
        "/authentication/forgotPassword",
        "/authentication/resetPassword",
    ].includes(pathname);

    return (
        <ThemeProvider theme={baselightTheme}>
            <CssBaseline />
            {isAuthPage ? (
                <Box
                    sx={{
                        backgroundImage: "url(https://picsum.photos/1000/700)",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backdropFilter: "blur(5px)",
                        minHeight: "100vh",
                    }}
                >
                    {children}
                </Box>
            ) : (
                children
            )}
        </ThemeProvider>
    );
}
