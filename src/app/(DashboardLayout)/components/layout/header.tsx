"use client";
import {
    AppBar,
    Toolbar,
    IconButton,
    Tooltip,
    Box,
    Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationComponent from "../../components/notification/notificationComponent";
import MessageComponent from "../message/MessageComponent";
import Profile from "../layout/Profile";
import Notification from "../../utilities/notification/page";

export default function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
    return (
        <AppBar position="static" sx={{ backgroundColor: "grey" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                    <Tooltip title="Toggle Sidebar" arrow>
                        <IconButton color="inherit" edge="start" onClick={toggleSidebar}>
                            <MenuIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <MessageComponent />
                    {/* <NotificationComponent /> */}
                    <Box flexGrow={40} />
                    <Notification />
                    <Box />
                    <Stack direction="row" alignItems="center">
                        <Profile />
                    </Stack>
                    {/* <ProfileComponent /> */}
                </Box>
            </Toolbar>
        </AppBar>
    );
}
