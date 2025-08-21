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
    Checkbox,
    FormControlLabel
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { SelectChangeEvent } from "@mui/material/Select";
import { formatDate } from "@/utils/utils";
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";

interface HealthInsuranceData {
    panNumber: string;
    panCardFileKey: File | string | null;
    aadharNumber: string;
    aadhaarCardFileKey: File | string | null;
    bankProofFileKey: File | string | null;
    addressProofFileKey: File | string | null;
    medicalHistoryFileKey: File | string | null;
    email: string;
    mobile: string;
    gender: string;
    dob: string;
    heightCM: string;
    weightKG: string;
    annualIncome: string;
    occupation: string;
    preExistingConditions: string[];
    familyMedicalHistory: string;
    nomineeName: string;
    nomineeRelation: string;
    sumInsured: string;
    policyTerm: string;
}

const defaultFormData: HealthInsuranceData = {
    panNumber: "",
    panCardFileKey: null,
    aadharNumber: "",
    aadhaarCardFileKey: null,
    bankProofFileKey: null,
    addressProofFileKey: null,
    medicalHistoryFileKey: null,
    email: "",
    mobile: "",
    gender: "",
    dob: "",
    heightCM: "",
    weightKG: "",
    annualIncome: "",
    occupation: "",
    preExistingConditions: [],
    familyMedicalHistory: "",
    nomineeName: "",
    nomineeRelation: "",
    sumInsured: "",
    policyTerm: ""
};

const preExistingConditionsOptions = [
    "Diabetes",
    "Hypertension",
    "Heart Disease",
    "Asthma",
    "Cancer",
    "Kidney Disease",
    "Liver Disease",
    "Thyroid Disorder",
    "Arthritis",
    "Other"
];

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: HealthInsuranceData, isEdit: boolean) => void;
    initialData?: HealthInsuranceData;
    mode?: 'create' | 'edit';
}

const HealthInsuranceFormDialog: React.FC<Props> = ({
    open,
    onClose,
    onSubmit,
    initialData,
    mode = 'create'
}) => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<HealthInsuranceData>(defaultFormData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [filePreviewUrls, setFilePreviewUrls] = useState<Record<string, string>>({});
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const DOCUMENT_URL = process.env.AWS_S3_BUCKET_URL || 'https://connect-india-enterprises-bucket.s3.ap-south-1.amazonaws.com';
    const steps = ["Documents", "Personal Info", "Health Info", "Policy Details", "Review"];
    const gridSpacing = { xs: 12, sm: 6 };

    const getToken = () => {
        if (typeof window !== "undefined") {
            return localStorage.getItem('accessToken');
        }
    }
    const token = getToken();

    const getRoleId = () => {
        if (typeof window !== "undefined") {
            const storedRole = localStorage.getItem("roleId");
            return storedRole ? parseInt(storedRole, 10) : null;
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
            if (typeof initialData.panCardFileKey === 'string') {
                urls.panCardFileKey = `${DOCUMENT_URL}/${initialData.panCardFileKey}`;
            }
            if (typeof initialData.aadhaarCardFileKey === 'string') {
                urls.aadhaarCardFileKey = `${DOCUMENT_URL}/${initialData.aadhaarCardFileKey}`;
            }
            if (typeof initialData.bankProofFileKey === 'string') {
                urls.bankProofFileKey = `${DOCUMENT_URL}/${initialData.bankProofFileKey}`;
            }
            if (typeof initialData.addressProofFileKey === 'string') {
                urls.addressProofFileKey = `${DOCUMENT_URL}/${initialData.addressProofFileKey}`;
            }
            if (typeof initialData.medicalHistoryFileKey === 'string') {
                urls.medicalHistoryFileKey = `${DOCUMENT_URL}/${initialData.medicalHistoryFileKey}`;
            }
            setFilePreviewUrls(urls);
        } else {
            setFormData(defaultFormData);
            setFilePreviewUrls({});
        }
        setStep(1);
        setSuccess(false);
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

    const handleCheckboxChange = (condition: string) => {
        setFormData(prev => {
            const newConditions = prev.preExistingConditions.includes(condition)
                ? prev.preExistingConditions.filter(c => c !== condition)
                : [...prev.preExistingConditions, condition];
            return {
                ...prev,
                preExistingConditions: newConditions
            };
        });
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
            case 'sumInsured':
                if (!value?.trim()) newErrors.sumInsured = "Sum insured is required";
                // else if (isNaN(Number(value)) newErrors.sumInsured = "Invalid amount";
                else delete newErrors.sumInsured;
                break;
            case 'policyTerm':
                if (!value?.trim()) newErrors.policyTerm = "Policy term is required";
                else if (isNaN(Number(value))) newErrors.policyTerm = "Invalid term";
                else delete newErrors.policyTerm;
                break;
            case 'dob':
                if (!value?.trim()) newErrors.dob = "Date of birth is required";
                else if (new Date(value) > new Date()) newErrors.dob = "Date cannot be in future";
                else delete newErrors.dob;
                break;
            default:
                if (!value?.trim()) newErrors[fieldName] = "This field is required";
                else delete newErrors[fieldName];
        }

        setErrors(newErrors);
    };

    const handleBlur = (e: any) => {
        const { name, value } = e.target;
        validateField(name, value);
    };

    const handleFileChange = (e: any) => {
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
            [name]: value
        }));
    };

    const validateStep = () => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            validateField('panNumber', formData.panNumber);
            validateField('aadharNumber', formData.aadharNumber);
            if (!formData.panCardFileKey) newErrors.panCardFileKey = "PAN card is required";
            if (!formData.aadhaarCardFileKey) newErrors.aadhaarCardFileKey = "Aadhar card is required";
            if (!formData.bankProofFileKey) newErrors.bankProofFileKey = "Bank proof is required";
            if (!formData.addressProofFileKey) newErrors.addressProofFileKey = "Address proof is required";
        }

        if (step === 2) {
            validateField('email', formData.email);
            validateField('mobile', formData.mobile);
            validateField('gender', formData.gender);
            validateField('dob', formData.dob);
        }

        if (step === 3) {
            validateField('heightCM', formData.heightCM);
            validateField('weightKG', formData.weightKG);
            validateField('annualIncome', formData.annualIncome);
            if (!formData.occupation) newErrors.occupation = "Occupation is required";
            if (!formData.medicalHistoryFileKey) newErrors.medicalHistoryFileKey = "Medical history document is required";
        }

        if (step === 4) {
            validateField('sumInsured', formData.sumInsured);
            validateField('policyTerm', formData.policyTerm);
            validateField('nomineeName', formData.nomineeName);
            validateField('nomineeRelation', formData.nomineeRelation);
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
        formData.append('description', 'Health insurance document');
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
            const uploadPromises: Promise<{ field: any, key: any }>[] = [];
            const isEdit = mode === 'edit';
            const fileMappings = [
                { field: 'panCardFileKey', folder: 'pan' },
                { field: 'aadhaarCardFileKey', folder: 'aadhar' },
                { field: 'bankProofFileKey', folder: 'bank-proof' },
                { field: 'addressProofFileKey', folder: 'address-proof' },
                { field: 'medicalHistoryFileKey', folder: 'medical-history' }
            ];

            for (const { field, folder } of fileMappings) {
                const file = formData[field as keyof HealthInsuranceData];
                if (file instanceof File) {
                    uploadPromises.push(
                        uploadFileToServer(file, folder)
                            .then(key => ({ field, key }))
                            .catch(error => {
                                console.error(`Error uploading ${field}:`, error);
                                throw error;
                            })
                    );
                }
            }

            const uploadResults = await Promise.all(uploadPromises);
            const submissionData = { ...formData };

            uploadResults.forEach(({ field, key }) => {
                submissionData[field as keyof HealthInsuranceData] = key;
            });

            onSubmit(submissionData, isEdit);
            setSuccess(true);
            setTimeout(() => {
                handleClose();
            }, 2000);
        } catch (error) {
            console.error('Form submission failed:', error);
            setErrors(prev => ({ ...prev, form: 'Failed to submit form. Please try again.' }));
        } finally {
            setLoading(false);
        }
    };

    const renderFileUpload = (label: string, name: keyof HealthInsuranceData) => {
        const fileValue = formData[name];
        const hasFile = !!fileValue;
        const previewUrl = filePreviewUrls[name] ||
            (fileValue instanceof File ? URL.createObjectURL(fileValue) :
                typeof fileValue === 'string' ? `${DOCUMENT_URL}/${fileValue}` : null);

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

    const renderReviewItem = (label: string, value: any) => {
        if (value === null || value === undefined || value === "") return null;

        if (Array.isArray(value) && value.length === 0) return null;

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
                    ) : filePreviewUrls[label] ? (
                        <Link href={filePreviewUrls[label]} target="_blank" rel="noopener">
                            View Document
                        </Link>
                    ) : Array.isArray(value) ? (
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                            {value.map((item, index) => (
                                <li key={index}>
                                    <Typography variant="body1">{item}</Typography>
                                </li>
                            ))}
                        </ul>
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
                    {renderReviewItem("PAN Number", formData.panNumber)}
                    {renderReviewItem("Aadhar Number", formData.aadharNumber)}
                    {renderReviewItem("PAN Card", formData.panCardFileKey)}
                    {renderReviewItem("Aadhar Card", formData.aadhaarCardFileKey)}
                    {renderReviewItem("Bank Proof", formData.bankProofFileKey)}
                    {renderReviewItem("Address Proof", formData.addressProofFileKey)}
                </Grid>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Personal Information</Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                    {renderReviewItem("Email", formData.email)}
                    {renderReviewItem("Mobile", formData.mobile)}
                    {renderReviewItem("Gender", formData.gender)}
                    {renderReviewItem("Date of Birth", formData.dob)}
                </Grid>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Health Information</Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                    {renderReviewItem("Height (cm)", formData.heightCM)}
                    {renderReviewItem("Weight (kg)", formData.weightKG)}
                    {renderReviewItem("Annual Income", formData.annualIncome)}
                    {renderReviewItem("Occupation", formData.occupation)}
                    {renderReviewItem("Pre-existing Conditions", formData.preExistingConditions)}
                    {renderReviewItem("Family Medical History", formData.familyMedicalHistory)}
                    {renderReviewItem("Medical History Document", formData.medicalHistoryFileKey)}
                </Grid>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Policy Details</Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                    {renderReviewItem("Sum Insured", formData.sumInsured)}
                    {renderReviewItem("Policy Term", formData.policyTerm)}
                    {renderReviewItem("Nominee Name", formData.nomineeName)}
                    {renderReviewItem("Nominee Relation", formData.nomineeRelation)}
                </Grid>
            </Box>
        );
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <Grid container spacing={3}>
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
                                disabled={loading}
                                required
                            />
                        </Grid>
                        {renderFileUpload("PAN Card", "panCardFileKey")}
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
                                disabled={loading}
                                required
                            />
                        </Grid>
                        {renderFileUpload("Aadhar Card", "aadhaarCardFileKey")}
                        {renderFileUpload("Bank Proof", "bankProofFileKey")}
                        {renderFileUpload("Address Proof", "addressProofFileKey")}
                    </Grid>
                );
            case 2:
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
                                disabled={loading}
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
                                disabled={loading}
                                required
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <FormControl fullWidth required error={!!errors.gender}>
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleSelectChange}
                                    label="Gender"
                                    disabled={loading}
                                >
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                                {errors.gender && (
                                    <FormHelperText error>{errors.gender}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label="Date of Birth"
                                name="dob"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={formData.dob || ""}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.dob}
                                helperText={errors.dob}
                                disabled={loading}
                                required
                            />
                        </Grid>
                    </Grid>
                );
            case 3:
                return (
                    <Grid container spacing={3}>
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
                                    <MenuItem value="Professional">Professional</MenuItem>
                                    <MenuItem value="Homemaker">Homemaker</MenuItem>
                                    <MenuItem value="Retired">Retired</MenuItem>
                                    <MenuItem value="Student">Student</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </Select>
                                {errors.occupation && (
                                    <FormHelperText error>{errors.occupation}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Pre-existing Conditions (Select all that apply)
                            </Typography>
                            <Grid container spacing={2}>
                                {preExistingConditionsOptions.map(condition => (
                                    <Grid item xs={12} sm={6} md={4} key={condition}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={formData.preExistingConditions.includes(condition)}
                                                    onChange={() => handleCheckboxChange(condition)}
                                                    name={condition}
                                                    disabled={loading}
                                                />
                                            }
                                            label={condition}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Family Medical History"
                                name="familyMedicalHistory"
                                value={formData.familyMedicalHistory}
                                onChange={handleInputChange}
                                multiline
                                rows={3}
                                disabled={loading}
                            />
                        </Grid>
                        {renderFileUpload("Medical History Document", "medicalHistoryFileKey")}
                    </Grid>
                );
            case 4:
                return (
                    <Grid container spacing={3}>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label="Sum Insured (₹)"
                                name="sumInsured"
                                type="number"
                                value={formData.sumInsured}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.sumInsured}
                                helperText={errors.sumInsured || "Coverage amount you want"}
                                disabled={loading}
                                required
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label="Policy Term (Years)"
                                name="policyTerm"
                                type="number"
                                value={formData.policyTerm}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.policyTerm}
                                helperText={errors.policyTerm || "Duration of policy in years"}
                                disabled={loading}
                                required
                            />
                        </Grid>
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
                return renderReviewStep();
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">
                        {mode === 'edit' ? 'Edit Health Insurance Application' : 'New Health Insurance Application'}
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
                            Application Submitted Successfully!
                        </Typography>
                        <Typography color="text.secondary">
                            Your health insurance application has been received. We'll contact you shortly.
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
    );
};

export default HealthInsuranceFormDialog;