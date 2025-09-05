import React, { useEffect, useState } from "react";
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
    Stack,
    FormHelperText,
    Snackbar,
    Alert
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { SelectChangeEvent } from "@mui/material/Select";
import { formatDate } from "@/utils/utils";
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";

type FilePreviewUrls = {
    panCardFileKey?: string;
    aadhaarCardFileKey?: string;
    bankProofFileKey?: string;
    salarySlipsFileKey?: string;
    itrDocumentsFileKey?: string;
};
interface LifeInsuranceData {
    panNumber: string;
    panCardFileKey: File | string | null;
    aadharNumber: string;
    aadhaarCardFileKey: File | string | null;
    bankProofFileKey: File | string | null;
    salarySlipsFileKey: File | string | null;
    itrDocumentsFileKey: File | string | null;
    email: string;
    mobile: string;
    motherName: string;
    placeOfBirth: string;
    heightCM: string;
    weightKG: string;
    annualIncome: string;
    occupation: string;
    smoker: string;
    alcohol: string;
    nomineeName: string;
    nomineeDOB: string;
    nomineeRelation: string;
}

const defaultFormData: LifeInsuranceData = {
    motherName: "",
    placeOfBirth: "",
    heightCM: "",
    weightKG: "",
    smoker: "No",
    alcohol: "No",
    email: "",
    mobile: "",
    annualIncome: "",
    occupation: "",
    nomineeName: "",
    nomineeDOB: "",
    nomineeRelation: "",
    panNumber: "",
    panCardFileKey: null,
    aadharNumber: "",
    aadhaarCardFileKey: null,
    bankProofFileKey: null,
    salarySlipsFileKey: null,
    itrDocumentsFileKey: null,
};

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (formData: any, isEdit: boolean) => Promise<boolean>;
    initialData?: LifeInsuranceData;
    mode?: 'create' | 'edit';
    setOpenDialog: (open: boolean) => void;
}

const LifeInsuranceFormDialog: React.FC<Props> = ({
    open,
    onClose,
    onSubmit,
    initialData,
    mode = 'create',
    setOpenDialog
}) => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<LifeInsuranceData>(defaultFormData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [successVoucherMessage, setSuccessVoucherMessage] = useState("");
    const [filePreviewUrls, setFilePreviewUrls] = useState<Record<string, string>>({});
    const [openLifeInsuranceSuccessSnackbar, setOpenLifeInsuranceSuccessSnackbar] = useState(false);
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const DOCUMENT_URL = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL || 'https://connect-india-upload-documents.s3.ap-south-1.amazonaws.com';
    const steps = ["Personal Info", "Basic Info", "Work Info", "Nominee Info", "Documents", "Review"];
    const gridSpacing = { xs: 12, sm: 6 };

    const getToken = () => {
        if (typeof window !== "undefined") {
            return localStorage.getItem('accessToken');
        }
        return null;
    }
    const token = getToken();

    const getRoleId = () => {
        if (typeof window !== "undefined") {
            const storedRole = localStorage.getItem("roleId");
            return storedRole ? parseInt(storedRole, 10) : null;
        }
        return null;
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
    }, [token, roleId, router]);

    useEffect(() => {
        if (open) {
            if (mode === 'edit' && initialData) {
                setFormData(initialData);
                const urls: Record<string, string> = {};

                // Handle file previews for existing documents
                if (initialData.panCardFileKey && typeof initialData.panCardFileKey === 'string') {
                    urls.panCardFileKey = `${DOCUMENT_URL}/${initialData.panCardFileKey}`;
                }
                if (initialData.aadhaarCardFileKey && typeof initialData.aadhaarCardFileKey === 'string') {
                    urls.aadhaarCardFileKey = `${DOCUMENT_URL}/${initialData.aadhaarCardFileKey}`;
                }
                if (initialData.bankProofFileKey && typeof initialData.bankProofFileKey === 'string') {
                    urls.bankProofFileKey = `${DOCUMENT_URL}/${initialData.bankProofFileKey}`;
                }
                if (initialData.salarySlipsFileKey && typeof initialData.salarySlipsFileKey === 'string') {
                    urls.salarySlipsFileKey = `${DOCUMENT_URL}/${initialData.salarySlipsFileKey}`;
                }
                if (initialData.itrDocumentsFileKey && typeof initialData.itrDocumentsFileKey === 'string') {
                    urls.itrDocumentsFileKey = `${DOCUMENT_URL}/${initialData.itrDocumentsFileKey}`;
                }
                setFilePreviewUrls(urls);
            } else {
                setFormData(defaultFormData);
                setFilePreviewUrls({});
            }
            setStep(1);
            setSuccess(false);
            setErrors({});
        }
    }, [open, mode, initialData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateField = (fieldName: string, value: string) => {
        const newErrors = { ...errors };

        switch (fieldName) {
            case 'panNumber':
                if (!value?.trim()) newErrors.panNumber = "PAN number is required";
                else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value)) newErrors.panNumber = "Invalid PAN format";
                else delete newErrors.panNumber;
                break;
            case 'aadharNumber':
                if (!value?.trim()) newErrors.aadharNumber = "Aadhar number is required";
                else if (!/^\d{12}$/.test(value)) newErrors.aadharNumber = "Aadhar must be 12 digits";
                else delete newErrors.aadharNumber;
                break;
            case 'email':
                if (!value?.trim()) newErrors.email = "Email is required";
                else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) newErrors.email = "Invalid email format";
                else delete newErrors.email;
                break;
            case 'mobile':
                if (!value?.trim()) newErrors.mobile = "Mobile number is required";
                else if (!/^[6-9]\d{9}$/.test(value)) newErrors.mobile = "Invalid mobile number";
                else delete newErrors.mobile;
                break;
            case 'heightCM':
                if (!value?.trim()) newErrors.heightCM = "Height is required";
                else if (isNaN(Number(value)) || Number(value) <= 0) newErrors.heightCM = "Invalid height";
                else delete newErrors.heightCM;
                break;
            case 'weightKG':
                if (!value?.trim()) newErrors.weightKG = "Weight is required";
                else if (isNaN(Number(value)) || Number(value) <= 0) newErrors.weightKG = "Invalid weight";
                else delete newErrors.weightKG;
                break;
            case 'annualIncome':
                if (!value?.trim()) newErrors.annualIncome = "Annual income is required";
                else if (isNaN(Number(value)) || Number(value) <= 0) newErrors.annualIncome = "Invalid amount";
                else delete newErrors.annualIncome;
                break;
            case 'nomineeDOB':
                if (!value?.trim()) newErrors.nomineeDOB = "Date of birth is required";
                else if (new Date(value) > new Date()) newErrors.nomineeDOB = "Date cannot be in future";
                else delete newErrors.nomineeDOB;
                break;
            default:
                if (!value?.trim()) newErrors[fieldName] = "This field is required";
                else delete newErrors[fieldName];
        }

        setErrors(newErrors);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        validateField(name, value);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files?.length) {
            const file = files[0];
            const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
            const maxSize = 10 * 1024 * 1024; // 10MB

            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({ ...prev, [name]: "Only JPG, PNG, or PDF files are allowed" }));
                return;
            }

            if (file.size > maxSize) {
                setErrors(prev => ({ ...prev, [name]: "File size must be less than 10MB" }));
                return;
            }

            setFormData(prev => ({ ...prev, [name]: file }));
            setErrors(prev => ({ ...prev, [name]: "" }));
            const previewUrl = URL.createObjectURL(file);
            setFilePreviewUrls(prev => ({ ...prev, [name]: previewUrl }));
        }
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            salarySlipsFileKey: value === "Job" ? prev.salarySlipsFileKey : null,
            itrDocumentsFileKey: value === "Business" ? prev.itrDocumentsFileKey : null,
        }));
    };

    const validateStep = () => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            validateField('email', formData.email);
            validateField('mobile', formData.mobile);
            validateField('panNumber', formData.panNumber);
            validateField('aadharNumber', formData.aadharNumber);
        }

        if (step === 2) {
            validateField('motherName', formData.motherName);
            validateField('placeOfBirth', formData.placeOfBirth);
            validateField('heightCM', formData.heightCM);
            validateField('weightKG', formData.weightKG);
        }

        if (step === 3) {
            validateField('annualIncome', formData.annualIncome);
            if (!formData.occupation) newErrors.occupation = "Occupation is required";
        }

        if (step === 4) {
            validateField('nomineeName', formData.nomineeName);
            validateField('nomineeDOB', formData.nomineeDOB);
            validateField('nomineeRelation', formData.nomineeRelation);
        }

        if (step === 5) {
            if (formData.occupation === "Job" && !formData.salarySlipsFileKey) {
                newErrors.salarySlipsFileKey = "Salary slip is required for Job";
            }
            if (formData.occupation === "Business" && !formData.itrDocumentsFileKey) {
                newErrors.itrDocumentsFileKey = "ITR proof is required for Business";
            }
            if (!formData.panCardFileKey) newErrors.panCardFileKey = "PAN card is required";
            if (!formData.aadhaarCardFileKey) newErrors.aadhaarCardFileKey = "Aadhar card is required";
            if (!formData.bankProofFileKey) newErrors.bankProofFileKey = "Bank proof is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep()) {
            setStep(prev => prev + 1);
        }
    };

    const handleBack = () => setStep(prev => prev - 1);

    const uploadFileToServer = async (file: File, folderName: string): Promise<string> => {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No authentication token found');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('mediaType', 'document');
        formData.append('description', 'Life insurance document');
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
        setSuccessVoucherMessage(response.data.message);
        return response.data.result.key;
    };

    const handleClose = () => {
        setFormData(defaultFormData);
        setErrors({});
        setStep(1);
        setSuccess(false);
        setOpenDialog(false);
        onClose();
    };

    const handleFormSubmit = async () => {
        if (!validateStep()) return;

        setLoading(true);

        try {
            const uploadPromises: Promise<{ field: string, key: string }>[] = [];
            const isEdit = mode === 'edit';

            // Prepare data for submission
            const submissionData: any = { ...formData };

            // Handle file uploads for new or changed files
            const fileMappings = [
                { field: 'panCardFileKey', folder: 'pan' },
                { field: 'aadhaarCardFileKey', folder: 'aadhar' },
                { field: 'bankProofFileKey', folder: 'bank-proof' },
                ...(formData.occupation === 'Job' ? [{ field: 'salarySlipsFileKey', folder: 'salary-slips' }] : []),
                ...(formData.occupation === 'Business' ? [{ field: 'itrDocumentsFileKey', folder: 'itr-documents' }] : [])
            ];

            for (const { field, folder } of fileMappings) {
                const file = formData[field as keyof LifeInsuranceData];
                if (file instanceof File) {
                    uploadPromises.push(
                        uploadFileToServer(file, folder)
                            .then(key => ({ field, key }))
                            .catch(error => {
                                console.error(`Error uploading ${field}:`, error);
                                throw error;
                            })
                    );
                } else if (isEdit && typeof file === 'string') {
                    // Keep existing file key if not changed
                    submissionData[field] = file;
                }
            }

            // Wait for all file uploads to complete
            const uploadResults = await Promise.all(uploadPromises);

            // Update submission data with new file keys
            uploadResults.forEach(({ field, key }) => {
                submissionData[field] = key;
            });

            // Submit the form data
            const isSuccessful = await onSubmit(submissionData, isEdit);

            if (isSuccessful) {
                setSuccess(true);
                setOpenLifeInsuranceSuccessSnackbar(true);
                setTimeout(() => {
                    handleClose();
                }, 2000);
            }
        } catch (error) {
            console.error('Form submission failed:', error);
            setErrors(prev => ({ ...prev, form: 'Failed to submit form. Please try again.' }));
        } finally {
            setLoading(false);
        }
    };

    const renderFileUpload = (label: string, name: keyof LifeInsuranceData) => {
        const fileValue = formData[name];
        const hasFile = !!fileValue;
        const previewUrl = filePreviewUrls[name] ||
            (fileValue instanceof File ? URL.createObjectURL(fileValue) : null);

        return (
            <Grid item {...gridSpacing}>
                <Stack spacing={1}>
                    <Typography variant="body2" fontWeight="medium">
                        {label} <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <Button
                        component="label"
                        fullWidth
                        variant={hasFile ? "contained" : "outlined"}
                        startIcon={<AttachFileIcon />}
                        disabled={loading}
                        sx={{
                            justifyContent: 'flex-start',
                            textTransform: 'none',
                            height: '56px'
                        }}
                    >
                        {hasFile ? (fileValue instanceof File ? fileValue.name : 'Uploaded') : 'Choose File'}
                        <input
                            hidden
                            type="file"
                            name={name}
                            accept="image/*,application/pdf"
                            onChange={handleFileChange}
                            disabled={loading}
                        />
                    </Button>
                    {hasFile && previewUrl && (
                        <Link
                            href={previewUrl}
                            target="_blank"
                            rel="noopener"
                            variant="body2"
                            sx={{ display: 'inline-flex', alignItems: 'center' }}
                        >
                            <AttachFileIcon fontSize="small" sx={{ mr: 0.5 }} />
                            View Uploaded File
                        </Link>
                    )}
                    {errors[name] && (
                        <FormHelperText error>{errors[name]}</FormHelperText>
                    )}
                </Stack>
            </Grid>
        );
    };

    const renderReviewItem = (label: string, value: any, name?: keyof FilePreviewUrls) => {
        if (value === null || value === undefined || value === "") return null;

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
                    ) : name && filePreviewUrls[name] ? (
                        <Link href={filePreviewUrls[name]!} target="_blank" rel="noopener">
                            View Document
                        </Link>
                    ) : (
                        <Typography variant="body1">
                            {typeof value === 'string' && value.includes('T') && !isNaN(Date.parse(value))
                                ? formatDate(value)
                                : value}
                        </Typography>
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

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Document Information</Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                    {formData.occupation === "Job" && renderReviewItem("Salary Slips", formData.salarySlipsFileKey, "salarySlipsFileKey")}
                    {formData.occupation === "Business" && renderReviewItem("ITR Documents", formData.itrDocumentsFileKey, "itrDocumentsFileKey")}
                    {renderReviewItem("PAN Card", formData.panCardFileKey, "panCardFileKey")}
                    {renderReviewItem("Aadhar Card", formData.aadhaarCardFileKey, "aadhaarCardFileKey")}
                    {renderReviewItem("Bank Proof", formData.bankProofFileKey, "bankProofFileKey")}
                </Grid>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Personal Information</Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                    {renderReviewItem("Email", formData.email)}
                    {renderReviewItem("Mobile", formData.mobile)}
                    {renderReviewItem("PAN Number", formData.panNumber)}
                    {renderReviewItem("Aadhar Number", formData.aadharNumber)}
                </Grid>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Basic Information</Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                    {renderReviewItem("Mother's Name", formData.motherName)}
                    {renderReviewItem("Place of Birth", formData.placeOfBirth)}
                    {renderReviewItem("Height (cm)", formData.heightCM)}
                    {renderReviewItem("Weight (kg)", formData.weightKG)}
                    {renderReviewItem("Smoker", formData.smoker)}
                    {renderReviewItem("Alcohol", formData.alcohol)}
                </Grid>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Work Information</Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                    {renderReviewItem("Annual Income", formData.annualIncome)}
                    {renderReviewItem("Occupation", formData.occupation)}
                </Grid>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Nominee Information</Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                    {renderReviewItem("Nominee Name", formData.nomineeName)}
                    {renderReviewItem("Nominee DOB", formData.nomineeDOB)}
                    {renderReviewItem("Nominee Relation", formData.nomineeRelation)}
                </Grid>
            </Box>
        );
    };

    const handleCloseVoucherSuccessSnackbar = () => {
        setOpenLifeInsuranceSuccessSnackbar(false);
    }

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <Grid container spacing={3}>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.email}
                                helperText={errors.email}
                                disabled={loading || mode === 'edit'}
                                required
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label="Mobile Number"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.mobile}
                                helperText={errors.mobile}
                                // disabled={loading || mode === 'edit'}
                                required
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label="PAN Number"
                                name="panNumber"
                                value={formData.panNumber}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.panNumber}
                                helperText={errors.panNumber || "Format: ABCDE1234F"}
                                // disabled={loading || mode === 'edit'}
                                required
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label="Aadhar Number"
                                name="aadharNumber"
                                value={formData.aadharNumber}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.aadharNumber}
                                helperText={errors.aadharNumber || "12 digits"}
                                // disabled={loading || mode === 'edit'}
                                required
                            />
                        </Grid>
                    </Grid>
                );
            case 2:
                return (
                    <Grid container spacing={3}>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label="Mother's Name"
                                name="motherName"
                                value={formData.motherName}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.motherName}
                                helperText={errors.motherName}
                                disabled={loading}
                                required
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label="Place of Birth"
                                name="placeOfBirth"
                                value={formData.placeOfBirth}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.placeOfBirth}
                                helperText={errors.placeOfBirth}
                                disabled={loading}
                                required
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label="Height (cm)"
                                name="heightCM"
                                type="number"
                                value={formData.heightCM}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.heightCM}
                                helperText={errors.heightCM}
                                disabled={loading}
                                required
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label="Weight (kg)"
                                name="weightKG"
                                type="number"
                                value={formData.weightKG}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.weightKG}
                                helperText={errors.weightKG}
                                disabled={loading}
                                required
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <FormControl fullWidth required>
                                <InputLabel>Smoker</InputLabel>
                                <Select
                                    name="smoker"
                                    value={formData.smoker}
                                    onChange={handleSelectChange}
                                    label="Smoker"
                                    disabled={loading}
                                >
                                    <MenuItem value="No">No</MenuItem>
                                    <MenuItem value="Yes">Yes</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <FormControl fullWidth required>
                                <InputLabel>Alcohol</InputLabel>
                                <Select
                                    name="alcohol"
                                    value={formData.alcohol}
                                    onChange={handleSelectChange}
                                    label="Alcohol"
                                    disabled={loading}
                                >
                                    <MenuItem value="No">No</MenuItem>
                                    <MenuItem value="Yes">Yes</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                );
            case 3:
                return (
                    <Grid container spacing={3}>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label="Annual Income (₹)"
                                name="annualIncome"
                                type="number"
                                value={formData.annualIncome}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.annualIncome}
                                helperText={errors.annualIncome}
                                disabled={loading}
                                required
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <FormControl fullWidth error={!!errors.occupation} required>
                                <InputLabel>Occupation</InputLabel>
                                <Select
                                    name="occupation"
                                    value={formData.occupation}
                                    onChange={handleSelectChange}
                                    label="Occupation"
                                    disabled={loading}
                                >
                                    <MenuItem value="Job">Job</MenuItem>
                                    <MenuItem value="Business">Business</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                                {errors.occupation && (
                                    <FormHelperText error>{errors.occupation}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                    </Grid>
                );
            case 4:
                return (
                    <Grid container spacing={3}>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label="Nominee Name"
                                name="nomineeName"
                                value={formData.nomineeName}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.nomineeName}
                                helperText={errors.nomineeName}
                                disabled={loading}
                                required
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label="Nominee Date of Birth"
                                name="nomineeDOB"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={formData.nomineeDOB || ""}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.nomineeDOB}
                                helperText={errors.nomineeDOB}
                                disabled={loading}
                                required
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label="Nominee Relation"
                                name="nomineeRelation"
                                value={formData.nomineeRelation}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.nomineeRelation}
                                helperText={errors.nomineeRelation}
                                disabled={loading}
                                required
                            />
                        </Grid>
                    </Grid>
                );
            case 5:
                return (
                    <Grid container spacing={3}>
                        {formData.occupation === "Job" && renderFileUpload("Salary Slips", "salarySlipsFileKey")}
                        {formData.occupation === "Business" && renderFileUpload("ITR Documents", "itrDocumentsFileKey")}
                        {renderFileUpload("PAN Card", "panCardFileKey")}
                        {renderFileUpload("Aadhar Card", "aadhaarCardFileKey")}
                        {renderFileUpload("Bank Proof", "bankProofFileKey")}
                    </Grid>
                );
            case 6:
                return renderReviewStep();
            default:
                return null;
        }
    };

    return (
        <>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">
                            {mode === 'edit' ? 'Edit Life Insurance Application' : 'New Life Insurance Application'}
                        </Typography>
                        <IconButton onClick={handleClose} disabled={loading}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Stepper activeStep={step - 1} alternativeLabel sx={{ mb: 3, mt: 2 }}>
                        {steps.map(label => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {success ? (
                        <Box sx={{ textAlign: 'center', p: 4 }}>
                            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                            <Typography variant="h5" gutterBottom>
                                {mode === 'edit' ? 'Application Updated Successfully!' : 'Application Submitted Successfully!'}
                            </Typography>
                            <Typography color="text.secondary">
                                Your life insurance application has been {mode === 'edit' ? 'updated' : 'received'}. Well contact you shortly.
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ mt: 2 }}>
                            {renderStepContent()}
                            {errors.form && (
                                <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
                                    {errors.form}
                                </Typography>
                            )}
                        </Box>
                    )}
                </DialogContent>
                {!success && (
                    <DialogActions sx={{ p: 3, pt: 0 }}>
                        {step > 1 && (
                            <Button onClick={handleBack} disabled={loading}>
                                Back
                            </Button>
                        )}
                        {step < steps.length ? (
                            <Button
                                onClick={handleNext}
                                variant="contained"
                                disabled={loading}
                                sx={{ minWidth: 120 }}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                onClick={handleFormSubmit}
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                endIcon={loading ? <CircularProgress size={20} /> : null}
                                sx={{ minWidth: 160 }}
                            >
                                {mode === 'edit' ? 'Update Application' : 'Submit Application'}
                            </Button>
                        )}
                    </DialogActions>
                )}
            </Dialog>
            <Snackbar
                open={openLifeInsuranceSuccessSnackbar}
                autoHideDuration={3000}
                onClose={handleCloseVoucherSuccessSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert onClose={handleCloseVoucherSuccessSnackbar} variant="filled" severity="success" sx={{ width: '100%' }}>
                    {successVoucherMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default LifeInsuranceFormDialog;