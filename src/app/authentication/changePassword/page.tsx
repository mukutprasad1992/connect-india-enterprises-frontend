import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Grid, Button, InputAdornment, IconButton, Snackbar, Alert, CircularProgress,
    Box, Typography
} from '@mui/material';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';

interface PasswordForm {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

interface Props {
    open: boolean;
    onClose: () => void;
}

const ChangePasswordDialog: React.FC<Props> = ({ open, onClose }) => {
    const {
        control,
        handleSubmit,
        reset,
        setError,
        clearErrors,
        formState: { errors }
    } = useForm<PasswordForm>({
        defaultValues: {
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    const [showPassword, setShowPassword] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState('');

    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

    const handleSnackbarClose = () => setSnackbarOpen(false);

    useEffect(() => {
        if (!open) {
            reset();
            setFormError('');
            setShowPassword(false);
            clearErrors();
        }
    }, [open, reset, clearErrors]);

    const showSuccessSnackbar = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const handleDialogClose = () => {
        reset();
        setFormError('');
        setShowPassword(false);
        clearErrors();
        onClose();
    };

    const onSubmit = async (data: PasswordForm) => {
        setFormError('');
        clearErrors();

        if (data.newPassword !== data.confirmPassword) {
            setError("confirmPassword", {
                type: "manual",
                message: "Passwords do not match",
            });
            return;
        }

        if (!BASE_URL || !token) {
            setFormError("Session expired. Please login again.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${BASE_URL}/auth/changePassword`,
                {
                    oldPassword: data.oldPassword,
                    newPassword: data.newPassword,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const resData = response.data;

            if (resData?.status === true) {
                showSuccessSnackbar(resData.message || 'Password changed successfully');
                handleDialogClose();
            } else {
                setFormError(resData.message || 'Password change failed');
            }
        } catch (error: any) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message || error.message
                : 'Something went wrong';
            setFormError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Dialog open={open} onClose={handleDialogClose} maxWidth="xs" fullWidth>
                <DialogTitle>Change Password</DialogTitle>
                <DialogContent>
                    {formError && (
                        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
                            {formError}
                        </Typography>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)} id="change-password-form">
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            {["oldPassword", "newPassword", "confirmPassword"].map((fieldName) => (
                                <Grid item xs={12} key={fieldName}>
                                    <Controller
                                        name={fieldName as keyof PasswordForm}
                                        control={control}
                                        rules={{ required: `${fieldName.replace(/([A-Z])/g, ' $1')} is required` }}
                                        render={({ field, fieldState: { error } }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                type={showPassword ? 'text' : 'password'}
                                                label={
                                                    fieldName === 'oldPassword'
                                                        ? 'Current Password'
                                                        : fieldName === 'newPassword'
                                                            ? 'New Password'
                                                            : 'Confirm Password'
                                                }
                                                error={!!error}
                                                helperText={error?.message}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Lock sx={{ color: 'brown' }} />
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => setShowPassword((p) => !p)}
                                                                edge="end"
                                                            >
                                                                {showPassword ? <VisibilityOff sx={{ color: 'brown' }} /> : <Visibility sx={{ color: 'brown' }} />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions sx={{ mb: 2, mr: 2 }}>
                    <Button onClick={handleDialogClose} color="secondary">Cancel</Button>
                    <Button
                        type="submit"
                        form="change-password-form"
                        color="primary"
                        variant="contained"
                        disabled={loading}

                    >
                        {loading ? <CircularProgress size={22} sx={{ color: '#fff', }} /> : "Update"}
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
