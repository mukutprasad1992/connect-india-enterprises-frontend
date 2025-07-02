"use client";

import { useState } from "react";
import {
    Tooltip,
    Button,
    Badge,
    Popover,
    List,
    ListItem,
    ListItemText,
    Typography,
    IconButton,
    Box,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CloseIcon from "@mui/icons-material/Close";

const NotificationComponent = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleNotifications = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "notification-popover" : undefined;

    const notifications = [
        "✅ New policy approved",
        "👤 John Doe updated profile",
        "📊 Monthly report available",
    ];

    return (
        <>
            <Tooltip title="Notifications" arrow>
                <Button color="inherit" onClick={handleNotifications}>
                    <Badge badgeContent={notifications.length} color="error">
                        <NotificationsIcon />
                    </Badge>
                </Button>
            </Tooltip>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                }}
                PaperProps={{ sx: { width: 300, p: 1 } }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" px={2} pt={1}>
                    <Typography variant="h6">Notifications</Typography>
                    <IconButton onClick={handleClose} size="small">
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                <List dense>
                    {notifications.map((note, index) => (
                        <ListItem key={index} divider>
                            <ListItemText primary={note} />
                        </ListItem>
                    ))}
                </List>
            </Popover>
        </>
    );
};

export default NotificationComponent;
