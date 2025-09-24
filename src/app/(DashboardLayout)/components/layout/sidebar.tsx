"use client";
import React from "react";
import {
    Box,
    Drawer,
    IconButton,
    Typography,
    useMediaQuery,
    Tooltip,
    Divider,
    Grid,
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
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
    const pathname = usePathname();

    const getRoleId = () => {
        if (typeof window !== "undefined") {
            const storedRole = localStorage.getItem("roleId");
            const roleId = storedRole ? parseInt(storedRole, 10) : null;
            return roleId;
        }
    };

    const roleId = getRoleId();
    const currentMenuItems = (roleId && menuItems[roleId]) ? menuItems[roleId] : [];
    const renderMenu = () => (
        <Box sx={{ display: "flex", flexDirection: "column", p: 1, gap: 1 }}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isOpen || isMobile ? "flex-start" : "center",
                    p: 0.5,
                }}
            >
                {(!isOpen && !isMobile) && (
                    <Box
                        component="img"
                        src="/logo-transparent-small-png.png"
                        alt="App Icon"
                        sx={{ height: 47, width: 40, transition: "all 0.3s" }}
                    />
                )}
                {(isOpen || isMobile) && (
                    <Grid container alignItems="center" spacing={1}>
                        {/* Logo */}
                        <Grid item>
                            <Box
                                component="img"
                                src="/logo-transparent-small-png.png"
                                alt="App Logo"
                                sx={{ height: 50, width: "auto", transition: "all 0.3s" }}
                            />
                        </Grid>

                        {/* Text section */}
                        <Grid item>
                            <Grid container direction="column">
                                <Grid item sx={{ color: "black", fontFamily: "Corbel", fontSize: 20, fontWeight: 600 }}>
                                    Connect India
                                </Grid>
                                <Grid item sx={{ fontFamily: "Corbel", fontSize: 16, color: "brown", fontWeight: 600 }}>
                                    Enterprises
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>

                )}
            </Box>
            {currentMenuItems.map((item: any) => {
                const isActive = pathname === item.route;

                return (
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
                                p: .5,
                                borderRadius: 2,
                                cursor: "pointer",
                                backgroundColor: isActive ? "#ebf4f5ff" : "transparent",
                                color: isActive ? "#465fff" : "inherit",
                                "&:hover": {
                                    backgroundColor: "#ebf4f5ff",
                                    color: "#465fff",
                                },
                                justifyContent: isOpen || isMobile ? "flex-start" : "center",
                            }}
                        >
                            <IconButton
                                size="small"
                                sx={{
                                    color: isActive ? "#465fff" : "inherit",
                                    "&:hover": {
                                        backgroundColor: "#ebf4f5ff",
                                        color: "#465fff",
                                    },
                                }}
                            >
                                {item.icon}
                            </IconButton>

                            {(isOpen || isMobile) && (
                                <Typography sx={{ ml: 1 }}>{item.label}</Typography>
                            )}
                        </Box>
                    </Tooltip>
                );
            })}
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
