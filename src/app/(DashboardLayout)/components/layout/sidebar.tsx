"use client";
import React from "react";
import {
    Box,
    Drawer,
    IconButton,
    Typography,
    useMediaQuery,
    Tooltip,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { menuItems } from "./menuItems";

const drawerWidth = 240;

type Props = {
    isOpen: boolean;
    isMobileOpen: boolean;
    onClose: () => void;
};

export default function Sidebar({ isOpen, isMobileOpen, onClose }: Props) {
    const isMobile = useMediaQuery("(max-width:768px)");
    const router = useRouter();

    const getRoleId = () => {
        if (typeof window !== "undefined") {
            const storedRole = localStorage.getItem("roleId");
            const roleId = storedRole ? parseInt(storedRole, 10) : null;
            return roleId;
        }
    }
    const roleId = getRoleId();
    const currentMenuItems = (roleId && menuItems[roleId]) ? menuItems[roleId] : [];

    const renderMenu = () => (
        <Box sx={{ display: "flex", flexDirection: "column", p: 1, gap: 1 }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isOpen || isMobile ? "flex-start" : "center",
                    p: 1,
                    mb: 2,
                }}
            >
                {(!isOpen && !isMobile) && (
                    <Box
                        component="img"
                        src="/logo-transparent-small-png.png"
                        alt="App Icon"
                        sx={{ height: 40, width: 40, transition: "all 0.3s" }}
                    />
                )}
                {(isOpen || isMobile) && (
                    <Box
                        component="img"
                        src="/images/logos/logo.png"
                        alt="App Logo"
                        sx={{ height: 50, width: "auto", transition: "all 0.3s", }}
                    />
                )}
            </Box>
            {/* ✅ Dynamic Menu Items */}
            {currentMenuItems.map((item: any) => (
                <Tooltip
                    key={item.label}
                    title={!isOpen && !isMobile ? item.label : ""}
                    placement="right"
                    arrow
                >
                    <Box
                        onClick={() => {
                            router.push(item.route);
                            if (isMobile) onClose();
                        }}
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            p: 1,
                            borderRadius: 2,
                            cursor: "pointer",
                            "&:hover": { backgroundColor: "#f5f5f5" },
                            justifyContent: isOpen || isMobile ? "flex-start" : "center",
                        }}
                    >
                        <IconButton size="small">{item.icon}</IconButton>
                        {(isOpen || isMobile) && (
                            <Typography sx={{ ml: 1 }}>{item.label}</Typography>
                        )}
                    </Box>
                </Tooltip>
            ))}
        </Box>
    );

    return isMobile ? (
        <Drawer anchor="left" open={isMobileOpen} onClose={onClose}>
            <Box sx={{ width: drawerWidth }}>{renderMenu()}</Box>
        </Drawer>
    ) : (
        <Drawer
            variant="permanent"
            open={isOpen}
            sx={{
                width: isOpen ? drawerWidth : 64,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: isOpen ? drawerWidth : 64,
                    overflowX: "hidden",
                    transition: "width 0.3s",
                    boxSizing: "border-box",
                },
            }}
        >
            {renderMenu()}
        </Drawer>
    );
}
