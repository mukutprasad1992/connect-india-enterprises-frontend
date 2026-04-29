"use client";
import {
    Toolbar,
    IconButton,
    Tooltip,
    Box,
    Stack,
    Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MessageComponent from "../message/MessageComponent";
import Profile from "../layout/Profile";
import Notification from "../../utilities/notification/page";

export default function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
    return (
        <Box
            sx={{
                position: "sticky",
                top: 0,
                zIndex: 1100,
                bgcolor: "background.paper",
            }}
        >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Tooltip title="Toggle Sidebar" arrow>
                    <IconButton color="primary" edge="start" onClick={toggleSidebar}>
                        <MenuIcon />
                    </IconButton>
                </Tooltip>
                <Stack direction="row" alignItems="center" spacing={2}>
                    {/* <MessageComponent /> */}
                    <Notification />
                    <Profile />
                </Stack>
            </Toolbar>
            <Divider />
        </Box>
    );
}
