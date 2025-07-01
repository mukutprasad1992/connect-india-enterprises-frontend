"use client";
import { styled, Container, Box } from "@mui/material";
import React, { useState } from "react";
import Header from "@/app/(DashboardLayout)/layout/header/Header";
import Sidebar from "@/app/(DashboardLayout)/layout/sidebar/MSidebar";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  maxWidth: "100%",
  overflowX: "auto",
}));

const PageWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "isSidebarOpen",
})<{ isSidebarOpen: boolean }>(({ isSidebarOpen }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
  paddingBottom: "60px",
  backgroundColor: "transparent",
  transition: "padding-left 0.3s ease",
  boxSizing: 'border-box',
  "@media (max-width: 1200px)": {
    paddingLeft: 0
  },
}));

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleMobileSidebar = () => setMobileSidebarOpen((prev) => !prev);
  const handleSidebarClose = () => setMobileSidebarOpen(false);

  return (
    <MainWrapper className="mainwrapper">
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={handleSidebarClose}
        toggleMobileSidebar={toggleMobileSidebar}
      />

      <PageWrapper isSidebarOpen={isSidebarOpen}>
        <Header
          toggleMobileSidebar={toggleMobileSidebar}
          toggleSidebar={toggleSidebar}
        />
        <Container
          sx={{
            paddingTop: "20px",
            maxWidth: "100%",
          }}
        >
          <Box sx={{ minHeight: "calc(100vh - 170px)" }}>
            {children}
          </Box>
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
}
