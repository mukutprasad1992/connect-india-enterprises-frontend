"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    Divider,
    TextField,
    Button,
    useMediaQuery,
    useTheme,
    Menu,
    MenuItem,
    Avatar,
    Fade,
    Collapse,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface ChatPopupProps {
    chat: {
        sender: string;
        message: string;
        email?: string;
        mobile?: string;
        image?: string;
    };
    onClose: () => void;
}

const ChatPopup: React.FC<ChatPopupProps> = ({ chat, onClose }) => {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [profileOpen, setProfileOpen] = useState(false);
    const [blocked, setBlocked] = useState(false);
    const [minimized, setMinimized] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

    const popupRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const width = isMobile ? "95vw" : isTablet ? "80vw" : 300;
    const fullHeight = isMobile ? "100vh" : 415;

    useEffect(() => {
        const stored = localStorage.getItem(`chat_${chat.sender}`);
        if (stored) setMessages(JSON.parse(stored));
        const isBlocked = localStorage.getItem(`blocked_${chat.sender}`);
        setBlocked(isBlocked === "true");
    }, [chat.sender]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const saveToLocalStorage = (updatedMessages: string[]) => {
        localStorage.setItem(`chat_${chat.sender}`, JSON.stringify(updatedMessages));
    };

    const handleSend = () => {
        if (blocked || input.trim() === "") return;
        const updated = [...messages, input.trim()];
        setMessages(updated);
        saveToLocalStorage(updated);
        setInput("");
    };

    const handleDeleteUser = () => {
        localStorage.removeItem(`chat_${chat.sender}`);
        localStorage.removeItem(`blocked_${chat.sender}`);
        setMessages([]);
        setBlocked(false);
        setProfileOpen(false);
        setAnchorEl(null);
    };

    const handleBlockUser = () => {
        const newBlocked = !blocked;
        localStorage.setItem(`blocked_${chat.sender}`, String(newBlocked));
        setBlocked(newBlocked);
        setAnchorEl(null);
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const toggleMinimize = () => setMinimized((prev) => !prev);

    return (
        <Box
            ref={popupRef}
            sx={{
                position: "fixed",
                left: isMobile || isTablet ? 10 : 'calc(100vw - 655px)',
                bottom: 0,
                zIndex: 1300,
                width,
                height: minimized ? "auto" : fullHeight,
                bgcolor: "background.paper",
                borderRadius: 1,
                boxShadow: 3,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    px: 1,
                    py: 0.5,
                    bgcolor: "primary.main",
                    color: "white",
                    cursor: "pointer",
                }}
                onClick={toggleMinimize}
            >
                <Box display="flex" alignItems="center" gap={1}>
                    <Avatar
                        src={chat.image}
                        sx={{ width: 36, height: 36, bgcolor: chat.image ? "transparent" : "#ffffff33" }}
                    >
                        {!chat.image && chat.sender[0]?.toUpperCase()}
                    </Avatar>
                    <Typography fontWeight={600}>{chat.sender}</Typography>
                </Box>
                <Box>
                    {!minimized && (
                        <>
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setAnchorEl(e.currentTarget);
                                }}
                                sx={{ color: "white" }}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClose();
                                }}
                                sx={{ color: "white" }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </>
                    )}
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            toggleMinimize();
                        }}
                        sx={{ color: "white" }}
                    >
                        {minimized ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                </Box>
            </Box>

            {/* Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                TransitionComponent={Fade}
            >
                <MenuItem
                    onClick={() => {
                        setProfileOpen(true);
                        setAnchorEl(null);
                    }}
                >
                    View Profile
                </MenuItem>
                <MenuItem onClick={handleBlockUser}>
                    {blocked ? "Unblock User" : "Block User"}
                </MenuItem>
                <MenuItem onClick={handleDeleteUser}>Delete User</MenuItem>
            </Menu>

            {/* Body */}
            <Collapse in={!minimized} timeout="auto" unmountOnExit>
                {profileOpen ? (
                    <Box p={2} sx={{ flex: 1, overflowY: "auto" }}>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Avatar src={chat.image} sx={{ width: 60, height: 60, fontSize: 24 }}>
                                {!chat.image && chat.sender[0]?.toUpperCase()}
                            </Avatar>
                            <Box sx={{ color: 'black' }}>
                                <Typography variant="h6">{chat.sender}</Typography>
                                <Typography variant="body2">{chat.email || "No email provided"}</Typography>
                                <Typography variant="body2">{chat.mobile || "No mobile provided"}</Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        <Button
                            variant="outlined"
                            color={blocked ? "success" : "warning"}
                            onClick={handleBlockUser}
                            fullWidth
                            sx={{ mb: 1 }}
                        >
                            {blocked ? "Unblock User" : "Block User"}
                        </Button>

                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleDeleteUser}
                            fullWidth
                            sx={{ mb: 1 }}
                        >
                            Delete User
                        </Button>

                        <Button
                            variant="contained"
                            onClick={() => setProfileOpen(false)}
                            fullWidth
                        >
                            Close Profile
                        </Button>
                    </Box>
                ) : (
                    <>
                        <Divider />
                        <Box
                            sx={{
                                height: 320,
                                p: 2,
                                overflowY: "auto",
                                bgcolor: "#f9f9f9",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            <Box
                                sx={{
                                    bgcolor: "#edebeb",
                                    p: 1.2,
                                    color: '#4d4c4c',
                                    borderRadius: 2,
                                    maxWidth: "70%",
                                    mb: 1,
                                    alignSelf: "flex-start",
                                }}
                            >
                                <Typography variant="body2">{chat.message}</Typography>
                            </Box>

                            {messages.map((msg, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        bgcolor: "#a4d4f5",
                                        color: "#4d4c4c",
                                        p: 1.2,
                                        borderRadius: 2,
                                        maxWidth: "70%",
                                        mb: 1,
                                        alignSelf: "flex-end",
                                    }}
                                >
                                    <Typography variant="body2">{msg}</Typography>
                                </Box>
                            ))}
                            <div ref={messagesEndRef} />
                        </Box>

                        <Divider />

                        <Box sx={{ p: 1, display: "flex", gap: 1 }}>
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
                    </>
                )}
            </Collapse>
        </Box>
    );
};

export default ChatPopup;
