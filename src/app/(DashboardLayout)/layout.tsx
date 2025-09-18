"use client";
import { ReactNode, useState } from "react";
import Sidebar from "./components/layout/sidebar";
import Header from "./components/layout/header";
import { Box } from "@mui/material";
import '../styles/common.css';

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
    <Box sx={{ display: "flex", height: "auto", m: 0, }}>
      <Sidebar isOpen={isSidebarOpen} isMobileOpen={isMobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
      <Box sx={{ flexGrow: 1 }}>
        <Header toggleSidebar={toggleSidebar} />
        <Box sx={{ p: 2 }}>{children}</Box>
      </Box>
    </Box>
  );
}
