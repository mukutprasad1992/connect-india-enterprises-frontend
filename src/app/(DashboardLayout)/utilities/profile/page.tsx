"use client";
import React, { useEffect, useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Card,
    Grid,
    IconButton,
    TextField,
    Typography,
    Divider,
    InputAdornment,
    Snackbar,
    Alert,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useRouter } from 'next/navigation';

interface ProfileData {
    email: string;
    firstName: string;
    lastName: string;
    businessName: string;
    businessRepresentative: string;
    address: string;
    vendorCode: string;
    pinCode: string;
    profileImageURL: string;
    profileImageKey: string
    dateOfBirth: string;
    mobileNo: string;
}
import {
    Email,
    Person,
    Business,
    Badge,
    Home,
    Pin,
    Image,
    Cake,
    Phone,
    Code,
} from '@mui/icons-material';
const ProfilePage: React.FC = () => {
    const { control, handleSubmit, setValue } = useForm<ProfileData>();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof ProfileData, string>>>({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const roleId = typeof window !== 'undefined' ? Number(localStorage.getItem('roleId')) : null;
    useEffect(() => {
        setMounted(true);
    }, []);
    useEffect(() => {
        if (!token) {
            localStorage.clear();
            router.push('/authentication/login');
            return;
        }

        if (!BASE_URL) {
            console.error('BASE_URL is not defined');
            return;
        }

        const fetchProfile = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/profile/getProfileById`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data: ProfileData = res.data.result;

                Object.entries(data).forEach(([key, value]) => {
                    if (key === 'dateOfBirth' && typeof value === 'string') {
                        const formattedDate = value.split('T')[0];
                        setValue('dateOfBirth', formattedDate as ProfileData['dateOfBirth']);
                    } else {
                        setValue(key as keyof ProfileData, value as any);
                    }
                });
            } catch (error: any) {
                console.error("Error fetching profile:", error);
                if (axios.isAxiosError(error)) {
                    alert(`Failed to fetch profile: ${error.response?.data?.message || error.message}`);
                } else {
                    alert("Unexpected error occurred.");
                }
            }
        };

        fetchProfile();
    }, [router, token, setValue]);
    const validateFields = (data: ProfileData) => {
        const newErrors: Partial<Record<keyof ProfileData, string>> = {};

        if (!data.firstName) newErrors.firstName = 'First name is required';
        if (!data.lastName) newErrors.lastName = 'Last name is required';
        if (!data.mobileNo) newErrors.mobileNo = 'Mobile number is required';
        if (!/^\d{10}$/.test(data.mobileNo)) newErrors.mobileNo = 'Enter valid 10-digit number';
        if (!data.pinCode) newErrors.pinCode = 'Pin code is required';
        if (!/^\d{6}$/.test(data.pinCode)) newErrors.pinCode = 'Enter valid 6-digit pin';
        if (!data.address) newErrors.address = 'Address is required';
        if (!data.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleImageChange = async (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImage(file);

        if (!BASE_URL || !token) {
            localStorage.clear();
            router.push('/authentication/login');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('mediaType', 'image');
        formData.append('description', 'optional description here');

        try {
            const res = await axios.post(`${BASE_URL}/files/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (res.data.status === true) {
                setSnackbarOpen(true);
                const imageUrl = res.data.result.url;
                const profileImageKey = res.data.result.key
                setValue('profileImageURL', imageUrl);
                setValue('profileImageKey', profileImageKey);
                setSnackbarMessage(res.data.message)
            } else {

            }
        } catch (error: any) {

            setSnackbarOpen(true);
            setSnackbarMessage(error.data.error)
        }
    };

    const onSubmit = async (data: ProfileData) => {
        if (!validateFields(data)) return;
        setLoading(true);
        if (!BASE_URL || !token) {
            localStorage.clear();
            router.push('/authentication/login');
            return;
        }
        try {
            const payload = {
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                dateOfBirth: data.dateOfBirth,
                profileImageURL: data.profileImageURL,
                profileImageKey: data.profileImageKey,
                mobileNo: data.mobileNo,
                pinCode: data.pinCode,
            };

            const response = await axios.put(`${BASE_URL}/profile/updateProfile`, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data.status === true) {
                setSnackbarOpen(true);
                setSnackbarMessage(response.data.message);
                if (roleId === 2) {
                    router.push('/utilities/customer');
                }
                else {
                    router.push('/');
                }
            }
        } catch (error: any) {
            setSnackbarMessage(error.data.message);
        } finally {
            setLoading(false);
        }
    };
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    }

    return (
        <Box sx={{ p: 4 }}>
            <Card elevation={3} sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    My Profile
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Controller
                                    name="profileImageURL"
                                    control={control}
                                    render={({ field }) => (
                                        <Avatar
                                            src={field.value || '/images/profile/user-1.jpg'}
                                            variant="square"
                                            sx={{ width: 150, height: 150, borderRadius: 3, border: 1 }}
                                        />
                                    )}
                                />
                                <IconButton color="primary" component="label" sx={{ mt: 1, fontSize: 12 }}>
                                    Upload image
                                    <EditIcon sx={{ fontSize: 20 }} />
                                    <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                                </IconButton>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={9}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="firstName"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label={
                                                    <>
                                                        First Name <span style={{ color: 'red' }}>*</span>
                                                    </>
                                                }
                                                InputLabelProps={{ shrink: Boolean(field.value) }}
                                                error={!!errors.firstName}
                                                helperText={errors.firstName}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Person sx={{ color: 'brown' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                onBlur={() => {
                                                    if (!field.value) {
                                                        setErrors(prev => ({ ...prev, firstName: 'First name is required' }));
                                                    } else {
                                                        setErrors(prev => ({ ...prev, firstName: '' }));
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    const val = e.target.value;
                                                    setErrors(prev => ({
                                                        ...prev,
                                                        firstName: val ? '' : 'First name is required',
                                                    }));
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="lastName"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label={
                                                    <>
                                                        Last Name <span style={{ color: 'red' }}>*</span>
                                                    </>
                                                }
                                                InputLabelProps={{ shrink: Boolean(field.value) }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Person sx={{ color: 'brown' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                error={!!errors.lastName}
                                                helperText={errors.lastName}
                                                onBlur={() => {
                                                    if (!field.value) {
                                                        setErrors(prev => ({ ...prev, lastName: 'Last name is required' }));
                                                    } else {
                                                        setErrors(prev => ({ ...prev, lastName: '' }));
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    const val = e.target.value;
                                                    setErrors(prev => ({
                                                        ...prev,
                                                        lastName: val ? '' : 'Last name is required',
                                                    }));
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label={
                                                    <>
                                                        Email <span style={{ color: 'red' }}>*</span>
                                                    </>
                                                }
                                                disabled
                                                InputLabelProps={{ shrink: Boolean(field.value) }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Email sx={{ color: 'brown' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                {mounted && roleId === 2 && (
                                    <>
                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name="businessName"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label={
                                                            <>
                                                                Business name <span style={{ color: 'red' }}>*</span>
                                                            </>
                                                        }
                                                        disabled
                                                        InputLabelProps={{ shrink: Boolean(field.value) }}
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Business sx={{ color: 'brown' }} />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name="businessRepresentative"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label={
                                                            <>
                                                                Represntative <span style={{ color: 'red' }}>*</span>
                                                            </>
                                                        }
                                                        disabled
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Badge sx={{ color: 'brown' }} />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        InputLabelProps={{ shrink: Boolean(field.value) }}
                                                    />
                                                )}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Controller
                                                name="vendorCode"
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label={
                                                            <>
                                                                Collaborator code <span style={{ color: 'red' }}>*</span>
                                                            </>
                                                        }
                                                        disabled
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Code sx={{ color: 'brown' }} />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        InputLabelProps={{ shrink: Boolean(field.value) }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </>
                                )}
                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="address"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth label={
                                                    <>
                                                        Address <span style={{ color: 'red' }}>*</span>
                                                    </>
                                                }
                                                InputLabelProps={{ shrink: Boolean(field.value) }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Home sx={{ color: 'brown' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                error={!!errors.address}
                                                helperText={errors.address}
                                                onBlur={() => {
                                                    if (!field.value) {
                                                        setErrors(prev => ({ ...prev, address: 'Address is required' }));
                                                    } else {
                                                        setErrors(prev => ({ ...prev, address: '' }));
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    const val = e.target.value;
                                                    setErrors(prev => ({
                                                        ...prev,
                                                        address: val ? '' : 'Address name is required',
                                                    }));
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="pinCode"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label={
                                                    <>
                                                        Pin code <span style={{ color: 'red' }}>*</span>
                                                    </>
                                                }
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Pin sx={{ color: 'brown' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                InputLabelProps={{ shrink: Boolean(field.value) }}
                                                error={!!errors.pinCode}
                                                helperText={errors.pinCode}
                                                onBlur={() => {
                                                    if (!field.value) {
                                                        setErrors(prev => ({ ...prev, pinCode: 'Pin code is required' }));
                                                    } else {
                                                        setErrors(prev => ({ ...prev, pinCode: '' }));
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    const val = e.target.value;
                                                    setErrors(prev => ({
                                                        ...prev,
                                                        pinCode: val ? '' : 'Pin code  name is required',
                                                    }));
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="dateOfBirth"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label={
                                                    <>
                                                        Date of Birth <span style={{ color: 'red' }}>*</span>
                                                    </>
                                                }
                                                type="date"
                                                InputLabelProps={{ shrink: true }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Cake sx={{ color: 'brown' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                error={!!errors.dateOfBirth}
                                                helperText={errors.dateOfBirth}
                                                onBlur={() => {
                                                    if (!field.value) {
                                                        setErrors(prev => ({ ...prev, dateOfBirth: 'Date of birth is required' }));
                                                    } else {
                                                        setErrors(prev => ({ ...prev, dateOfBirth: '' }));
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    const val = e.target.value;
                                                    setErrors(prev => ({
                                                        ...prev,
                                                        dateOfBirth: val ? '' : 'Date of birth is required',
                                                    }));
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Controller
                                        name="mobileNo"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label={
                                                    <>
                                                        Mobile no. <span style={{ color: 'red' }}>*</span>
                                                    </>
                                                }
                                                InputLabelProps={{ shrink: Boolean(field.value) }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Phone sx={{ color: 'brown' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                error={!!errors.mobileNo}
                                                helperText={errors.mobileNo}
                                                onBlur={() => {
                                                    if (!field.value) {
                                                        setErrors(prev => ({ ...prev, mobileNo: 'Mobile no. name is required' }));
                                                    } else {
                                                        setErrors(prev => ({ ...prev, mobileNo: '' }));
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    const val = e.target.value;
                                                    setErrors(prev => ({
                                                        ...prev,
                                                        mobileNo: val ? '' : 'Mobile no. is required',
                                                    }));
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Box textAlign="right">
                                <Button variant="contained" color="primary" type="submit" disabled={loading}>
                                    {loading ? 'Updating...' : 'Update Profile'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Card>
            <Snackbar
                open={snackbarOpen}
                // open={true}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{
                        width: "100%",
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default ProfilePage;
