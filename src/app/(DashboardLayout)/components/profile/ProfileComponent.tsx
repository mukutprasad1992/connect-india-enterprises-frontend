"use client";

import { useState } from "react";
import {
    Tooltip,
    IconButton,
    Popover,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Box,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

const ProfileComponent = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => setAnchorEl(null);

    const open = Boolean(anchorEl);
    const id = open ? "profile-popover" : undefined;

    return (
        <>
            <Tooltip title="Profile" arrow>
                <IconButton color="inherit" onClick={handleClick}>
                    <AccountCircleIcon />
                </IconButton>
            </Tooltip>

            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                PaperProps={{ sx: { width: 200 } }}
            >
                <Box p={1}>
                    <Typography variant="subtitle1" textAlign="center" mb={1}>
                    </Typography>
                    <List>
                        <ListItem button>
                            <ListItemIcon><PersonIcon /></ListItemIcon>
                            <ListItemText primary="View Profile" />
                        </ListItem>
                        <ListItem button>
                            <ListItemIcon><SettingsIcon /></ListItemIcon>
                            <ListItemText primary="Settings" />
                        </ListItem>
                        <ListItem button>
                            <ListItemIcon><LogoutIcon /></ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </List>
                </Box>
            </Popover>
        </>
    );
};

export default ProfileComponent;
