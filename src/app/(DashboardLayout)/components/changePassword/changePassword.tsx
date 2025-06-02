"use client";
import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Grid, Button, InputAdornment, IconButton, Snackbar, Alert, CircularProgress,
    Box, Typography
} from '@mui/material';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';

interface Props {
    open: boolean;
    onClose: () => void;
}

const ChangePasswordDialog: React.FC<Props> = ({ open, onClose }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const router = useRouter();
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    const handleClose = () => {
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setShowPassword(false);
        onClose();
    };

    const handleSnackbarClose = () => setSnackbarOpen(false);

    const showSuccess = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const handlePasswordChange = async () => {
        setError('');

        if (!oldPassword || !newPassword || !confirmPassword) {
            setError('All fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match');
            return;
        }

        if (!BASE_URL || !token) {
            setError('Session expired. Please login again.');
            return;
        }
        if (token) {
            const decoded: any = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.clear();
                router.push("/authentication/login");
            }
        } else {
            localStorage.clear();
            router.push("/authentication/login");
        }
        setLoading(true);
        try {
            const response = await axios.post(
                `${BASE_URL}/auth/changePassword`,
                { oldPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data?.status === true) {
                showSuccess(response.data.message || 'Password updated');
                handleClose();
            } else {
                setError(response.data.message || 'Update failed');
            }
        } catch (err: any) {
            const message = axios.isAxiosError(err)
                ? err.response?.data?.message || err.message
                : 'Something went wrong';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!open) {
            handleClose();
        }
    }, [open]);

    return (
        <Box>
            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    {error && (
                        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                            {error}
                        </Typography>
                    )}
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                label="Current Password"
                                value={oldPassword}
                                placeholder='Enter current password'
                                onChange={(e) => setOldPassword(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock sx={{ color: 'brown' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(p => !p)} edge="end">
                                                {showPassword
                                                    ? <VisibilityOff sx={{ color: 'brown' }} />
                                                    : <Visibility sx={{ color: 'brown' }} />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                label="New Password"
                                value={newPassword}
                                placeholder='Enter new password'
                                onChange={(e) => setNewPassword(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock sx={{ color: 'brown' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(p => !p)} edge="end">
                                                {showPassword
                                                    ? <VisibilityOff sx={{ color: 'brown' }} />
                                                    : <Visibility sx={{ color: 'brown' }} />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                type={showPassword ? 'text' : 'password'}
                                label="Confirm Password"
                                value={confirmPassword}
                                placeholder='Enter confirm password'
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock sx={{ color: 'brown' }} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(p => !p)} edge="end">
                                                {showPassword
                                                    ? <VisibilityOff sx={{ color: 'brown' }} />
                                                    : <Visibility sx={{ color: 'brown' }} />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ mb: 2, mr: 2 }}>
                    <Button onClick={handleClose} color="secondary">Cancel</Button>
                    <Button
                        onClick={handlePasswordChange}
                        color="primary"
                        variant="contained"
                        disabled={loading}
                    >
                        {loading
                            ? <CircularProgress size={22} sx={{ color: '#fff' }} />
                            : "Update"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{ zIndex: 2000 }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ChangePasswordDialog;
