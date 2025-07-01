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
    Tooltip,
    CircularProgress,
    DialogActions,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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
    Cake,
    Phone,
    Code,
    ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
const ProfilePage: React.FC = () => {
    const { control, handleSubmit, setValue } = useForm<ProfileData>();
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof ProfileData, string>>>({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [profileImageURL, setProfileImageURL] = useState('');
    const [formDataToSubmit, setFormDataToSubmit] = useState<ProfileData | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const roleId = typeof window !== 'undefined' ? Number(localStorage.getItem('roleId')) : null;
    useEffect(() => {
        setMounted(true);
    }, []);
    console.log("<---control--->", control);
    const fetchProfile = async () => {
        if (!token) {
            localStorage.clear();
            router.push('/authentication/login');
            return;
        }
        if (token) {
            const decoded: any = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.clear();
                router.push("/authentication/login");
            }
        }
        if (!BASE_URL) {
            console.error('BASE_URL is not defined');
            return;
        }
        try {
            const res = await axios.get(`${BASE_URL}/profile/getProfileById`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data: ProfileData = res.data.result;
            setProfileImageURL(data.profileImageURL);
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
    useEffect(() => {
        if (token) {
            const decoded: any = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.clear();
                router.push("/authentication/login");
            }
        }
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
        if (token) {
            const decoded: any = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.clear();
                router.push("/authentication/login");
            }
        }
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
            const res = await axios.post(`${BASE_URL}/files/profileImageUpload`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (res.data.status === true) {
                setSnackbarOpen(true);
                const imageUrl = res.data.result.url;
                const profileImageKey = res.data.result.key
                setProfileImageURL(imageUrl)
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
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${BASE_URL}/files/deleteProfileImage`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setSnackbarMessage(response.data.message || 'Profile image deleted successfully!');
            setSnackbarSeverity('success');
            setProfileImageURL('');
            setValue('profileImageURL', '');
            setValue('profileImageKey', '');
        } catch (error) {
            console.error('Error deleting profile image:', error);
            setSnackbarMessage('Failed to delete profile image.');
            setSnackbarSeverity('error');
        } finally {
            setSnackbarOpen(true);
            setOpenDialog(false);
        }
    };


    const onSubmit = async (data: ProfileData) => {
        if (token) {
            const decoded: any = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.clear();
                router.push("/authentication/login");
                return;
            }
        }
        // if (!validateFields(data)) return;

        if (!BASE_URL || !token) {
            localStorage.clear();
            router.push('/authentication/login');
            return;
        }

        try {
            const payload = {
                firstName: data?.firstName || '',
                lastName: data?.lastName || '',
                address: data?.address || '',
                dateOfBirth: data?.dateOfBirth || '',
                profileImageURL: data?.profileImageURL || '',
                profileImageKey: data?.profileImageKey || '',
                mobileNo: data?.mobileNo,
                pinCode: data?.pinCode || '',
            };

            const response = await axios.put(`${BASE_URL}/profile/updateProfile`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.status === true) {
                setSnackbarOpen(true);
                setSnackbarMessage(response.data.message);
                if (roleId === 2) {
                    setTimeout(() => router.push('/utilities/customer'), 3000);
                } else {
                    setTimeout(() => router.push('/'), 3000);
                }
            }
        } catch (error: any) {
            setSnackbarMessage(error?.data?.message || 'Update failed');
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    }

    const handleSubmitWithConfirm = (data: ProfileData) => {
        // if (!validateFields(data)) return;
        setFormDataToSubmit(data);
        setConfirmOpen(true);
    };
    const handleConfirmUpdate = async () => {
        if (!formDataToSubmit) return;
        setLoading(true);
        setConfirmOpen(false);

        try {
            await onSubmit(formDataToSubmit);
        } finally {
            setLoading(false);
        }
    };
    return (
        <Box sx={{ p: 4 }}>
            <Card elevation={3} sx={{ p: 2 }}>
                <Grid item xs={12} textAlign="center" sx={{ pb: 1 }}>
                    <Typography variant="h4" gutterBottom >
                        My Profile
                    </Typography>
                </Grid>

                <Divider sx={{ mb: 3 }} />

                <form onSubmit={handleSubmit(handleSubmitWithConfirm)}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={3}>
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Controller
                                    name="profileImageURL"
                                    control={control}
                                    render={({ field }) => (
                                        <Avatar
                                            src={field?.value || '/images/profile/user-1.jpg'}
                                            variant="square"
                                            sx={{ width: 150, height: 150, borderRadius: 3, border: 1 }}
                                        />
                                    )}
                                />
                                <Grid container spacing={1} justifyContent="center" sx={{ mt: 1 }}>
                                    <Grid item>
                                        <Tooltip title="Upload Image">
                                            <IconButton color="primary" component="label" sx={{ fontSize: 12 }}>
                                                <EditIcon sx={{ fontSize: 20 }} />
                                                <input type="file" accept="image/*" hidden onChange={handleImageChange} />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item>
                                        {profileImageURL && (
                                            <Tooltip title="Delete Image">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => setOpenDialog(true)}
                                                    sx={{ fontSize: 12 }}
                                                >
                                                    <DeleteIcon sx={{ fontSize: 20 }} />
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </Grid>
                                </Grid>
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
                                                label="First Name"
                                                InputLabelProps={{
                                                    shrink: Boolean(field?.value), sx: {
                                                        marginLeft: field?.value ? '0px' : '32px'
                                                    }
                                                }}
                                                error={!!errors?.firstName}
                                                helperText={errors?.firstName}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Person sx={{ color: 'brown' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                // onBlur={() => {
                                                //     if (!field?.value) {
                                                //         setErrors(prev => ({ ...prev, firstName: 'First name is required' }));
                                                //     } else {
                                                //         setErrors(prev => ({ ...prev, firstName: '' }));
                                                //     }
                                                // }}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    const val = e.target.value;
                                                    // setErrors(prev => ({
                                                    //     ...prev,
                                                    //     firstName: val ? '' : 'First name is required',
                                                    // }));
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
                                                label='Last Name'
                                                InputLabelProps={{
                                                    shrink: Boolean(field?.value), sx: {
                                                        marginLeft: field?.value ? '0px' : '32px'
                                                    }
                                                }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Person sx={{ color: 'brown' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                error={!!errors?.lastName}
                                                helperText={errors?.lastName}
                                                // onBlur={() => {
                                                //     if (!field?.value) {
                                                //         setErrors(prev => ({ ...prev, lastName: 'Last name is required' }));
                                                //     } else {
                                                //         setErrors(prev => ({ ...prev, lastName: '' }));
                                                //     }
                                                // }}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    const val = e.target.value;
                                                    // setErrors(prev => ({
                                                    //     ...prev,
                                                    //     lastName: val ? '' : 'Last name is required',
                                                    // }));
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
                                                label=''
                                                disabled
                                                InputLabelProps={{
                                                    shrink: Boolean(field?.value), sx: {
                                                        marginLeft: field?.value ? '0px' : '32px'
                                                    }
                                                }}
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
                                                        label='Business Name'
                                                        disabled
                                                        InputLabelProps={{
                                                            shrink: Boolean(field?.value), sx: {
                                                                marginLeft: field?.value ? '0px' : '32px'
                                                            }
                                                        }}
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
                                                        label='Business Representative'
                                                        disabled
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Badge sx={{ color: 'brown' }} />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: Boolean(field?.value), sx: {
                                                                marginLeft: field?.value ? '0px' : '32px'
                                                            }
                                                        }}
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
                                                        label='Vendor Code'
                                                        disabled
                                                        InputProps={{
                                                            startAdornment: (
                                                                <InputAdornment position="start">
                                                                    <Code sx={{ color: 'brown' }} />
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                        InputLabelProps={{
                                                            shrink: Boolean(field.value), sx: {
                                                                marginLeft: field?.value ? '0px' : '32px'
                                                            }
                                                        }}
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
                                                fullWidth
                                                label='Address'
                                                InputLabelProps={{
                                                    shrink: Boolean(field.value), sx: {
                                                        marginLeft: field?.value ? '0px' : '32px'
                                                    }
                                                }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Home sx={{ color: 'brown' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                error={!!errors.address}
                                                helperText={errors.address}
                                                // onBlur={() => {
                                                //     if (!field.value) {
                                                //         setErrors(prev => ({ ...prev, address: 'Address is required' }));
                                                //     } else {
                                                //         setErrors(prev => ({ ...prev, address: '' }));
                                                //     }
                                                // }}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    const val = e.target.value;
                                                    // setErrors(prev => ({
                                                    //     ...prev,
                                                    //     address: val ? '' : 'Address name is required',
                                                    // }));
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
                                                label='Pin Code'
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Pin sx={{ color: 'brown' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                InputLabelProps={{
                                                    shrink: Boolean(field.value), sx: {
                                                        marginLeft: field?.value ? '0px' : '32px'
                                                    }
                                                }}
                                                error={!!errors.pinCode}
                                                helperText={errors.pinCode}
                                                // onBlur={() => {
                                                //     if (!field.value) {
                                                //         setErrors(prev => ({ ...prev, pinCode: 'Pin code is required' }));
                                                //     } else {
                                                //         setErrors(prev => ({ ...prev, pinCode: '' }));
                                                //     }
                                                // }}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    const val = e.target.value;
                                                    // setErrors(prev => ({
                                                    //     ...prev,
                                                    //     pinCode: val ? '' : 'Pin code  name is required',
                                                    // }));
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
                                                label='Date of Birth'
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
                                                // onBlur={() => {
                                                //     if (!field.value) {
                                                //         setErrors(prev => ({ ...prev, dateOfBirth: 'Date of birth is required' }));
                                                //     } else {
                                                //         setErrors(prev => ({ ...prev, dateOfBirth: '' }));
                                                //     }
                                                // }}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    const val = e.target.value;
                                                    // setErrors(prev => ({
                                                    //     ...prev,
                                                    //     dateOfBirth: val ? '' : 'Date of birth is required',
                                                    // }));
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
                                                label='Mobile No.'
                                                InputLabelProps={{
                                                    shrink: Boolean(field.value), sx: {
                                                        marginLeft: field?.value ? '0px' : '32px'
                                                    }
                                                }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Phone sx={{ color: 'brown' }} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                error={!!errors.mobileNo}
                                                helperText={errors.mobileNo}
                                                // onBlur={() => {
                                                //     if (!field.value) {
                                                //         setErrors(prev => ({ ...prev, mobileNo: 'Mobile no. name is required' }));
                                                //     } else {
                                                //         setErrors(prev => ({ ...prev, mobileNo: '' }));
                                                //     }
                                                // }}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    const val = e.target.value;
                                                    // setErrors(prev => ({
                                                    //     ...prev,
                                                    //     mobileNo: val ? '' : 'Mobile no. is required',
                                                    // }));
                                                }}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Box display={"flex"} justifyContent="space-between" alignItems="center">
                                <Tooltip title="Back">
                                    <Button variant="outlined" color="secondary" onClick={() => router.back()} disabled={loading}>
                                        <ArrowBackIcon sx={{ mr: 1 }} />
                                    </Button>
                                </Tooltip>
                                <Button variant="contained" color="primary" type="submit" disabled={loading}>
                                    Update Profile
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Card>
            <Dialog open={confirmOpen} onClose={() => !loading && setConfirmOpen(false)}>
                <DialogTitle>Confirm Update</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to update your profile?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmUpdate}
                        color="primary"
                        variant="contained"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : null}
                    >
                        {loading ? <CircularProgress size={20} /> : 'confirm'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Delete Profile Image</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete the profile image?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="error" variant="contained">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
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
        </Box >
    );
};

export default ProfilePage;
