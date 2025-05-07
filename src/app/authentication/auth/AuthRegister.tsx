import React, { useState } from 'react';
import { Box, Typography, Button, Grid, Snackbar, Alert, CircularProgress } from '@mui/material';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { useRouter } from "next/navigation";

interface RegisterType {
    title?: string;
    subtitle?: JSX.Element | JSX.Element[];
    subtext?: JSX.Element | JSX.Element[];
}

const AuthRegister = ({ title, subtitle, subtext }: RegisterType) => {
    const router = useRouter();
    const [form, setForm] = useState<{
        roleId: string;
        email: string;
        mobileNo: string;
        password: string;
        confirmPassword: string;
        status: string;
    }>({
        roleId: '',
        email: '',
        mobileNo: '',
        password: '',
        confirmPassword: '',
        status: '',
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [responseMessage, setResponseMessage] = useState(false);
    const [registerErrorMessage, setRegisterErrorMessage] = useState(false);

    const validate = () => {
        let tempErrors: { [key: string]: string } = {};

        if (!form.email) tempErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) tempErrors.email = 'Invalid email format';

        if (!form.mobileNo) tempErrors.mobileNo = 'Phone number is required';
        else if (!/^\d{10}$/.test(form.mobileNo)) tempErrors.mobileNo = 'Invalid Mobile number';

        if (!form.password) tempErrors.password = 'Password is required';
        else if (form.password.length < 8) tempErrors.password = 'Password must be at least 8 characters';

        if (!form.confirmPassword) tempErrors.confirmPassword = 'Confirm password is required';
        else if (form.password !== form.confirmPassword) tempErrors.confirmPassword = 'Passwords do not match';

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleChange = (e: any) => {
        const { id, value } = e.target;
        setForm({ ...form, [id]: value });
        handleBlur(e);
    };

    const handleBlur = (e: any) => {
        const { id, value } = e.target;
        let tempErrors = { ...errors };

        switch (id) {
            case 'email':
                if (!value) tempErrors.email = 'Email is required';
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) tempErrors.email = 'Invalid email format';
                else tempErrors.email = '';
                break;
            case 'mobileNo':
                if (!value) tempErrors.mobileNo = 'Phone number is required';
                else if (!/^\d{10}$/.test(value)) tempErrors.mobileNo = 'Invalid phone number';
                else tempErrors.mobileNo = '';
                break;
            case 'password':
                if (!value) tempErrors.password = 'Password is required';
                else if (value.length < 8) tempErrors.password = 'Password must be at least 8 characters';
                else tempErrors.password = '';
                break;
            case 'confirmPassword':
                if (!value) tempErrors.confirmPassword = 'Confirm password is required';
                else if (value !== form.password) tempErrors.confirmPassword = 'Passwords do not match';
                else tempErrors.confirmPassword = '';
                break;
            default:
                break;
        }

        setErrors(tempErrors);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            setLoading(true);
            setRegisterErrorMessage(false)
            const response = await fetch('http://localhost:4000/user/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    roleId: 3,
                    email: form.email,
                    mobileNo: form.mobileNo,
                    password: form.password,
                    status: 'Enable',
                }),
            });
            const data = await response.json();
            if (response.ok) {
                setResponseMessage(data.message);
                setLoading(false);
                setOpenSnackbar(true);
                setTimeout(() => {
                    router.push('/authentication/login');
                }, 2000);
            } else {
                setRegisterErrorMessage(data.message);
                setLoading(false);
            }
        } catch (error: any) {
            setLoading(false);
            setRegisterErrorMessage(error.message);
            console.error('Error registering user:', error);
        }
    };
    return (
        <>


            <Box>
                {title && <Typography fontWeight="700" variant="h4" mb={1}>{title}</Typography>}
                {subtext}

                <Box component="form" onSubmit={handleSubmit}>
                    {registerErrorMessage && (
                        <Grid item>
                            <Box
                                sx={{
                                    border: 1,
                                    borderColor: '#ff9999',
                                    p: 0,
                                    mb: 2,
                                    backgroundColor: '#f8bbd0',
                                }}
                            >
                                <Alert severity="error">{registerErrorMessage}</Alert>
                            </Box>
                        </Grid>
                    )}

                    <Grid
                        container
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        spacing={2}
                    >
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="email">
                                Email
                            </Typography>
                            <CustomTextField
                                id="email"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={form.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!errors.email}
                                helperText={errors.email}
                                sx={{
                                    '& .MuiFormHelperText-root': {
                                        textAlign: 'left',
                                        marginLeft: '5px',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="phone">
                                Mobile Number
                            </Typography>
                            <CustomTextField
                                id="mobileNo"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={form.mobileNo}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!errors.mobileNo}
                                helperText={errors.mobileNo}
                                sx={{
                                    '& .MuiFormHelperText-root': {
                                        textAlign: 'left',
                                        marginLeft: '5px',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="password">
                                Password
                            </Typography>
                            <CustomTextField
                                id="password"
                                type="password"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={form.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!errors.password}
                                helperText={errors.password}
                                sx={{
                                    '& .MuiFormHelperText-root': {
                                        textAlign: 'left',
                                        marginLeft: '5px',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="confirmPassword">
                                Confirm Password
                            </Typography>
                            <CustomTextField
                                id="confirmPassword"
                                type="password"
                                variant="outlined"
                                fullWidth
                                size="small"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword}
                                sx={{
                                    '& .MuiFormHelperText-root': {
                                        textAlign: 'left',
                                        marginLeft: '5px',
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                color="primary"
                                variant="contained"
                                size="large"
                                fullWidth
                                type="submit"
                                disabled={loading}
                                sx={{ backgroundColor: "brown" }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    "Sign Up"
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
                {subtitle}
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={() => setOpenSnackbar(false)}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                        {responseMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </>
    );
};

export default AuthRegister;
