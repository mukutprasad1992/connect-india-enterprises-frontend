"use client";

import { useEffect, useState } from "react";
import {
    Tooltip,
    IconButton,
    Badge,
    Popover,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Typography,
    Box,
    IconButton as MuiIconButton,
    Chip,
    Button,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import CloseIcon from "@mui/icons-material/Close";
import ChatPopup from "./ChatPopup";
import AddUserComponent from "./AddUserComponent"; // ✅ import modular component

interface Message {
    sender: string;
    message: string;
    time: string;
    read: boolean;
    email?: string;
    mobile?: string;
    image?: string;
}

const MessageComponent = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedChat, setSelectedChat] = useState<Message | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [addOpen, setAddOpen] = useState(false); // for AddUserComponent

    const staticUsers: Message[] = [
        {
            sender: "Anil",
            message: "Hi Anil!",
            time: "2025-06-25T10:15:00",
            read: false,
            email: "anil@example.com",
            mobile: "9999999999",
        },
        {
            sender: "Riya",
            message: "Hello Riya!",
            time: "2025-06-25T09:45:00",
            read: false,
            email: "riya@example.com",
            mobile: "8888888888",
        },
        {
            sender: "Manager",
            message: "Manager joined chat",
            time: "2025-06-24T15:30:00",
            read: true,
            email: "manager@example.com",
            mobile: "7777777777",
        },
    ];

    // 🔁 Load all messages
    useEffect(() => {
        const stored = localStorage.getItem("message_list");
        const storedUsers: Message[] = stored ? JSON.parse(stored) : [];

        const combined = [...storedUsers];

        staticUsers.forEach((staticUser) => {
            const exists = storedUsers.find((u) =>
                u.email === staticUser.email || u.mobile === staticUser.mobile
            );
            if (!exists) combined.push(staticUser);
        });

        const updated = combined.map((msg) => {
            const history = localStorage.getItem(`chat_${msg.sender}`);
            if (history) {
                const chatArr = JSON.parse(history);
                const last = chatArr[chatArr.length - 1];
                return {
                    ...msg,
                    message: last?.message || msg.message,
                    time: last?.time || msg.time,
                };
            }
            return msg;
        });

        updated.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

        setMessages(updated);
    }, [selectedChat, addOpen]);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMessageClick = (msg: Message) => {
        const updated = messages.map((m) =>
            m.sender === msg.sender ? { ...m, read: true } : m
        );
        setMessages(updated);

        const dynamicOnly = updated.filter(
            (m) => !staticUsers.find((s) => s.email === m.email || s.mobile === m.mobile)
        );
        localStorage.setItem("message_list", JSON.stringify(dynamicOnly));

        setSelectedChat(msg);
        setAnchorEl(null);
    };

    const unreadCount = messages.filter((m) => !m.read).length;

    return (
        <>
            {/* 🔔 Message Icon */}
            <Tooltip title="Messages" arrow>
                <IconButton color="inherit" onClick={handleClick}>
                    <Badge badgeContent={unreadCount} color="error">
                        <MailIcon />
                    </Badge>
                </IconButton>
            </Tooltip>

            {/* 📥 Message Popover */}
            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                PaperProps={{ sx: { width: 320, p: 1 } }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" px={2} pt={1}>
                    <Typography variant="h6">Messages</Typography>
                    <Box>
                        <Button size="small" onClick={() => setAddOpen(true)} sx={{ mr: 1 }}>
                            + Add
                        </Button>
                        <MuiIconButton onClick={handleClose} size="small">
                            <CloseIcon fontSize="small" />
                        </MuiIconButton>
                    </Box>
                </Box>

                <List dense>
                    {messages.map((msg, index) => (
                        <ListItem
                            key={index}
                            divider
                            button
                            onClick={() => handleMessageClick(msg)}
                            sx={{ bgcolor: !msg.read ? "#e3f2fd" : "inherit" }}
                        >
                            <ListItemAvatar>
                                <Avatar src={msg.image}>{!msg.image && msg.sender[0]}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <>
                                        <strong>{msg.sender}</strong>{" "}
                                        •{" "}
                                        {new Date(msg.time).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                        {!msg.read && (
                                            <Chip
                                                label="Unread"
                                                size="small"
                                                color="primary"
                                                sx={{ ml: 1 }}
                                            />
                                        )}
                                    </>
                                }
                                secondary={msg.message}
                            />
                        </ListItem>
                    ))}
                </List>
            </Popover>

            {/* 💬 Chat popup */}
            {selectedChat && (
                <ChatPopup chat={selectedChat} onClose={() => setSelectedChat(null)} />
            )}

            {/* ➕ AddUserComponent */}
            <AddUserComponent
                open={addOpen}
                onClose={() => setAddOpen(false)}
                onUserAdded={() => {
                    setAddOpen(false);
                    setSelectedChat(null); // to trigger refresh
                }}
            />
        </>
    );
};

export default MessageComponent;
