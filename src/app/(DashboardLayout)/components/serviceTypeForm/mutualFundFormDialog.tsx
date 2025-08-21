import React, { useEffect, useState, useCallback } from "react";
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
    FormControlLabel,
    Checkbox
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";

interface MutualFundData {
    aadharNumber: string;
    aadhaarCardFileKey: File | string | null;
    panNumber: string;
    panCardFileKey: File | string | null;
    bankProofFileKey: File | string | null;
    salarySlipsFileKey: File | string | null;
    itrDcumentsFileKey: File | string | null;
    email: string;
    mobile: string;
    placeOfBirth: string;
    income: string;
    occupation: string;
    nomineeId: string;
    nomineeMobile: string;
    nomineeRelation: string;
    isDetailsConfirmed: boolean;
}

const defaultFormData: MutualFundData = {
    aadharNumber: "",
    aadhaarCardFileKey: null,
    panNumber: "",
    panCardFileKey: null,
    bankProofFileKey: null,
    salarySlipsFileKey: null,
    itrDcumentsFileKey: null,
    email: "",
    mobile: "",
    placeOfBirth: "",
    income: "",
    occupation: "",
    nomineeId: "",
    nomineeMobile: "",
    nomineeRelation: "",
    isDetailsConfirmed: false
};

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (formData: any, isEdit: boolean) => Promise<boolean>;
    initialData?: MutualFundData;
    mode?: 'create' | 'edit';
    setOpenDialog: (open: boolean) => void;
}
const MutualFundFormDialog: React.FC<Props> = ({
    open,
    onClose,
    onSubmit,
    initialData,
    mode = 'create'
}) => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<MutualFundData>(defaultFormData);
    // const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [filePreviewUrls, setFilePreviewUrls] = useState<Record<string, string>>({});
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const DOCUMENT_URL = process.env.AWS_S3_BUCKET_URL || 'https://connect-india-upload-documents.s3.ap-south-1.amazonaws.com';
    const steps = ["Basic Details", "Personal Details", "Nominee Details", "Documents", "Review"];
    const gridSpacing = { xs: 12, sm: 6 };
    const [declarationIsDetailsConfirmed, setDeclarationIsDetailsConfirmed] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const getToken = useCallback(() => {
        return typeof window !== "undefined" ? localStorage.getItem('accessToken') : null;
    }, []);

    const getRoleId = useCallback(() => {
        if (typeof window !== "undefined") {
            const storedRole = localStorage.getItem("roleId");
            return storedRole ? parseInt(storedRole, 10) : null;
        }
        return null;
    }, []);

    useEffect(() => {
        const token = getToken();
        const roleId = getRoleId();

        if (!token || !roleId) {
            localStorage.clear();
            router.push("/authentication/login");
            return;
        }

        try {
            const decoded: any = jwtDecode(token);
            if (decoded.exp * 1000 < Date.now()) {
                localStorage.clear();
                router.push("/authentication/login");
                return;
            }

            if (roleId !== 3) {
                localStorage.clear();
                router.push("/authentication/login");
            }
        } catch (error) {
            localStorage.clear();
            router.push("/authentication/login");
        }
    }, [getToken, getRoleId, router]);

    useEffect(() => {
        if (mode === 'edit' && initialData) {
            setFormData(initialData);
            const urls: Record<string, string> = {};

            const documentKeys: (keyof MutualFundData)[] = [
                'aadhaarCardFileKey',
                'panCardFileKey',
                'bankProofFileKey',
                'salarySlipsFileKey',
                'itrDcumentsFileKey'
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

    // Validation functions
    const validateField = useCallback((name: string, value: string | File | null): string => {
        switch (name) {
            case 'aadharNumber':
                if (!value) return "Aadhar number is required";
                if (typeof value === 'string' && !/^\d{12}$/.test(value)) return "Aadhar must be 12 digits";
                return "";
            case 'panNumber':
                if (!value) return "PAN number is required";
                if (typeof value !== 'string') return "Invalid value type for PAN";

                const pan = value.trim();
                if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) return "Invalid PAN format";
                return "";
            case 'email':
                if (!value) return "Email is required";
                if (typeof value !== 'string') return "Invalid email input";
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(value)) return "Invalid email format";
                return "";
            case 'mobile':
                if (!value) return "Mobile number is required";
                if (typeof value === 'string' && !/^[6-9]\d{9}$/.test(value)) return "Invalid mobile number";
                return "";
            case 'placeOfBirth':
                if (!value) return "Place of birth is required";
                if (typeof value !== 'string') return "Invalid place of birth input";
                return "";

            case 'income': {
                if (!value) return "Income is required";
                if (typeof value !== 'string') return "Invalid income input";
                const incomeValue = value.trim();
                if (!/^[1-9]\d{2,7}$/.test(incomeValue)) {
                    return "Income must be 3 to 8 digits and not start with 0";
                }
                return "";
            }
            case 'nomineeId':
                return validateNomineeId(value as string, formData.panNumber, formData.aadharNumber);
            case 'nomineeRelation':
                if (!value) return "This field is required";
                return "";
            case 'nomineeMobile':
                if (!value) return "Nominee mobile is required";
                if (typeof value === 'string' && !/^[6-9]\d{9}$/.test(value)) return "Invalid nominee mobile number";
                return "";
            case 'occupation':
                if (!value) return "Occupation is required";
                return "";
            case 'aadhaarCardFileKey':
            case 'panCardFileKey':
            case 'bankProofFileKey':
                if (!value) return "This document is required";
                return "";
            case 'salarySlipsFileKey':
                if (formData.occupation === "Job" && !value) return "Salary slips are required for Job";
                return "";
            case 'itrDcumentsFileKey':
                if (formData.occupation === "Business" && !value) return "ITR documents are required for Business";
                return "";
            default:
                return "";
        }
    }, [formData.occupation]);

    function validateNomineeId(nomineeId: string, panNumber: string, aadhaarNumber: string): string {
        if (!nomineeId) return "Nominee ID is required";

        const trimmedNomineeId = nomineeId.trim();
        if (!/^\d{10,12}$/.test(trimmedNomineeId)) {
            return "Nominee ID must be 10 to 12 digits";
        }
        const normalizedPAN = panNumber?.trim()?.toUpperCase() || "";
        const normalizedAadhaar = aadhaarNumber?.trim() || "";

        if (trimmedNomineeId === normalizedPAN) {
            return "Nominee ID should not be the same as PAN";
        }

        if (trimmedNomineeId === normalizedAadhaar) {
            return "Nominee ID should not be the same as Aadhaar";
        }

        return "";
    }
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

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        if (error) {
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (!files?.length) return;

        const file = files[0];
        const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
        const maxSize = 10 * 1024 * 1024;

        let error = "";
        if (!allowedTypes.includes(file.type)) {
            error = "Only JPG, PNG, or PDF allowed";
        } else if (file.size > maxSize) {
            error = "File size must be less than 10MB";
        }

        if (error) {
            setErrors(prev => ({ ...prev, [name]: error }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: file }));
        setErrors(prev => ({ ...prev, [name]: "" }));
        const previewUrl = URL.createObjectURL(file);
        setFilePreviewUrls(prev => ({ ...prev, [name]: previewUrl }));
    };

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            salarySlipsFileKey: value === "Job" ? prev.salarySlipsFileKey : null,
            itrDcumentsFileKey: value === "Business" ? prev.itrDcumentsFileKey : null,
        }));
        if (errors.occupation) {
            setErrors(prev => ({ ...prev, occupation: '' }));
        }
    };

    const validateStep = useCallback(() => {
        const newErrors: Record<string, string> = {};
        let isValid = true;
        switch (step) {
            case 1:
                ['aadharNumber', 'panNumber'].forEach(field => {
                    const error = validateField(field, formData[field as keyof MutualFundData] as string | File | null);
                    if (error) {
                        newErrors[field] = error;
                        isValid = false;
                    }
                });
                break;
            case 2:
                ['email', 'mobile', 'placeOfBirth', 'income', 'occupation'].forEach(field => {
                    const error = validateField(field, formData[field as keyof MutualFundData] as string | File | null);
                    if (error) {
                        newErrors[field] = error;
                        isValid = false;
                    }
                });
                break;
            case 3:
                ['nomineeId', 'nomineeMobile', 'nomineeRelation'].forEach(field => {
                    const error = validateField(field, formData[field as keyof MutualFundData] as string | File | null);
                    if (error) {
                        newErrors[field] = error;
                        isValid = false;
                    }
                });
                break;
            case 4:
                const documentFields: (keyof MutualFundData)[] = ['aadhaarCardFileKey', 'panCardFileKey', 'bankProofFileKey'];
                if (formData.occupation === "Job") documentFields.push('salarySlipsFileKey');
                if (formData.occupation === "Business") documentFields.push('itrDcumentsFileKey');

                documentFields.forEach(field => {
                    const error = validateField(field, formData[field] as string | File | null);
                    if (error) {
                        newErrors[field] = error;
                        isValid = false;
                    }
                });
                break;
        }

        setErrors(newErrors);
        return isValid;
    }, [step, formData, validateField]);

    const handleNext = () => {
        if (validateStep()) {
            setStep(prev => prev + 1);
        }
    };

    const handleBack = () => setStep(prev => prev - 1);

    const uploadFileToServer = async (file: File, folderName: string): Promise<string> => {
        const token = getToken();
        if (!token) throw new Error('No authentication token found');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('mediaType', 'document');
        formData.append('description', 'Mutual fund document');
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
        onClose(); // This calls the parent's onClose which should handle setting open state
    };

    // In MutualFundFormDialog component
    const handleFormSubmit = async () => {
        if (!validateStep()) return;

        // ✅ Checkbox validation
        if (!declarationIsDetailsConfirmed) {
            setErrors((prev) => ({
                ...prev,
                form: "You must accept the declaration before submitting the form."
            }));
            return; // Stop submission
        }

        setLoading(true);

        try {
            // 1. First upload all documents
            const uploadPromises: Promise<{ field: string; key: string }>[] = [];
            const fileMappings = [
                { field: "aadhaarCardFileKey", folder: "aadhar" },
                { field: "panCardFileKey", folder: "pan" },
                { field: "bankProofFileKey", folder: "bank-proof" },
                ...(formData.occupation === "Job"
                    ? [{ field: "salarySlipsFileKey", folder: "salary-slips" }]
                    : []),
                ...(formData.occupation === "Business"
                    ? [{ field: "itrDcumentsFileKey", folder: "itr-documents" }]
                    : []),
            ];

            for (const { field, folder } of fileMappings) {
                const file = formData[field as keyof MutualFundData];
                if (file instanceof File) {
                    uploadPromises.push(
                        uploadFileToServer(file, folder)
                            .then((key) => ({ field, key }))
                            .catch((error) => {
                                console.error(`Error uploading ${field}:`, error);
                                throw error;
                            })
                    );
                }
            }

            const uploadResults = await Promise.all(uploadPromises);

            // ✅ Final payload me checkbox bhi include karo
            const submissionData: MutualFundData = {
                ...formData,
                isDetailsConfirmed: declarationIsDetailsConfirmed, // ⬅️ yahan include
            };

            // Replace file objects with uploaded keys
            uploadResults.forEach(({ field, key }) => {
                (submissionData as any)[field] = key;
            });

            const isSuccessful = await onSubmit(submissionData, mode === "edit");

            if (isSuccessful) {
                setSuccess(true);
                setTimeout(() => {
                    handleClose();
                }, 2000);
            }
        } catch (error) {
            console.error("Form submission failed:", error);
            setErrors((prev) => ({
                ...prev,
                form: "Failed to submit form. Please try again.",
            }));
        } finally {
            setLoading(false);
        }
    };
    const renderFileUpload = (label: string, name: keyof MutualFundData) => {
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
                    ) : filePreviewUrls[label] ? (
                        <Link href={filePreviewUrls[label]} target="_blank" rel="noopener">
                            View Document
                        </Link>
                    ) : (
                        <Typography variant="body1">{value}</Typography>
                    )}
                </Paper>
            </Grid>
        );
    };

    const renderReviewStep = () => (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                Review Your Application
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Basic Information</Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
                {renderReviewItem("Aadhar Number", formData.aadharNumber)}
                {renderReviewItem("PAN Number", formData.panNumber)}
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Personal Information</Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
                {renderReviewItem("Email", formData.email)}
                {renderReviewItem("Mobile", formData.mobile)}
                {renderReviewItem("Place of Birth", formData.placeOfBirth)}
                {renderReviewItem("Annual Income", formData.income)}
                {renderReviewItem("Occupation", formData.occupation)}
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Nominee Information</Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
                {renderReviewItem("Nominee ID", formData.nomineeId)}
                {renderReviewItem("Nominee Mobile", formData.nomineeMobile)}
                {renderReviewItem("Nominee Relation", formData.nomineeRelation)}
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Documents</Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
                {formData.aadhaarCardFileKey && renderReviewItem("Aadhar Card", formData.aadhaarCardFileKey)}
                {formData.panCardFileKey && renderReviewItem("PAN Card", formData.panCardFileKey)}
                {formData.bankProofFileKey && renderReviewItem("Bank Proof", formData.bankProofFileKey)}
                {formData.occupation === "Job" && formData.salarySlipsFileKey &&
                    renderReviewItem("Salary Slips", formData.salarySlipsFileKey)}
                {formData.occupation === "Business" && formData.itrDcumentsFileKey &&
                    renderReviewItem("ITR Documents", formData.itrDcumentsFileKey)}
            </Grid>
            <Box sx={{ mt: 4 }}>
                <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ fontWeight: 500 }}
                >
                    Declaration
                </Typography>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={declarationIsDetailsConfirmed}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeclarationIsDetailsConfirmed(e.target.checked)}
                            color="primary"
                        />
                    }
                    label="I hereby declare that the information provided above is true, complete and correct to the best of my knowledge. I understand that any false information may result in rejection of my application."
                />

                {errors.form && (
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                        {errors.form}
                    </Typography>
                )}
            </Box>
        </Box>
    );
    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <Grid container spacing={2}>
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
                    </Grid>
                );
            case 2:
                return (
                    <Grid container spacing={2}>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
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
                            <FormControl fullWidth error={!!errors.occupation}>
                                <InputLabel required>Occupation</InputLabel>
                                <Select
                                    name="occupation"
                                    value={formData.occupation}
                                    onChange={handleSelectChange}
                                    label="Occupation"
                                    disabled={loading}
                                    required
                                >
                                    <MenuItem value="Job">Job</MenuItem>
                                    <MenuItem value="Business">Business</MenuItem>
                                </Select>
                                {errors.occupation && (
                                    <Typography color="error" variant="caption">
                                        {errors.occupation}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label={formData.occupation === "Business" ? "Net Gross Profit" : "Annual Income"}
                                name="income"
                                value={formData.income}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                inputProps={{
                                    maxLength: 8,
                                }}
                                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                    const input = e.currentTarget;
                                    if (input?.value?.length > 8) {
                                        input.value = input?.value.slice(0, 8);
                                    }
                                }}
                                error={!!errors.income}
                                helperText={errors.income}
                                disabled={loading}
                                required
                            />
                        </Grid>


                    </Grid>
                );
            case 3:
                return (
                    <Grid container spacing={2}>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label="Nominee ID (Aadhar or PAN)"
                                name="nomineeId"
                                value={formData.nomineeId}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.nomineeId}
                                helperText={errors.nomineeId}
                                disabled={loading}
                                required
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label="Nominee Mobile"
                                name="nomineeMobile"
                                value={formData.nomineeMobile}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.nomineeMobile}
                                helperText={errors.nomineeMobile}
                                disabled={loading}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Relation with Nominee"
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
            case 4:
                return (
                    <Grid container spacing={2}>
                        {renderFileUpload("Aadhar Card", "aadhaarCardFileKey")}
                        {renderFileUpload("PAN Card", "panCardFileKey")}
                        {renderFileUpload("Bank Proof", "bankProofFileKey")}
                        {formData.occupation === "Job" &&
                            renderFileUpload("Salary Slips", "salarySlipsFileKey")}
                        {formData.occupation === "Business" &&
                            renderFileUpload("ITR Documents", "itrDcumentsFileKey")}
                    </Grid>
                );
            case 5:
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
                        {mode === 'edit' ? 'Edit Mutual Fund Application' : 'New Mutual Fund Application'}
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
                            Your mutual fund application has been received. We'll contact you shortly.
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

export default MutualFundFormDialog;