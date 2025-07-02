"use client";
import { ReactNode, useState } from "react";
import Sidebar from "./sidebar";
import Header from "./header";
import { Box } from "@mui/material";

export default function RootLayout({ children }: { children: ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        if (typeof window !== "undefined" && window.innerWidth < 768) {
            setMobileSidebarOpen(!isMobileSidebarOpen);
        } else {
            setSidebarOpen(!isSidebarOpen);
        }
    };

    return (
        <Box sx={{ display: "flex", height: "100vh" }}>
            <Sidebar isOpen={isSidebarOpen} isMobileOpen={isMobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
            <Box sx={{ flexGrow: 1 }}>
                <Header toggleSidebar={toggleSidebar} />
                <Box sx={{ p: 2 }}>{children}</Box>
            </Box>
        </Box>
    );
}
