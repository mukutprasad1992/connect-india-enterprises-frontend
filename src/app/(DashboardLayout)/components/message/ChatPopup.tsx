"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
    Box,
    Typography,
    IconButton,
    Divider,
    TextField,
    Button,
    Paper,
    useMediaQuery,
    useTheme,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";

interface ChatPopupProps {
    chat: { sender: string; message: string; email?: string; mobile?: string; image?: string };
    onClose: () => void;
}

const ChatPopup: React.FC<ChatPopupProps> = ({ chat, onClose }) => {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [profileOpen, setProfileOpen] = useState(false);
    const [blocked, setBlocked] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

    const width = isMobile ? 280 : isTablet ? 360 : 400;
    const defaultX = typeof window !== "undefined"
        ? isMobile
            ? (window.innerWidth - width) / 2
            : window.innerWidth - width - 20
        : 20;
    const defaultY = typeof window !== "undefined"
        ? window.innerHeight - 400
        : 100;

    const [position, setPosition] = useState({ x: defaultX, y: defaultY });
    const popupRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const stored = localStorage.getItem(`chat_${chat.sender}`);
        if (stored) {
            setMessages(JSON.parse(stored));
        }

        const isBlocked = localStorage.getItem(`blocked_${chat.sender}`);
        setBlocked(isBlocked === "true");
    }, [chat.sender]);

    const saveToLocalStorage = (updatedMessages: string[]) => {
        localStorage.setItem(`chat_${chat.sender}`, JSON.stringify(updatedMessages));
    };

    const handleSend = () => {
        if (blocked || input.trim() === "") return;
        const updated = [...messages, input];
        setMessages(updated);
        saveToLocalStorage(updated);
        setInput("");
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isMobile) return;
        isDragging.current = true;
        dragStart.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y,
        };
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDragging.current) return;
        setPosition({
            x: e.clientX - dragStart.current.x,
            y: e.clientY - dragStart.current.y,
        });
    };

    const handleMouseUp = useCallback(() => {
        isDragging.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
    }, []);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => setAnchorEl(null);

    const handleViewProfile = () => {
        setProfileOpen(true);
        handleMenuClose();
    };

    const handleDeleteChat = () => {
        localStorage.removeItem(`chat_${chat.sender}`);
        setMessages([]);
        handleMenuClose();
    };

    const handleBlockUser = () => {
        const newBlocked = !blocked;
        localStorage.setItem(`blocked_${chat.sender}`, String(newBlocked));
        setBlocked(newBlocked);
        handleMenuClose();
    };

    useEffect(() => {
        return () => handleMouseUp();
    }, [handleMouseUp]);

    return (
        <div
            ref={popupRef}
            style={{
                position: "fixed",
                left: position.x,
                top: position.y,
                zIndex: 1300,
                width,
                maxWidth: "100vw",
            }}
        >
            <Box
                sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: 8,
                    bgcolor: "white",
                }}
            >
                {/* 🧑 Header */}
                <Box
                    onMouseDown={handleMouseDown}
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        px: 2,
                        py: 1,
                        backgroundColor: "#1976d2",
                        color: "white",
                        cursor: isMobile ? "default" : "move",
                        userSelect: "none",
                    }}
                >
                    <Box display="flex" alignItems="center" gap={1}>
                        <Avatar
                            src={chat.image}
                            sx={{
                                width: 32,
                                height: 32,
                                bgcolor: chat.image ? "transparent" : "#ffffff33",
                                color: "white",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                            }}
                        >
                            {!chat.image && chat.sender[0]}
                        </Avatar>
                        <Typography fontWeight="bold">{chat.sender}</Typography>
                    </Box>

                    <Box display="flex" alignItems="center">
                        <IconButton onClick={handleMenuClick} sx={{ color: "white" }}>
                            <MoreVertIcon />
                        </IconButton>
                        <IconButton onClick={onClose} size="small" sx={{ color: "white" }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>

                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    <MenuItem onClick={handleViewProfile}>View Profile</MenuItem>
                    <MenuItem onClick={handleBlockUser}>
                        {blocked ? "Unblock User" : "Block User"}
                    </MenuItem>
                    <MenuItem onClick={handleDeleteChat}>Delete Chat</MenuItem>
                </Menu>

                <Divider sx={{ my: 1 }} />

                <Box sx={{ p: 2 }}>
                    <Paper
                        variant="outlined"
                        sx={{
                            height: 200,
                            overflowY: "auto",
                            p: 1,
                            mb: 2,
                            bgcolor: "#f5f5f5",
                        }}
                    >
                        <Typography variant="body2" color="text.secondary">
                            {chat.message}
                        </Typography>
                        {messages.map((msg, i) => (
                            <Typography key={i} sx={{ mt: 1, textAlign: "right" }}>
                                {msg}
                            </Typography>
                        ))}
                    </Paper>

                    <Box display="flex" gap={1}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder={blocked ? "User is blocked" : "Type a message..."}
                            value={input}
                            disabled={blocked}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleSend();
                                }
                            }}
                        />
                        <Button variant="contained" onClick={handleSend} disabled={blocked}>
                            Send
                        </Button>
                    </Box>
                </Box>
            </Box>

            <Dialog open={profileOpen} onClose={() => setProfileOpen(false)}>
                <DialogTitle>{chat.sender}&rsquo;s Profile</DialogTitle>
                <DialogContent>
                    <Typography><strong>Email:</strong> {chat.email || "N/A"}</Typography>
                    <Typography><strong>Mobile:</strong> {chat.mobile || "N/A"}</Typography>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ChatPopup;
