import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Typography,
    Stepper,
    Step,
    StepLabel,
    IconButton,
    Link,
    CircularProgress,
    Box,
    Paper,
    Divider,
    Avatar
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";

interface LoanFormData {
    motherName: string;
    landmark: string;
    email: string;
    currentAddress: string;
    cityYears: string;
    alternateNo: string;
    maritalStatus: string;
    designation: string;
    companyExp: string;
    totalWorkExp: string;
    officeAddress: string;
    officeMobile: string;
    ref1Name: string;
    ref1Mobile: string;
    ref1Address: string;
    ref2Name: string;
    ref2Mobile: string;
    ref2Address: string;
    panNumber: string;
    aadharNumber: string;
    photoFileKey: File | string | null;
    panCardFileKey: File | string | null;
    aadhaarCardFileKey: File | string | null;
    salarySlipsFileKey: File | string | null;
    bankStatementFileKey: File | string | null;
}

const defaultFormData: LoanFormData = {
    motherName: "",
    landmark: "",
    email: "",
    currentAddress: "",
    cityYears: "",
    alternateNo: "",
    maritalStatus: "",
    designation: "",
    companyExp: "",
    totalWorkExp: "",
    officeAddress: "",
    officeMobile: "",
    ref1Name: "",
    ref1Mobile: "",
    ref1Address: "",
    ref2Name: "",
    ref2Mobile: "",
    ref2Address: "",
    panNumber: "",
    aadharNumber: "",
    photoFileKey: null,
    panCardFileKey: null,
    aadhaarCardFileKey: null,
    salarySlipsFileKey: null,
    bankStatementFileKey: null
};

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (formData: any, isEdit: boolean) => void;
    initialData?: LoanFormData | null;
    mode?: 'create' | 'edit';
}

const PersonalLoanFormDialog: React.FC<Props> = ({
    open,
    onClose,
    onSubmit,
    initialData,
    mode = 'create'
}) => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<LoanFormData>(defaultFormData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [filePreviewUrls, setFilePreviewUrls] = useState<Record<string, string>>({});
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const steps = ["Personal Info", "Contact Info", "Employment", "References", "Documents", "Review"];
    const maritalStatusOptions = ["Single", "Married", "Divorced", "Widowed"];
    const gridSpacing = { xs: 12, sm: 6 };
    const DOCUMENT_URL = process.env.AWS_S3_BUCKET_URL || 'https://connect-india-upload-documents.s3.ap-south-1.amazonaws.com';
    const getToken = () => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem('accessToken');
            return token;
        }
    }
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
        if (!token && !roleId) {
            localStorage.clear();
            router.push("/authentication/login");
        }
        if (token) {
            const decoded: any = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.clear();
                router.push("/authentication/login");
            }
            if (roleId !== 3) {
                localStorage.clear();
                router.push("/authentication/login");
            }
        } else {
            localStorage.clear();
            router.push("/authentication/login");
        }
    }, []);
    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setFormData(initialData);
            const urls: Record<string, string> = {};

            const documentKeys: (keyof LoanFormData)[] = [
                'aadhaarCardFileKey',
                'panCardFileKey',
                'salarySlipsFileKey',
                'bankStatementFileKey',
            ];

            documentKeys.forEach(key => {
                if (typeof initialData[key] === 'string') {
                    urls[key] = `${DOCUMENT_URL}/${initialData[key]}`;
                }
            });

            setFilePreviewUrls(urls);
        } else {
            setFormData(defaultFormData);
            setFilePreviewUrls({});
        }
        setStep(1);
        setSuccess(false);
    }, [open, initialData, mode, DOCUMENT_URL]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;
        if (name === "panNumber") {
            formattedValue = value.toUpperCase();
        } else if (["aadharNumber", "mobile", "nomineeMobile"].includes(name)) {
            formattedValue = value.replace(/\D/g, "").slice(0, name === "aadharNumber" ? 12 : 10);
        }

        setFormData(prev => ({ ...prev, [name]: formattedValue }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files?.length) {
            const file = files[0];
            const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
            const maxSize = 10 * 1024 * 1024;

            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, [name]: "Only JPG, PNG, or PDF allowed" }));
            } else if (file.size > maxSize) {
                setErrors(prev => ({ ...prev, [name]: "File size must be less than 10MB" }));
            } else {
                setFormData(prev => ({ ...prev, [name]: file }));
                setErrors(prev => ({ ...prev, [name]: "" }));
            }
        }
    };

    const validateField = useCallback((name: keyof LoanFormData, value: string | File | null): string => {
        if (value === null || value === "") {
            return "This field is required";
        }

        switch (name) {
            // Personal Information
            case 'motherName':
                if (typeof value !== 'string') return "Invalid name format";
                if (value.length < 2) return "Name must be at least 2 characters";
                if (value.length > 50) return "Name cannot exceed 50 characters";
                if (!/^[a-zA-Z\s.'-]+$/.test(value)) return "Name can only contain letters, spaces, and basic punctuation";
                return "";

            case 'email':
                if (typeof value !== 'string') return "Invalid email input";
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format (example@domain.com)";
                if (value.length > 100) return "Email cannot exceed 100 characters";
                return "";

            case 'alternateNo':
            case 'officeMobile':
            case 'ref1Mobile':
            case 'ref2Mobile':
                if (typeof value !== 'string') return "Invalid mobile number input";
                if (!/^[6-9]\d{9}$/.test(value)) return "Invalid 10-digit mobile number (must start with 6-9)";
                return "";

            case 'panNumber':
                if (typeof value !== 'string') return "Invalid PAN input";
                const upperValue = value.toUpperCase();
                if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(upperValue)) return "Invalid PAN format (e.g., ABCDE1234F)";
                return "";

            case 'aadharNumber':
                if (typeof value !== 'string') return "Invalid Aadhar input";
                if (!/^\d{12}$/.test(value)) return "Aadhar must be exactly 12 digits";
                return "";

            // Address Information
            case 'landmark':
            case 'currentAddress':
            case 'officeAddress':
            case 'ref1Address':
            case 'ref2Address':
                if (typeof value !== 'string') return "Invalid address format";
                if (value.length < 5) return "Address must be at least 5 characters";
                if (value.length > 200) return "Address cannot exceed 200 characters";
                return "";

            // Dropdown/Select Fields
            case 'maritalStatus':
                if (typeof value !== 'string') return "Invalid selection";
                if (!maritalStatusOptions.includes(value)) return "Please select a valid marital status";
                return "";

            case 'designation':
                if (typeof value !== 'string') return "Invalid designation";
                if (value.length < 2) return "Designation must be at least 2 characters";
                if (value.length > 50) return "Designation cannot exceed 50 characters";
                return "";

            // Numeric Fields with Range
            case 'cityYears':
            case 'companyExp':
            case 'totalWorkExp':
                if (typeof value !== 'string') return "Invalid number input";
                if (!/^\d{1,2}$/.test(value)) return "Must be a number (max 2 digits)";
                const numValue = parseInt(value, 10);
                if (numValue < 0) return "Cannot be negative";
                if (numValue > 50) return "Cannot exceed 50 years";
                return "";

            // Reference Names
            case 'ref1Name':
            case 'ref2Name':
                if (typeof value !== 'string') return "Invalid name format";
                if (value.length < 2) return "Name must be at least 2 characters";
                if (value.length > 50) return "Name cannot exceed 50 characters";
                if (!/^[a-zA-Z\s.'-]+$/.test(value)) return "Name can only contain letters, spaces, and basic punctuation";
                return "";

            // File Uploads
            case 'panCardFileKey':
            case 'aadhaarCardFileKey':
            case 'photoFileKey':
            case 'salarySlipsFileKey':
            case 'bankStatementFileKey':
                if (!(value instanceof File) && typeof value !== 'string') return "File is required";
                return "";

            default:
                return "";
        }
    }, []);

    const validateStep = useCallback(() => {
        const newErrors: Partial<Record<keyof LoanFormData, string>> = {};
        let isValid = true;

        const validateFields = (fields: Array<keyof LoanFormData>) => {
            fields.forEach(field => {
                const error = validateField(field, formData[field]);
                if (error) {
                    newErrors[field] = error;
                    isValid = false;
                }
            });
        };

        switch (step) {
            case 1:
                validateFields(['motherName', 'panNumber', 'aadharNumber', 'email', 'currentAddress']);
                break;
            case 2:
                validateFields(['cityYears', 'alternateNo', 'landmark', 'maritalStatus']);
                break;
            case 3:
                validateFields(['designation', 'companyExp', 'totalWorkExp', 'officeAddress', 'officeMobile']);
                break;
            case 4:
                validateFields(['ref1Name', 'ref1Mobile', 'ref1Address', 'ref2Name', 'ref2Mobile', 'ref2Address']);
                break;
            case 5:
                validateFields([
                    'panCardFileKey',
                    'aadhaarCardFileKey', 'photoFileKey', 'salarySlipsFileKey',
                    'bankStatementFileKey'
                ]);
                break;
        }

        setErrors(newErrors);
        return isValid;
    }, [step, formData, validateField]);

    const handleNext = () => {
        if (validateStep()) setStep(prev => prev + 1);
    };

    const handleBack = () => setStep(prev => prev - 1);

    const handleBlur = (e: any) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        if (error) {
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };
    const uploadFileToServer = async (file: File, folderName: string): Promise<string> => {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No authentication token found');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('mediaType', 'document');
        formData.append('description', 'Insurance document');
        formData.append('folderName', folderName);

        const response = await axios.post(
            `${BASE_URL}/uploadDocumentSerciceTypeFile/dynamic`,
            formData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        if (!response.data.status) {
            throw new Error(response.data.message || 'File upload failed');
        }

        return response.data.result.key;
    };

    const handleClose = () => {
        setFormData(defaultFormData);
        setErrors({});
        setStep(1);
        setSuccess(false);
        onClose();
    };

    const handleFormSubmit = async () => {
        if (!validateStep()) return;

        setLoading(true);

        try {
            const uploadPromises: Promise<{ field: string, key: string }>[] = [];
            const isEdit = mode === 'edit';
            const fileMappings = [
                { field: 'panCardFileKey', folder: 'pan' },
                { field: 'aadhaarCardFileKey', folder: 'aadhar' },
                { field: 'photoFileKey', folder: 'photo' },
                { field: 'salarySlipsFileKey', folder: 'salary-slips' },
                { field: 'bankStatementFileKey', folder: 'bank-statements' }
            ];

            for (const { field, folder } of fileMappings) {
                const file = formData[field as keyof LoanFormData];
                if (file instanceof File) {
                    uploadPromises.push(
                        uploadFileToServer(file, folder)
                            .then(key => ({ field, key }))
                            .catch(error => {
                                throw error;
                            })
                    );
                }
            }

            const uploadResults = await Promise.all(uploadPromises);
            const submissionData = { ...formData };
            uploadResults.forEach(({ field, key }) => {
                submissionData[field as keyof LoanFormData] = key;
            });

            onSubmit(submissionData, isEdit);
            setSuccess(true);
            setTimeout(() => {
                handleClose();
            }, 2000);
        } catch (error) {
            console.error('Form submission failed:', error);
        } finally {
            setLoading(false);
        }
    };
    const renderFileUpload = (label: string, name: keyof LoanFormData) => {
        const fileValue = formData[name];
        const error = errors[name];
        const previewUrl = filePreviewUrls[name] || (fileValue instanceof File ? URL.createObjectURL(fileValue) : null);

        return (
            <Grid item {...gridSpacing}>
                <FormControl fullWidth error={!!error}>
                    <InputLabel shrink sx={{ transform: 'none', position: 'relative', mb: 1 }}>
                        {label}
                        <span style={{ color: 'red' }}>*</span>
                    </InputLabel>
                    <Button
                        component="label"
                        fullWidth
                        variant={fileValue ? "contained" : "outlined"}
                        startIcon={<AttachFileIcon />}
                        disabled={loading}
                    >
                        {fileValue ? (fileValue instanceof File ? fileValue.name : 'Uploaded') : 'Choose File'}
                        <input
                            hidden
                            type="file"
                            name={name}
                            accept="image/*,application/pdf"
                            onChange={handleFileChange}
                            disabled={loading}
                        />
                    </Button>
                    {previewUrl && (
                        <Typography variant="body2" sx={{ mt: 1 }}>
                            <Link href={previewUrl} target="_blank" rel="noopener">
                                {fileValue instanceof File ? 'Preview Document' : 'View Document'}
                            </Link>
                        </Typography>
                    )}
                    {error && (
                        <Typography color="error" variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                            {error}
                        </Typography>
                    )}
                </FormControl>
            </Grid>
        );
    };
    const renderReviewItem = (label: string, value: any) => {
        if (value === null || value === undefined || value === "") {
            return null;
        }

        return (
            <Grid item xs={12} sm={6}>
                <Paper elevation={0} sx={{ p: 2, mb: 2, border: '1px solid #eee', borderRadius: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {label}
                    </Typography>
                    {value instanceof File ? (
                        <Link href={URL.createObjectURL(value)} target="_blank" rel="noopener">
                            View {value.name}
                        </Link>
                    ) : (
                        <Typography variant="body1">{value}</Typography>
                    )}
                </Paper>
            </Grid>
        );
    };

    const renderReviewStep = () => {
        return (
            <Box sx={{ p: 2 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                    <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                    Review Your Application
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Personal Information</Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                    {renderReviewItem("Mother's Name", formData.motherName)}
                    {renderReviewItem("Landmark", formData.landmark)}
                    {renderReviewItem("Email", formData.email)}
                    {renderReviewItem("PAN Number", formData.panNumber)}
                    {renderReviewItem("Aadhar Number", formData.aadharNumber)}
                    {renderReviewItem("Current Address", formData.currentAddress)}
                    {renderReviewItem("Years in Current City", formData.cityYears)}
                    {renderReviewItem("Alternate Number", formData.alternateNo)}
                    {renderReviewItem("Marital Status", formData.maritalStatus)}
                </Grid>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Employment Information</Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                    {renderReviewItem("Designation", formData.designation)}
                    {renderReviewItem("Company Experience (Years)", formData.companyExp)}
                    {renderReviewItem("Total Work Experience (Years)", formData.totalWorkExp)}
                    {renderReviewItem("Office Address", formData.officeAddress)}
                    {renderReviewItem("Office Mobile", formData.officeMobile)}
                </Grid>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>References</Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                    {renderReviewItem("Reference 1 Name", formData.ref1Name)}
                    {renderReviewItem("Reference 1 Mobile", formData.ref1Mobile)}
                    {renderReviewItem("Reference 1 Address", formData.ref1Address)}
                    {renderReviewItem("Reference 2 Name", formData.ref2Name)}
                    {renderReviewItem("Reference 2 Mobile", formData.ref2Mobile)}
                    {renderReviewItem("Reference 2 Address", formData.ref2Address)}
                </Grid>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Documents</Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>

                    {formData.panCardFileKey && renderReviewItem("PAN Card", formData.panCardFileKey)}
                    {formData.aadhaarCardFileKey && renderReviewItem("Aadhar Card", formData.aadhaarCardFileKey)}
                    {formData.photoFileKey && renderReviewItem("Photo", formData.photoFileKey)}
                    {formData.salarySlipsFileKey && renderReviewItem("Salary Slips", formData.salarySlipsFileKey)}
                    {formData.bankStatementFileKey && renderReviewItem("Bank Statement", formData.bankStatementFileKey)}
                </Grid>
            </Box>
        );
    };
    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <Grid container spacing={2}>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label={<span>PAN Number <span style={{ color: 'red' }}>*</span></span>}
                                name="panNumber"
                                value={formData.panNumber}
                                onChange={handleInputChange}
                                error={!!errors.panNumber}
                                helperText={errors.panNumber || "Format: ABCDE1234F"}
                                disabled={loading}
                                inputProps={{
                                    maxLength: 10
                                }}
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label={<span>Aadhar Number <span style={{ color: 'red' }}>*</span></span>}
                                name="aadharNumber"
                                value={formData.aadharNumber}
                                onChange={handleInputChange}
                                error={!!errors.aadharNumber}
                                helperText={errors.aadharNumber || "12 digits"}
                                disabled={loading}
                                inputProps={{
                                    maxLength: 12,
                                    inputMode: 'numeric',
                                    pattern: '[0-9]*',
                                }}
                                onKeyPress={(e: React.KeyboardEvent) => {
                                    if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item {...gridSpacing} >
                            <TextField
                                fullWidth
                                label={<span>Mother's Name <span style={{ color: 'red' }}>*</span></span>}
                                name="motherName"
                                value={formData.motherName}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.motherName}
                                helperText={errors.motherName}
                                disabled={loading}
                                inputProps={{
                                    maxLength: 50
                                }}
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label={<span>Email <span style={{ color: 'red' }}>*</span></span>}
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.email}
                                helperText={errors.email}
                                disabled={loading}
                                inputProps={{
                                    maxLength: 100
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={<span>Current Address <span style={{ color: 'red' }}>*</span></span>}
                                name="currentAddress"
                                value={formData.currentAddress}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.currentAddress}
                                helperText={errors.currentAddress}
                                disabled={loading}
                                multiline
                                rows={3}
                                inputProps={{
                                    maxLength: 200
                                }}
                            />
                        </Grid>
                    </Grid>
                );
            case 2:
                return (
                    <Grid container spacing={2}>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label={<span>Years in Current City <span style={{ color: 'red' }}>*</span></span>}
                                name="cityYears"
                                value={formData.cityYears}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.cityYears}
                                helperText={errors.cityYears || "Number of years (max 50)"}
                                disabled={loading}
                                inputProps={{
                                    maxLength: 2,
                                    inputMode: 'numeric',
                                    pattern: '[0-9]*',
                                }}
                                onKeyPress={(e: React.KeyboardEvent) => {
                                    if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label={<span>Alternate Number <span style={{ color: 'red' }}>*</span></span>}
                                name="alternateNo"
                                value={formData.alternateNo}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                inputProps={{
                                    maxLength: 10,
                                    inputMode: 'numeric',
                                    pattern: '[0-9]*',
                                }}
                                onKeyPress={(e: React.KeyboardEvent) => {
                                    if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                error={!!errors.alternateNo}
                                helperText={errors.alternateNo || "10 digit mobile number"}
                                disabled={loading}
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label={<span>Landmark <span style={{ color: 'red' }}>*</span></span>}
                                name="landmark"
                                value={formData.landmark}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.landmark}
                                helperText={errors.landmark}
                                disabled={loading}
                                inputProps={{
                                    maxLength: 100
                                }}
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <FormControl fullWidth error={!!errors.maritalStatus}>
                                <InputLabel>Marital Status <span style={{ color: 'red' }}>*</span></InputLabel>
                                <Select
                                    name="maritalStatus"
                                    value={formData.maritalStatus}
                                    onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value as string })}
                                    label="Marital Status"
                                    disabled={loading}
                                >
                                    {maritalStatusOptions.map(option => (
                                        <MenuItem key={option} value={option}>{option}</MenuItem>
                                    ))}
                                </Select>
                                {errors.maritalStatus && (
                                    <Typography color="error" variant="caption">
                                        {errors.maritalStatus}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                    </Grid>
                );
            case 3:
                return (
                    <Grid container spacing={2}>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label={<span>Designation <span style={{ color: 'red' }}>*</span></span>}
                                name="designation"
                                value={formData.designation}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.designation}
                                helperText={errors.designation}
                                disabled={loading}
                                inputProps={{
                                    maxLength: 50
                                }}
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label={<span>Company Experience (Years) <span style={{ color: 'red' }}>*</span></span>}
                                name="companyExp"
                                value={formData.companyExp}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.companyExp}
                                helperText={errors.companyExp || "Number of years (max 50)"}
                                disabled={loading}
                                inputProps={{
                                    maxLength: 2,
                                    inputMode: 'numeric',
                                    pattern: '[0-9]*',
                                }}
                                onKeyPress={(e: React.KeyboardEvent) => {
                                    if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label={<span>Total Work Experience (Years) <span style={{ color: 'red' }}>*</span></span>}
                                name="totalWorkExp"
                                value={formData.totalWorkExp}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.totalWorkExp}
                                helperText={errors.totalWorkExp || "Number of years (max 50)"}
                                disabled={loading}
                                inputProps={{
                                    maxLength: 2,
                                    inputMode: 'numeric',
                                    pattern: '[0-9]*',
                                }}
                                onKeyPress={(e: React.KeyboardEvent) => {
                                    if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label={<span>Office Mobile <span style={{ color: 'red' }}>*</span></span>}
                                name="officeMobile"
                                value={formData.officeMobile}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.officeMobile}
                                helperText={errors.officeMobile || "10 digit mobile number"}
                                disabled={loading}
                                inputProps={{
                                    maxLength: 10,
                                    inputMode: 'numeric',
                                    pattern: '[0-9]*',
                                }}
                                onKeyPress={(e: React.KeyboardEvent) => {
                                    if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={<span>Office Address <span style={{ color: 'red' }}>*</span></span>}
                                name="officeAddress"
                                value={formData.officeAddress}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.officeAddress}
                                helperText={errors.officeAddress}
                                disabled={loading}
                                multiline
                                rows={2}
                                inputProps={{
                                    maxLength: 200
                                }}
                            />
                        </Grid>
                    </Grid>
                );
            case 4:
                return (
                    <Grid container spacing={2}>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label={<span>Reference 1 Name <span style={{ color: 'red' }}>*</span></span>}
                                name="ref1Name"
                                value={formData.ref1Name}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.ref1Name}
                                helperText={errors.ref1Name}
                                disabled={loading}
                                inputProps={{
                                    maxLength: 50
                                }}
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label={<span>Reference 1 Mobile <span style={{ color: 'red' }}>*</span></span>}
                                name="ref1Mobile"
                                value={formData.ref1Mobile}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.ref1Mobile}
                                helperText={errors.ref1Mobile || "10 digit mobile number"}
                                disabled={loading}
                                inputProps={{
                                    maxLength: 10,
                                    inputMode: 'numeric',
                                    pattern: '[0-9]*',
                                }}
                                onKeyPress={(e: React.KeyboardEvent) => {
                                    if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={<span>Reference 1 Address <span style={{ color: 'red' }}>*</span></span>}
                                name="ref1Address"
                                value={formData.ref1Address}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.ref1Address}
                                helperText={errors.ref1Address}
                                disabled={loading}
                                multiline
                                rows={2}
                                inputProps={{
                                    maxLength: 200
                                }}
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label={<span>Reference 2 Name <span style={{ color: 'red' }}>*</span></span>}
                                name="ref2Name"
                                value={formData.ref2Name}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.ref2Name}
                                helperText={errors.ref2Name}
                                disabled={loading}
                                inputProps={{
                                    maxLength: 50
                                }}
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label={<span>Reference 2 Mobile <span style={{ color: 'red' }}>*</span></span>}
                                name="ref2Mobile"
                                value={formData.ref2Mobile}
                                onChange={handleInputChange}
                                error={!!errors.ref2Mobile}
                                helperText={errors.ref2Mobile || "10 digit mobile number"}
                                disabled={loading}
                                inputProps={{
                                    maxLength: 10,
                                    inputMode: 'numeric',
                                    pattern: '[0-9]*',
                                }}
                                onKeyPress={(e: React.KeyboardEvent) => {
                                    if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={<span>Reference 2 Address <span style={{ color: 'red' }}>*</span></span>}
                                name="ref2Address"
                                value={formData.ref2Address}
                                onChange={handleInputChange}
                                error={!!errors.ref2Address}
                                helperText={errors.ref2Address}
                                disabled={loading}
                                multiline
                                rows={2}
                                inputProps={{
                                    maxLength: 200
                                }}
                            />
                        </Grid>
                    </Grid>
                );
            case 5:
                return (
                    <Grid container spacing={2}>
                        {renderFileUpload("Upload PAN Card", "panCardFileKey")}
                        {renderFileUpload("Upload Aadhar Card", "aadhaarCardFileKey")}
                        {renderFileUpload("Upload Photo", "photoFileKey")}
                        {renderFileUpload("Upload 3 Month Salary Slips", "salarySlipsFileKey")}
                        {renderFileUpload("Upload 3 Month Bank Statement", "bankStatementFileKey")}
                    </Grid>
                );
            case 6:
                return renderReviewStep();
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">
                        {mode === 'edit' ? 'Edit Loan Application' : 'New Loan Application'}
                    </Typography>
                    <IconButton onClick={handleClose} disabled={loading}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Stepper activeStep={step - 1} alternativeLabel sx={{ mb: 3 }}>
                    {steps.map(label => (
                        <Step key={label}><StepLabel>{label}</StepLabel></Step>
                    ))}
                </Stepper>
                {success ? (
                    <Box sx={{ textAlign: 'center', p: 4 }}>
                        <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                        <Typography variant="h5" gutterBottom>
                            Application Submitted Successfully!
                        </Typography>
                        <Typography color="text.secondary">
                            Your Loan application has been received. We'll contact you shortly.
                        </Typography>
                    </Box>
                ) : (
                    renderStepContent()
                )}
            </DialogContent>
            {!success && (
                <DialogActions>
                    {step > 1 && (
                        <Button onClick={handleBack} disabled={loading}>
                            Back
                        </Button>
                    )}
                    {step < steps.length ? (
                        <Button onClick={handleNext} variant="contained" disabled={loading}>
                            Next
                        </Button>
                    ) : (
                        <Button
                            onClick={handleFormSubmit}
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            endIcon={loading ? <CircularProgress size={20} /> : null}
                        >
                            {mode === 'edit' ? 'Update Application' : 'Submit Application'}
                        </Button>
                    )}
                </DialogActions>
            )}
        </Dialog>
    );
};

export default PersonalLoanFormDialog;