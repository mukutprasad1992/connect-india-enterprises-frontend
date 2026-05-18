"use client";

import { useEffect, useState } from "react";
import {
    Tooltip,
    IconButton,
    Badge,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
    Box,
    Chip,
    Paper,
    Menu,
    MenuItem,
    Divider,
    useTheme,
    useMediaQuery,
} from "@mui/material";

import MailIcon from "@mui/icons-material/Mail";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import ChatPopup from "./ChatPopup";

interface Message {
    sender: string;
    message: string;
    time: string;
    read: boolean;
    mobile?: string;
    image?: string;
}

const MessageComponent = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

    const [isOpen, setIsOpen] = useState(true);
    const [minimized, setMinimized] = useState(false);
    const [selectedChat, setSelectedChat] = useState<Message | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [profileView, setProfileView] = useState(false);
    const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);
    const [profileData, setProfileData] = useState({ name: "", mobile: "", image: "" });

    const getToken = () => {
        if (typeof window !== "undefined") {
            return localStorage.getItem('accessToken');
        }
    };

    const token = getToken();
    const getRoleId = () => {
        if (typeof window !== "undefined") {
            const storedRole = localStorage.getItem("roleId");
            const roleId = storedRole ? parseInt(storedRole, 10) : null;
            return roleId;
        }
    }
    const roleId = getRoleId();
    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/getAllVendor`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await res.json();

                if (data.status && Array.isArray(data.data)) {
                    const vendorMessages: Message[] = data.data.map((vendor: any) => {
                        const name = vendor.businessRepresentative || vendor.businessName || "Vendor";
                        const chatHistory = localStorage.getItem(`chat_${name}`);
                        let lastMsg = vendor.businessName;
                        let lastTime = vendor.createdAt;

                        if (chatHistory) {
                            const chats = JSON.parse(chatHistory);
                            const last = chats[chats.length - 1];
                            if (last) {
                                lastMsg = last.message;
                                lastTime = last.time;
                            }
                        }

                        return {
                            sender: name,
                            message: lastMsg,
                            time: lastTime,
                            read: false,
                            mobile: vendor.mobileNo,
                            image: vendor.profileImageURL || undefined,
                        };
                    });

                    vendorMessages.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
                    setMessages(vendorMessages);
                }
            } catch (error) {
                console.error("Failed to fetch vendors:", error);
            }
        };

        if (roleId === 1) {
            fetchVendors();
        }
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (user) {
            setProfileData({
                name: `${user.firstName?.trim() || ""} ${user.lastName?.trim() || ""}`,
                mobile: user.mobileNo,
                image: user.profileImageURL || "",
            });
        }
    }, []);

    const handleMessageClick = (msg: Message) => {
        const updated = messages.map((m) =>
            m.sender === msg.sender ? { ...m, read: true } : m
        );
        setMessages(updated);
        setSelectedChat(msg);
    };

    const unreadCount = messages.filter((m) => !m.read).length;

    const panelStyle = {
        position: "fixed",
        zIndex: 1300,
        width: isMobile ? "95vw" : isTablet ? "80vw" : 320,
        right: 20,
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        transition: "all 0.3s ease",
        backgroundColor: "#fff",
        ...(minimized ? { bottom: 0, height: 50 } : { top: 80, height: 560 }),
    } as const;

    return (
        <>
            <Tooltip title="Messages" arrow>
                <IconButton color="inherit" onClick={() => setIsOpen(true)}>
                    <Badge badgeContent={unreadCount > 99 ? '99+' : unreadCount} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
            </Tooltip>

            {isOpen && (
                <Paper sx={panelStyle}>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        px={2}
                        sx={{
                            height: 40,
                            bgcolor: "#a4d4f5",
                            color: "#fff",
                            borderBottom: "1px solid #1976d2",
                        }}
                    >
                        <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
                            {profileView ? "Profile" : "Messages"}
                        </Typography>
                        <Box display="flex" alignItems="center">
                            {profileView ? (
                                <IconButton size="small" sx={{ color: "#fff" }} onClick={() => setProfileView(false)}>
                                    <ArrowBackIcon fontSize="small" />
                                </IconButton>
                            ) : (
                                <>
                                    <IconButton
                                        size="small"
                                        sx={{ color: "#fff" }}
                                        onClick={(e) => setAnchorMenu(e.currentTarget)}
                                    >
                                        <MoreVertIcon fontSize="small" />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorMenu}
                                        open={Boolean(anchorMenu)}
                                        onClose={() => setAnchorMenu(null)}
                                        PaperProps={{
                                            sx: {
                                                borderRadius: 2,
                                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                                mt: 1,
                                            },
                                        }}
                                    >
                                        <MenuItem
                                            onClick={() => {
                                                setProfileView(true);
                                                setAnchorMenu(null);
                                            }}
                                        >
                                            My Profile
                                        </MenuItem>
                                    </Menu>
                                    <IconButton
                                        size="small"
                                        sx={{ color: "#fff" }}
                                        onClick={() => setMinimized(!minimized)}
                                    >
                                        {minimized ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        sx={{ color: "#fff" }}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </>
                            )}
                        </Box>
                    </Box>

                    {!minimized && (
                        <Box sx={{ height: 510, overflowY: "auto", p: 2 }}>
                            {profileView ? (
                                <Box>
                                    <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                                        <Avatar src={profileData.image} sx={{ width: 80, height: 80 }}>
                                            {!profileData.image && profileData.name?.[0]}
                                        </Avatar>
                                        <Typography variant="h6" mt={1}>{profileData.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">{profileData.mobile}</Typography>
                                    </Box>
                                    <Divider sx={{ mb: 2 }} />
                                    <Typography variant="subtitle2" color="text.secondary">Your name</Typography>
                                    <Typography variant="body1" fontWeight={500}>{profileData.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        This is not your username or PIN. This name will be visible to your contacts.
                                    </Typography>
                                    <Box mt={2}>
                                        <Typography variant="subtitle2" color="text.secondary">Mobile</Typography>
                                        <Typography variant="body1">{profileData.mobile}</Typography>
                                    </Box>
                                </Box>
                            ) : (
                                <List dense>
                                    {messages.map((msg, index) => (
                                        <ListItem
                                            key={index}
                                            divider
                                            button
                                            onClick={() => handleMessageClick(msg)}
                                            sx={{
                                                bgcolor: !msg.read ? "#e3f2fd" : "inherit",
                                                "&:hover": { backgroundColor: "#f5f5f5" },
                                            }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar src={msg.image}>
                                                    {!msg.image && msg.sender?.[0]}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Box display="flex" alignItems="center">
                                                        <Typography variant="body2" fontWeight="bold">
                                                            {msg.sender}
                                                        </Typography>
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            ml={1}
                                                        >
                                                            {new Date(msg.time).toLocaleTimeString([], {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            })}
                                                        </Typography>
                                                        {!msg.read && (
                                                            <Chip
                                                                label="Unread"
                                                                size="small"
                                                                color="primary"
                                                                sx={{ ml: 1 }}
                                                            />
                                                        )}
                                                    </Box>
                                                }
                                                secondary={msg.message}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </Box>
                    )}
                </Paper>
            )}

            {selectedChat && (
                <ChatPopup chat={selectedChat} onClose={() => setSelectedChat(null)} />
            )}
        </>
    );
};

export default MessageComponent;
