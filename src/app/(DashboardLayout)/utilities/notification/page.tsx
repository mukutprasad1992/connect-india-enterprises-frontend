'use client';

import React, { useEffect, useState } from 'react';
import {
    IconButton, Badge, Menu, MenuItem, Dialog,
    DialogTitle, DialogContent, List, ListItem, ListItemText,
    Button, Box, Typography, Divider, Tooltip
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

const ITEMS_PER_PAGE = 5;

const Notification = () => {
    const [anchorEl, setAnchorEl] = useState<null | any>(null);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<any | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const router = useRouter();
    const open = Boolean(anchorEl);

    const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);
    const getRoleId = () => typeof window !== 'undefined' ? parseInt(localStorage.getItem('roleId') || '0', 10) : null;
    const getUserId = () => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('user');
            try {
                return user ? JSON.parse(user).id : null;
            } catch (e) {
                console.error('Error parsing user from localStorage', e);
            }
        }
        return null;
    };

    const token = getToken();
    const roleId = getRoleId();
    const userId = getUserId();

    useEffect(() => {
        if (!token || !roleId) {
            localStorage.clear();
            router.push('/authentication/login');
        }
        if (token) {
            const decoded: any = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.clear();
                router.push('/authentication/login');
            }
        } else {
            localStorage.clear();
            router.push('/authentication/login');
        }
    }, [router, token]);

    useEffect(() => {
        if (token) {
            fetchNotifications(userId);
            const intervalId = setInterval(() => fetchNotifications(userId), 10000);
            return () => clearInterval(intervalId);
        }
    }, [token, roleId]);

    const handleClick = async (event: any) => {
        setAnchorEl(event.currentTarget);
        await fetchNotifications(userId);
    };

    const handleClose = () => setAnchorEl(null);
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    const handleNotificationClick = async (notification: any) => {
        setSelectedNotification(notification);
        await updateIsRead(notification.id);
        setDialogOpen(true);
        handleClose();
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedNotification(null);
    };

    const fetchNotifications = async (userId: number | null) => {
        if (!token) {
            localStorage.clear();
            router.push("/authentication/login");
        }
        if (token) {
            const decoded: any = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.clear();
                router.push("/authentication/login");
            }
        }
        try {
            const res = await axios.get(`${BASE_URL}/notification/getAllUserNotification`, { headers: { Authorization: `Bearer ${token}` } });
            const data = res.data.result || [];
            setNotifications(data);
            setUnreadCount(data.filter((n: any) => n.isRead === 0).length);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        }
    };

    const updateIsRead = async (id: number) => {

        if (!token) {
            localStorage.clear();
            router.push("/authentication/login");
        };
        if (token) {
            const decoded: any = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.clear();
                router.push("/authentication/login");
            }
        }
        try {
            const res = await axios.put(`${BASE_URL}/notification/updateisRead/${id}`, null, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.status === 200) {
                fetchNotifications(userId);
            }
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const markAllAsRead = async () => {
        if (!token || notifications.length === 0) return;
        const unread = notifications.filter(n => n.isRead === 0);
        await Promise.all(unread.map(n => updateIsRead(n.id)));
    };

    const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE);
    const paginatedNotifications = notifications.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    function extractMessageBody(htmlString: string): string {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const messageBody = doc.querySelector('.header');
        return messageBody ? messageBody.outerHTML : 'No message available.';
    }
    return (
        <>
            <Tooltip title="Notification">
                <IconButton color="inherit" onClick={handleClick}>
                    <Badge badgeContent={unreadCount} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: 400,
                        width: 350,
                        overflowY: 'auto',
                    },
                }}
            >
                <Box p={1} display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1">Notifications</Typography>
                    {notifications.some(n => n.isRead === 0) && (
                        <Button onClick={markAllAsRead} size="small">
                            Mark All as Read
                        </Button>
                    )}
                </Box>

                {paginatedNotifications.length > 0 ? (
                    paginatedNotifications.map((notification) => (
                        <MenuItem
                            key={notification.id}
                            onClick={() => handleNotificationClick(notification)}
                            sx={{
                                minHeight: 30,
                                ...(notification.isRead === 0 && {
                                    bgcolor: 'grey.300',
                                }),
                            }}
                        >
                            <Typography
                                variant="body2"
                                dangerouslySetInnerHTML={{ __html: extractMessageBody(notification.message) }}
                                sx={{
                                    fontSize: '0.8rem',
                                    whiteSpace: 'normal',
                                    overflow: 'visible',
                                    textOverflow: 'unset',
                                    wordBreak: 'break-word',
                                    display: 'block',
                                    maxWidth: '100%',
                                }}
                            />
                        </MenuItem>
                    ))
                ) : (
                    <MenuItem disabled>No notifications</MenuItem>
                )}

                <Box display="flex" justifyContent="space-between" px={2} py={1}>
                    <Button
                        size="small"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => prev - 1)}
                    >
                        Prev
                    </Button>
                    <Typography variant="caption">Page {currentPage} of {totalPages}</Typography>
                    <Button
                        size="small"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                    >
                        Next
                    </Button>
                </Box>
            </Menu>


            <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    Notification Details
                    <IconButton
                        aria-label="close"
                        onClick={handleDialogClose}
                        sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
                    >
                        ✕
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedNotification && (
                        <>
                            <Box mb={2}>
                                <Typography variant="h6" color="primary">Notification</Typography>
                                <Divider sx={{ marginY: 1 }} />
                                <Typography variant="body1" dangerouslySetInnerHTML={{ __html: selectedNotification.message }} />
                            </Box>
                            {/* <Box mb={2}>
                                <Typography variant="h6" color="primary">Details</Typography>
                                <Divider sx={{ marginY: 1 }} />
                                <List>
                                    {Object.entries(selectedNotification).map(([key, value]) => (
                                        key !== 'message' && (
                                            <ListItem key={key}>
                                                <ListItemText primary={key} secondary={String(value)} />
                                            </ListItem>
                                        )
                                    ))}
                                </List>
                            </Box> */}
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};
export default Notification;
