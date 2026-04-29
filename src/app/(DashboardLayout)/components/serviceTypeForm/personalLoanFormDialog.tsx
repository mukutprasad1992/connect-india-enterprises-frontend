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
    Avatar,
    StepButton,
    Snackbar,
    Alert,
    FormControlLabel,
    Checkbox,
    Autocomplete,
    InputAdornment,
    Tooltip,
    Chip
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useRouter } from 'next/navigation';
import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import DeleteIcon from "@mui/icons-material/Delete";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { jwtDecode } from "jwt-decode";
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import CloseConfirmDialog from "../CloseConfirmDialog";
interface LoanFormData {
    id: number | null;
    motherName: string;
    landmark: string;
    email: string;
    currentAddress: string;
    yearsOfCity: number | null;
    alternateNo: string;
    maritalStatus: string;
    designation: string;
    companyExp: number | null;
    totalWorkExp: number | null;
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
    aadharCardFileKey: File | string | null;
    salarySlipsFileKey: File | string | null;
    bankStatementFileKey: File | string | null;
    submit: boolean,
    activeSteps: string,
    serviceSubTypeName: string,
    status: string,

}

const defaultFormData: LoanFormData = {
    id: null as any,
    motherName: "",
    landmark: "",
    email: "",
    currentAddress: "",
    yearsOfCity: null,
    alternateNo: "",
    maritalStatus: "",
    designation: "",
    companyExp: null,
    totalWorkExp: null,
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
    aadharCardFileKey: null,
    salarySlipsFileKey: null,
    bankStatementFileKey: null,
    submit: false,
    activeSteps: '',
    serviceSubTypeName: '',
    status: ''
};

interface Props {
    open: boolean;
    onClose: () => void;
    setOpenDialog: (open: boolean) => void;
    initialData?: LoanFormData | null;
    mode?: 'create' | 'edit';
    onSuccess?: () => void;
}

const PersonalLoanFormDialog: React.FC<Props> = ({
    open,
    onClose,
    setOpenDialog,
    initialData,
    mode = 'create',
    onSuccess,
}) => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<LoanFormData>(defaultFormData);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [maxAllowedStep, setMaxAllowedStep] = useState(1);
    const [filePreviewUrls, setFilePreviewUrls] = useState<Record<string, string>>({});
    const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
    const [dialogFileUrl, setDialogFileUrl] = useState<string | null>(null);
    const [dialogFileType, setDialogFileType] = useState<"image" | "pdf" | null>(null);
    const [fullScreen, setFullScreen] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [serviceId, setServiceId] = useState<number | null>(null);
    const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);
    const [closeConfirmDialog, setCloseConfirmDialog] = React.useState(false);
    const [savingNext, setSavingNext] = useState(false);
    const [savingBack, setSavingBack] = useState(false);
    const [initialFormData, setInitialFormData] = useState(formData);
    const [declarationIsDetailsConfirmed, setDeclarationIsDetailsConfirmed] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [savingStep, setSavingStep] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [fileToRemove, setFileToRemove] = useState<keyof LoanFormData | null>(null);
    const stepStatusMap: { [key: number]: string } = {
        1: "personalDetails",
        2: "contactDetails",
        3: "employmentDetails",
        4: "referenceDetails",
        5: "documents",
        6: "Review"
    };

    const statusStepMap: { [key: string]: number } = {
        "personalDetails": 1,
        "contactDetails": 2,
        "employmentDetails": 3,
        "referenceDetails": 4,
        "documents": 5,
        "Review": 6
    };
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const steps = ["Personal Details", "Contact Details", "Employment Details", "Reference Details", "Documents", "Review"];
    const maritalStatusOptions = ["Single", "Married", "Divorced", "Widowed"];
    const gridSpacing = { xs: 12, sm: 6 };
    const DOCUMENT_URL = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL;
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
        if (mode === "edit" && initialData) {
            const updatedFormData: any = { ...initialData };
            const urls: Record<string, string> = {};

            const documentKeys: (keyof LoanFormData)[] = [
                "aadharCardFileKey",
                "panCardFileKey",
                "photoFileKey",
                "salarySlipsFileKey",
                "bankStatementFileKey"
            ];

            documentKeys.forEach((key) => {
                if (typeof initialData[key] === "string" && initialData[key] !== "") {
                    urls[key] = `${DOCUMENT_URL}/${initialData[key]}`;
                    updatedFormData[key] = initialData[key];
                }
            });
            setFormData(updatedFormData);
            setInitialFormData(updatedFormData);
            setFilePreviewUrls(urls);
            if (initialData.submit === true) {
                setIsReviewSubmitted(true)
            }
            else {
                setIsReviewSubmitted(false)
            }
            let initialStep = 1;
            if (initialData.activeSteps) {
                if (initialData.activeSteps !== "review") {
                    initialStep += statusStepMap[initialData.activeSteps] || 1;
                }
                else if (initialData.activeSteps === "review") {
                    initialStep = statusStepMap[initialData.activeSteps] || 6;
                }
                else {
                    {
                        initialStep = statusStepMap[initialData.activeSteps] || 1;
                    }
                }
            }
            setStep(initialStep);

            setMaxAllowedStep(initialStep);
        } else {
            setFormData(defaultFormData);
            setInitialFormData(defaultFormData);
            setFilePreviewUrls({});
            setStep(1);
            setMaxAllowedStep(1);
        }
        setSuccess(false);
    }, [open, initialData, mode, DOCUMENT_URL]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === "panNumber") {
            formattedValue = value.replace(/[^A-Z0-9]/gi, "").toUpperCase().slice(0, 10);
        } else if (
            name === "aadharNumber"
        ) {
            const maxLength =
                name === "aadharNumber" ? 16 : 12;

            formattedValue = value.replace(/\D/g, "").slice(0, maxLength);
        }

        setFormData((prev) => ({ ...prev, [name]: formattedValue }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
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

            case "aadharNumber":
                if (!value) return "Aadhar number is required";
                if (typeof value === "string" && !/^(\d{12}|\d{16})$/.test(value))
                    return "Aadhar must be 12 or 16 digits";
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
            case 'yearsOfCity':
            case 'companyExp':
            case 'totalWorkExp': {
                if (value === null || value === undefined || value === "") {
                    return "This field is required";
                }

                // make sure it's a number
                const numValue = Number(value);
                if (Number.isNaN(numValue)) {
                    return "Invalid number input";
                }

                if (numValue < 0) return "Cannot be negative";
                if (numValue > 50) return "Cannot exceed 50 years";
                if (numValue.toString().length > 2) return "Must be a number (max 2 digits)";

                return "";
            }
            // Reference Names
            case 'ref1Name':
            case 'ref2Name':
                if (typeof value !== 'string') return "Invalid name format";
                if (value.length < 2) return "Name must be at least 2 characters";
                if (value.length > 50) return "Name cannot exceed 50 characters";
                if (!/^[a-zA-Z\s.'-]+$/.test(value)) return "Name can only contain letters, spaces, and basic punctuation";
                return "";

            // File Uploads
            case "aadharCardFileKey":
                if (!value) return "Aadhar card document is required";
                if (!(typeof value === "string" || value instanceof File)) return "Invalid file input";
                return "";

            case "panCardFileKey":
                if (!value) return "PAN card document is required";
                if (!(typeof value === "string" || value instanceof File)) return "Invalid file input";
                return "";

            case "photoFileKey":
                if (!value) return "Photo is required";
                if (!(typeof value === "string" || value instanceof File)) return "Invalid file input";
                return "";

            case "salarySlipsFileKey":
                if (!value) return "Salary slips is required";
                if (!(typeof value === "string" || value instanceof File)) return "Invalid file input";
                return "";

            case "bankStatementFileKey":
                if (!value) return "Bank statement is required";
                if (!(typeof value === "string" || value instanceof File)) return "Invalid file input";
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
                const error = validateField(field, formData[field] as string | File | null);
                if (error) {
                    newErrors[field] = error;
                    isValid = false;
                }
            });
        };

        switch (step) {
            case 1:
                validateFields(['motherName', 'panNumber', 'aadharNumber', 'maritalStatus', 'currentAddress']);
                break;
            case 2:
                validateFields(['yearsOfCity', 'alternateNo', 'landmark']);
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
                    'aadharCardFileKey',
                    'photoFileKey',
                    'salarySlipsFileKey',
                    'bankStatementFileKey'
                ]);
                break;
        }

        setErrors(newErrors);
        return isValid;
    }, [step, formData, validateField]);

    const handleNext = async () => {
        const isValid = validateStep();
        if (!isValid) {
            if (step === 5) {
                setErrors((prev) => ({
                    ...prev,
                    form: "Please upload all required files before proceeding",
                }));
            }
            return;
        }
        setErrors((prev) => ({ ...prev, form: "" }));

        setSavingNext(true);
        try {
            if (step === 5) {
                const fileKeys = [
                    { field: "aadharCardFileKey", folder: "aadhar" },
                    { field: "panCardFileKey", folder: "pan" },
                    { field: "photoFileKey", folder: "photo" },
                    { field: "salarySlipsFileKey", folder: "salary-slips" },
                    { field: "bankStatementFileKey", folder: "bank-statement" }
                ];

                for (const { field, folder } of fileKeys) {
                    const file = formData[field as keyof LoanFormData
                    ];
                    if (file instanceof File) {
                        const key = await uploadFileToServer(file, folder);
                        if (!key) {
                            setErrors((prev) => ({
                                ...prev,
                                form: `Failed to upload ${field}. Please try again.`,
                            }));
                            return;
                        }

                        (formData as any)[field] = key;
                    }
                }
                await saveStepData(step);
                setInitialFormData(formData);
                setStep((prev) => prev + 1);
                setMaxAllowedStep(6);
                return;
            }

            await saveStepData(step);
            setInitialFormData(formData);
            setStep((prev) => prev + 1);
            setMaxAllowedStep(Math.max(maxAllowedStep, step + 1));
        } catch (err) {
            console.error("Step save failed:", err);
            setErrors((prev) => ({
                ...prev,
                form: "Step save failed, please try again.",
            }));
        } finally {
            setSavingNext(false);
        }
    };

    const saveStepData = async (stepNumber: number) => {
        try {
            const token = getToken();
            if (!token) return;

            const stepKey = stepStatusMap[stepNumber];
            if (!stepKey) return;

            let stepData: Partial<LoanFormData> = {};
            switch (stepKey) {
                case "personalDetails":
                    stepData = {
                        aadharNumber: formData.aadharNumber,
                        panNumber: formData.panNumber,
                        motherName: formData.motherName,
                        maritalStatus: formData.maritalStatus,
                        currentAddress: formData.currentAddress
                    };
                    break;

                case "contactDetails":
                    stepData = {
                        yearsOfCity: formData.yearsOfCity,
                        alternateNo: formData.alternateNo ? `+91 ${formData.alternateNo}` : undefined,
                        landmark: formData.landmark
                    };
                    break;

                case "employmentDetails":
                    stepData = {
                        designation: formData.designation,
                        companyExp: formData.companyExp,
                        totalWorkExp: formData.totalWorkExp,
                        officeMobile: formData.officeMobile ? `+91 ${formData.officeMobile}` : undefined,
                        officeAddress: formData.officeAddress
                    };
                    break;
                case "referenceDetails":
                    stepData = {
                        ref1Name: formData.ref1Name,
                        ref1Mobile: formData.ref1Mobile ? `+91 ${formData.ref1Mobile}` : undefined,
                        ref1Address: formData.ref1Address,
                        ref2Name: formData.ref2Name,
                        ref2Mobile: formData.ref2Mobile ? `+91 ${formData.ref2Mobile}` : undefined,
                        ref2Address: formData.ref2Address
                    };
                    break;
                case "documents":
                    stepData = {
                        aadharCardFileKey: formData.aadharCardFileKey,
                        panCardFileKey: formData.panCardFileKey,
                        photoFileKey: formData.photoFileKey,
                        salarySlipsFileKey: formData.salarySlipsFileKey,
                        bankStatementFileKey: formData.bankStatementFileKey,
                    };
                    break;

                case "review":
                    stepData = {
                        ...formData,
                    };
                    break;
            }

            const payload = {
                activeSteps: stepKey,
                ...stepData,
                serviceId: 4,
                serviceSubType: "Personal loans",
                status: "Pending",
            };
            if (formData.id) {
                const response = await axios.put(
                    `${BASE_URL}/loan/updateLoanById/${formData.id || serviceId}`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
                setSnackbarMessage(response.data.message);
                if (stepNumber > maxAllowedStep) {
                    setMaxAllowedStep(stepNumber);
                }
            } else if (stepNumber === 1) {
                const res = await axios.post(
                    `${BASE_URL}/loan/createLoan`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setSnackbarSeverity("success");
                setSnackbarOpen(true);
                setSnackbarMessage(res.data.message || "Step data saved successfully");
                setServiceId(res.data.data.id);
                setFormData(prev => ({ ...prev, id: res.data.data.id }));
                setMaxAllowedStep(1);
            } else {
                console.warn("Cannot save step without an ID");
            }
        } catch (error) {
            setSnackbarOpen(false);
            console.error("Step save failed", error);
            throw error;
        }
    };
    const handleBack = () => setStep(prev => prev - 1);

    const handleBlur = (e: any) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        if (error) {
            setErrors(prev => ({ ...prev, [name]: error }));
        }
    };
    const uploadFileToServer = async (file: File, folderName: string): Promise<any> => {
        const token = localStorage.getItem('accessToken');
        if (!token) throw new Error('No authentication token found');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('mediaType', 'document');
        formData.append('description', 'Insurance document');
        formData.append('folderName', folderName);

        try {
            const response = await axios.post(
                `${BASE_URL}/uploadDocumentSerciceTypeFile/dynamic`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data?.status) {
                setSnackbarSeverity("success");
                setSnackbarMessage("File uploaded successfully.");
                setSnackbarOpen(true);
                return response.data.result?.key;
            }

            // API returned status=false
            setSnackbarSeverity("error");
            setSnackbarMessage("Upload failed. Please try again.");
            setSnackbarOpen(true);
            return null;

        } catch (error: any) {
            let message = "An unexpected error occurred.";

            if (error.response) {
                message = "No response from server. Please check your network connection.";
            } else if (error.request) {
                message = "No response from server. Please check your network connection.";
            } else {
                message = "No response from server. Please check your network connection.";
            }
            setSavingStep(false);
            setSnackbarSeverity("error");
            setSnackbarMessage(message);
            setSnackbarOpen(true);
            return null;
        }
    };

    const handleStepClick = async (targetStep: number) => {
        if (targetStep === step) return;
        if (targetStep > maxAllowedStep) return;
        if (targetStep > step && !validateStep()) return;

        // setSavingStep(true);
        try {
            if (
                step !== targetStep &&
                JSON.stringify(formData) !== JSON.stringify(initialFormData)
            ) {
                // await saveStepData(step);
                setInitialFormData(formData);
            }
            setStep(targetStep);
        } catch (err) {
            console.error("Failed to save step data", err);
        } finally {
            setSavingStep(false);
        }
    };

    const renderFilePreviewDialog = () => (
        <Dialog
            open={openPreviewDialog}
            onClose={() => setOpenPreviewDialog(false)}
            BackdropProps={{
                style: { backgroundColor: 'transparent' }
            }}
            fullScreen={fullScreen}
            maxWidth="lg"
            PaperProps={{
                sx: {
                    width: fullScreen ? "100%" : 400,
                    height: fullScreen ? "100%" : 400,
                    maxHeight: "95vh",
                    maxWidth: fullScreen ? "95vw" : "400px",
                    borderRadius: fullScreen ? 0 : "12px",
                    p: 1,
                },
            }}
        >
            {/* Header */}
            <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                sx={{ borderBottom: "1px solid #eee", pb: 1 }}
            >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    File Preview
                </Typography>
                <Box>
                    <IconButton onClick={() => setFullScreen(!fullScreen)}>
                        {fullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
                    </IconButton>
                    <IconButton onClick={() => setOpenPreviewDialog(false)}>
                        <CloseIcon />
                    </IconButton>
                </Box>
            </Grid>

            {/* Content */}
            <Box
                sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: fullScreen ? "100%" : 350,
                    overflow: "hidden",
                }}
            >
                {dialogFileUrl && dialogFileType === "image" && (
                    <img
                        src={dialogFileUrl}
                        alt="preview"
                        style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                            borderRadius: "8px",
                        }}
                    />
                )}
                {dialogFileUrl && dialogFileType === "pdf" && (
                    <iframe
                        src={dialogFileUrl}
                        title="pdf-preview"
                        style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            borderRadius: "8px",
                        }}
                    />
                )}
            </Box>
        </Dialog>
    );

    const handleClose = () => {
        setCloseConfirmDialog(true);
    };

    const handleConfirmClose = () => {
        setStep(1);
        setErrors({});
        setSuccess(false);
        setFormData(defaultFormData);
        setMaxAllowedStep(1)
        onClose();


        if (onSuccess) {
            onSuccess();
        }

        setCloseConfirmDialog(false);
    };

    const handleCancelClose = () => {
        setCloseConfirmDialog(false);
    };

    const handleFormSubmit = async () => {
        if (!formData.id && !serviceId) {
            console.error("Cannot submit: No service ID found");
            setErrors(prev => ({ ...prev, form: "Service ID missing. Please start over." }));
            return;
        }

        if (!formData.submit && !declarationIsDetailsConfirmed) {
            setErrors(prev => ({
                ...prev,
                form: "Please confirm declaration before submitting."
            }));
            return;
        }

        try {
            const token = getToken();
            const finalId = formData.id || serviceId;

            const response = await axios.put(
                `${BASE_URL}/loan/updateLoanById/${finalId}`,
                {
                    activeSteps: "review",
                    submit: formData.submit ? 1 : 0,
                    serviceId: 4,
                    serviceSubType: "Personal loans",
                    status: "Pending",
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
            setSnackbarMessage('Form submitted successfully');
            setSuccess(true);
            onSuccess?.();
            setTimeout(() => {
                setOpenDialog(false);
            }, 3000);

        } catch (err) {
            console.error("Failed to submit application", err);
            setErrors(prev => ({
                ...prev,
                form: "Failed to submit application. Please try again."
            }));
        }
    };


    const renderFileUpload = (label: string, name: keyof LoanFormData) => {
        const fileValue = formData[name];
        const error = errors[name];

        const previewUrl =
            filePreviewUrls[name] ||
            (fileValue instanceof File
                ? URL.createObjectURL(fileValue)
                : typeof fileValue === "string" && fileValue
                    ? `${DOCUMENT_URL}/${fileValue}`
                    : null);

        const fileName =
            fileValue instanceof File
                ? fileValue.name
                : typeof fileValue === "string" && fileValue !== ""
                    ? fileValue.split("/").pop() || "Uploaded File"
                    : filePreviewUrls[name]
                        ? "Uploaded File"
                        : "";

        const isImage =
            fileName.toLowerCase().endsWith(".jpg") ||
            fileName.toLowerCase().endsWith(".jpeg") ||
            fileName.toLowerCase().endsWith(".png");
        const isPdf = fileName.toLowerCase().endsWith(".pdf");

        const handleRemoveFileConfirm = () => {
            if (fileToRemove) {
                setFormData((prev) => ({
                    ...prev,
                    [fileToRemove]: "",
                }));
                setFilePreviewUrls((prev) => ({
                    ...prev,
                    [fileToRemove]: "",
                }));
            }
            setFileToRemove(null);
            setOpenConfirmDialog(false);
        };

        return (
            <>
                <Grid item xs={12}>
                    <FormControl fullWidth error={!!error}>
                        <Paper
                            elevation={0}
                            sx={{
                                p: 1,
                                border: "1px solid #e0e0e0",
                                borderRadius: 2,
                                "&:hover": { borderColor: "primary.main", boxShadow: 2 },
                            }}
                        >
                            <Grid container alignItems="center" spacing={1}>
                                {/* 1. Label */}
                                <Grid item xs={12} sm={3}>
                                    <Typography variant="body1" sx={{ fontWeight: 600, ml: 3, fontSize: 11 }}>
                                        {label} <span style={{ color: "red" }}>*</span>
                                    </Typography>
                                </Grid>

                                {/* 2. File Name */}
                                <Grid item xs={12} sm={5}>
                                    {fileName ? (
                                        <Tooltip title={fileName || "No file chosen"} arrow>
                                            <Chip
                                                icon={<InsertDriveFileIcon />}
                                                label={fileName}
                                                variant="outlined"
                                                sx={{
                                                    maxWidth: "100%",
                                                    textOverflow: "ellipsis",
                                                    overflow: "hidden",
                                                    fontSize: 11
                                                }}
                                            />
                                        </Tooltip>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary" sx={{ pl: 15 }}>
                                            No file chosen
                                        </Typography>
                                    )}
                                </Grid>

                                {/* 3. Actions (Preview + Remove) */}
                                <Grid item xs={12} sm={1} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    {previewUrl && (isImage || isPdf) && (
                                        <Tooltip title="Preview">
                                            <IconButton
                                                onClick={() => {
                                                    setDialogFileUrl(previewUrl);
                                                    setDialogFileType(isImage ? "image" : "pdf");
                                                    setFullScreen(false);
                                                    setOpenPreviewDialog(true);
                                                }}
                                                size="small"
                                            >
                                                <FileOpenOutlinedIcon fontSize="small" sx={{ color: "blue" }} />
                                            </IconButton>
                                        </Tooltip>
                                    )}

                                    {fileName && (
                                        <Tooltip title="Remove">
                                            <IconButton
                                                onClick={() => {
                                                    setFileToRemove(name);
                                                    setOpenConfirmDialog(true);
                                                }}
                                                size="small"
                                                color="error"
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Grid>

                                {/* 4. Upload Button */}
                                <Grid item xs={12} sm={2.5}>
                                    <Button
                                        component="label"
                                        variant={fileValue ? "contained" : "outlined"}
                                        startIcon={<AttachFileIcon />}
                                        disabled={!!fileValue || !!filePreviewUrls[name] || loading}
                                        color="secondary"
                                        className={`customUploadBtn ${fileValue ? "uploaded" : ""}`}

                                    >
                                        {fileValue || filePreviewUrls[name] ? "File Uploaded" : "Choose File"}
                                        <input
                                            hidden
                                            type="file"
                                            name={name}
                                            accept="image/*,application/pdf"
                                            onChange={handleFileChange}
                                            disabled={!!fileValue || !!filePreviewUrls[name] || loading}
                                        />
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                        {error && (
                            <Typography variant="caption" color="error" sx={{ mt: .1, ml: .7, display: "block" }}>
                                {error}
                            </Typography>
                        )}
                    </FormControl>

                </Grid >
                <Dialog
                    open={openConfirmDialog}
                    onClose={() => setOpenConfirmDialog(false)}
                    BackdropProps={{
                        style: { backgroundColor: 'transparent' }
                    }}
                >
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to remove this file?
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenConfirmDialog(false)} color="inherit">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleRemoveFileConfirm}
                            color="error"
                            variant="contained"
                        >
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    };

    const renderReviewItem = (label: string, value: any) => {
        if (value === null || value === undefined || value === "") return null;

        let fileUrl: string | null = null;
        const validExtensions = [".pdf", ".jpg", ".jpeg", ".png"];

        if (value instanceof File) {
            fileUrl = URL.createObjectURL(value);
        } else if (filePreviewUrls[label]) {
            fileUrl = filePreviewUrls[label];
        } else if (typeof value === "string") {
            const lowerValue = value.toLowerCase();
            if (validExtensions.some(ext => lowerValue.endsWith(ext))) {
                fileUrl = `${DOCUMENT_URL}/${value}`;
            }
        }

        return (
            <Grid item xs={12} sm={4}>
                <Paper
                    elevation={0}
                    sx={{ p: 1, mb: 1, border: "1px solid #eee", borderRadius: 1, fontSize: 12, fontFamily: 'dubai' }}
                >
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontSize: 12 }}>
                        {label}
                    </Typography>

                    {fileUrl ? (
                        <Link href={fileUrl} target="_blank" rel="noopener">
                            View Document
                        </Link>
                    ) : (
                        <Typography variant="body1" sx={{ fontSize: 12 }}>{value}</Typography>
                    )}
                </Paper>
            </Grid>
        );
    };

    const renderReviewStep = () => (
        <Box sx={{ p: 2 }}>
            <Typography
                variant="h5"
                gutterBottom
                sx={{
                    mb: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 15,
                }}
            >
                <CheckCircleIcon color="primary" sx={{ mr: 1, height: 20 }} />
                Review Your Application
            </Typography>
            <Typography variant="h6" gutterBottom sx={{ mt: 1, fontSize: 14 }}>Personal Information</Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
                {renderReviewItem("Aadhar Number", formData.aadharNumber)}
                {renderReviewItem("PAN Number", formData.panNumber)}
                {renderReviewItem("mother Name", formData.motherName)}
                {renderReviewItem("Marital Status", formData.maritalStatus)}
                {renderReviewItem("Current Address", formData.currentAddress)}
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 1, fontSize: 14 }}>contact Information</Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
                {renderReviewItem("Years Of City", formData.yearsOfCity)}
                {renderReviewItem("Alternate No", formData.alternateNo)}
                {renderReviewItem("Landmark", formData.landmark)}
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 1, fontSize: 14 }}>employment Information</Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
                {renderReviewItem("Designation", formData.designation)}
                {renderReviewItem("Company Experience", formData.companyExp)}
                {renderReviewItem("Total Work Experience", formData.totalWorkExp)}
                {renderReviewItem("office Mobile", formData.officeMobile)}
                {renderReviewItem("Office Address", formData.officeAddress)}
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 1, fontSize: 14 }}>reference Information</Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
                {renderReviewItem("reference 1 Name", formData.ref1Name)}
                {renderReviewItem("reference 1 Mobile", formData.ref1Mobile)}
                {renderReviewItem("reference 1 Work Address", formData.ref1Address)}
                {renderReviewItem("reference 2 Name", formData.ref2Name)}
                {renderReviewItem("reference 2 Mobile", formData.ref2Mobile)}
                {renderReviewItem("reference 2 Address", formData.ref2Address)}
            </Grid>

            <Typography variant="h6" gutterBottom sx={{ mt: 1, fontSize: 14 }}>Documents</Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
                {formData.aadharCardFileKey && renderReviewItem("Aadhar Card", formData.aadharCardFileKey)}
                {formData.panCardFileKey && renderReviewItem("PAN Card", formData.panCardFileKey)}
                {formData.bankStatementFileKey && renderReviewItem("Bank Proof", formData.bankStatementFileKey)}
                {formData.salarySlipsFileKey && renderReviewItem("Salary Proof", formData.salarySlipsFileKey)}
                {formData.photoFileKey && renderReviewItem("photo", formData.photoFileKey)}
            </Grid>
            <Box sx={{ mt: 4 }}>
                <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ fontWeight: 500, fontSize: 14 }}
                >
                    Declaration
                </Typography>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={!!formData.submit}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setFormData(prev => ({
                                    ...prev,
                                    submit: e.target.checked
                                }));
                                if (errors.form) {
                                    setErrors(prev => ({ ...prev, form: "" })); // clear error on change
                                }
                            }}
                            onBlur={() => {
                                if (errors.form) {
                                    setErrors(prev => ({ ...prev, form: "" })); // clear error on blur
                                }
                            }}
                        />
                    }
                    label="I hereby declare that the information provided above is true, complete
                           and correct to the best of my knowledge. I understand that any false information 
                           may result in rejection of my application."
                />

                {errors.form && (
                    <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                        {errors.form}
                    </Typography>
                )}
            </Box>

        </Box >
    );

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
                                value={formData.panNumber || ""}
                                onChange={handleInputChange}
                                error={!!errors.panNumber}
                                helperText={errors.panNumber}
                                disabled={loading}
                                inputProps={{
                                    maxLength: 10
                                }}
                                className="customTextField"
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label={<span>Aadhar Number <span style={{ color: 'red' }}>*</span></span>}
                                name="aadharNumber"
                                value={formData.aadharNumber || ""}
                                onChange={handleInputChange}
                                error={!!errors.aadharNumber}
                                helperText={errors.aadharNumber}
                                disabled={loading}
                                inputProps={{ maxLength: 16, inputMode: "numeric", pattern: "[0-9]*" }}
                                onKeyPress={(e: React.KeyboardEvent) => {
                                    if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                className="customTextField"
                            />
                        </Grid>
                        <Grid item {...gridSpacing} >
                            <TextField
                                fullWidth
                                label={<span>Mothers Name <span style={{ color: 'red' }}>*</span></span>}
                                name="motherName"
                                value={formData.motherName || ""}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.motherName}
                                helperText={errors.motherName}
                                disabled={loading}
                                inputProps={{
                                    maxLength: 50
                                }}
                                className="customTextField"
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <FormControl fullWidth error={!!errors.maritalStatus}>
                                <Autocomplete
                                    className="customAutocomplete"
                                    options={maritalStatusOptions}
                                    value={formData.maritalStatus || null}
                                    onChange={(_, newValue) =>
                                        setFormData({ ...formData, maritalStatus: newValue || "" })
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <>
                                                    Marital Status <span style={{ color: "red" }}>*</span>
                                                </>
                                            }
                                            error={!!errors.maritalStatus}
                                            helperText={errors.maritalStatus}
                                        />
                                    )}
                                    disabled={loading}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label={<span>Current Address <span style={{ color: 'red' }}>*</span></span>}
                                name="currentAddress"
                                value={formData.currentAddress || ""}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.currentAddress}
                                helperText={errors.currentAddress}
                                disabled={loading}
                                className="customTextField"
                                // multiline
                                // rows={3}
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
                                label={
                                    <span>
                                        Years in Current City <span style={{ color: "red" }}>*</span>
                                    </span>
                                }
                                name="yearsOfCity"
                                className="customTextField"
                                value={formData.yearsOfCity !== null ? formData.yearsOfCity : ""}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    setFormData({
                                        ...formData,
                                        yearsOfCity: value ? Number(value) : null,
                                    });
                                }}
                                onBlur={handleBlur}
                                error={!!errors.yearsOfCity}
                                helperText={errors.yearsOfCity}
                                disabled={loading}
                                inputProps={{
                                    maxLength: 2,
                                    inputMode: "numeric",
                                    pattern: "[0-9]*",
                                }}
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                className="customTextField"
                                label={<span>Alternate Number <span style={{ color: 'red' }}>*</span></span>}
                                name="alternateNo"
                                value={formData.alternateNo || ""}
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
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment
                                            position="start"
                                            sx={{
                                                marginRight: "0px",
                                                pt: 0.2,
                                                "& .MuiTypography-root": {
                                                    fontSize: "11px",
                                                },
                                            }}
                                        >
                                            +91
                                        </InputAdornment>
                                    ),
                                    inputProps: {
                                        maxLength: 10,
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                className="customTextField"
                                label={<span>Landmark <span style={{ color: 'red' }}>*</span></span>}
                                name="landmark"
                                value={formData.landmark || ""}
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
                    </Grid>
                );
            case 3:
                return (
                    <Grid container spacing={2}>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                className="customTextField"
                                label={<span>Designation <span style={{ color: 'red' }}>*</span></span>}
                                name="designation"
                                value={formData.designation || ""}
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
                                className="customTextField"
                                label={<span>Company Experience (Years) <span style={{ color: 'red' }}>*</span></span>}
                                name="companyExp"
                                value={formData.companyExp || ""}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.companyExp}
                                helperText={errors.companyExp}
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
                                className="customTextField"
                                label={<span>Total Work Experience (Years) <span style={{ color: 'red' }}>*</span></span>}
                                name="totalWorkExp"
                                value={formData.totalWorkExp || ""}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.totalWorkExp}
                                helperText={errors.totalWorkExp}
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
                                className="customTextField"
                                label={<span>Office Mobile <span style={{ color: 'red' }}>*</span></span>}
                                name="officeMobile"
                                value={formData.officeMobile || ""}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.officeMobile}
                                helperText={errors.officeMobile}
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
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment
                                            position="start"
                                            sx={{
                                                marginRight: "0px",
                                                pt: 0.2,
                                                "& .MuiTypography-root": {
                                                    fontSize: "11px",
                                                },
                                            }}
                                        >
                                            +91
                                        </InputAdornment>
                                    ),
                                    inputProps: {
                                        maxLength: 10,
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                className="customTextField"
                                label={<span>Office Address <span style={{ color: 'red' }}>*</span></span>}
                                name="officeAddress"
                                value={formData.officeAddress || " "}
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
                                className="customTextField"
                                label={<span>Reference 1 Name <span style={{ color: 'red' }}>*</span></span>}
                                name="ref1Name"
                                value={formData.ref1Name || ""}
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
                                className="customTextField"
                                label={<span>Reference 1 Mobile <span style={{ color: 'red' }}>*</span></span>}
                                name="ref1Mobile"
                                value={formData.ref1Mobile || ""}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.ref1Mobile}
                                helperText={errors.ref1Mobile}
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
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment
                                            position="start"
                                            sx={{
                                                marginRight: "0px",
                                                pt: 0.2,
                                                "& .MuiTypography-root": {
                                                    fontSize: "11px",
                                                },
                                            }}
                                        >
                                            +91
                                        </InputAdornment>
                                    ),
                                    inputProps: {
                                        maxLength: 10,
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                className="customTextField"
                                label={<span>Reference 1 Address <span style={{ color: 'red' }}>*</span></span>}
                                name="ref1Address"
                                value={formData.ref1Address || ""}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.ref1Address}
                                helperText={errors.ref1Address}
                                disabled={loading}
                                // multiline
                                // rows={2}
                                inputProps={{
                                    maxLength: 200
                                }}
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                className="customTextField"
                                label={<span>Reference 2 Name <span style={{ color: 'red' }}>*</span></span>}
                                name="ref2Name"
                                value={formData.ref2Name || ""}
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
                                className="customTextField"
                                label={<span>Reference 2 Mobile <span style={{ color: 'red' }}>*</span></span>}
                                name="ref2Mobile"
                                value={formData.ref2Mobile || ""}
                                onChange={handleInputChange}
                                error={!!errors.ref2Mobile}
                                helperText={errors.ref2Mobile}
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
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment
                                            position="start"
                                            sx={{
                                                marginRight: "0px",
                                                pt: 0.2,
                                                "& .MuiTypography-root": {
                                                    fontSize: "11px",
                                                },
                                            }}
                                        >
                                            +91
                                        </InputAdornment>
                                    ),
                                    inputProps: {
                                        maxLength: 10,
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                className="customTextField"
                                label={<span>Reference 2 Address <span style={{ color: 'red' }}>*</span></span>}
                                name="ref2Address"
                                value={formData.ref2Address || ""}
                                onChange={handleInputChange}
                                error={!!errors.ref2Address}
                                helperText={errors.ref2Address}
                                disabled={loading}
                                // multiline
                                // rows={2}
                                inputProps={{
                                    maxLength: 200
                                }}
                            />
                        </Grid>
                    </Grid>
                );
            case 5:
                return (
                    <>
                        <Grid container spacing={2}>
                            {renderFileUpload("PAN Card", "panCardFileKey")}
                            {renderFileUpload("Aadhar Card", "aadharCardFileKey")}
                            {renderFileUpload("Photo", "photoFileKey")}
                            {renderFileUpload("3 Month Salary Slips", "salarySlipsFileKey")}
                            {renderFileUpload("3 Month Bank Statement", "bankStatementFileKey")}
                        </Grid>
                        {renderFilePreviewDialog()}
                    </>
                );
            case 6:
                return renderReviewStep();
            default:
                return null;
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
            <Dialog open={open} onClose={(event, reason) => {
                if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
                    handleClose();
                }
            }}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        height: "400px",
                        maxHeight: "80vh",
                        display: "flex",
                        flexDirection: "column",
                    },
                }}>
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
                    <Stepper activeStep={step - 1} alternativeLabel sx={{ mb: 2 }}>
                        {steps.map((label, index) => {
                            const stepNumber = index + 1;
                            const completed =
                                stepNumber < step ||
                                (stepNumber < maxAllowedStep && stepNumber !== step) ||
                                (isReviewSubmitted && stepNumber === 6);
                            const isEditable = stepNumber <= maxAllowedStep;
                            const isActive = stepNumber === step;
                            return (
                                <Step key={label} completed={completed}>
                                    <StepButton
                                        onClick={() => isEditable && handleStepClick(stepNumber)}
                                        disabled={!isEditable || savingStep}
                                        sx={{
                                            "& .MuiStepLabel-label.Mui-active": {
                                                color: step === maxAllowedStep && !completed ? "orange" : "green",
                                                fontWeight: "bold",
                                            },
                                            "& .MuiStepIcon-root.Mui-active": {
                                                color: step === maxAllowedStep && !completed ? "orange" : "green",
                                            },
                                            "& .MuiStepIcon-root.Mui-completed": {
                                                color: "green",
                                            },
                                            "& .MuiStepLabel-label.Mui-completed": {
                                                color: "green",
                                                fontWeight: "bold",
                                            },
                                            "& .MuiStepLabel-label": {
                                                color: stepNumber === maxAllowedStep && !completed ? "orange" : "grey",
                                                fontWeight: "bold",
                                            },
                                            "& .MuiStepIcon-root": {
                                                color: stepNumber === maxAllowedStep && !completed ? "orange" : "grey",
                                                width: "18px",
                                                height: "18px",
                                            },

                                        }}
                                    >
                                        <StepLabel>
                                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>

                                                <span>{label}</span>
                                                {isActive && (
                                                    <span
                                                        style={{
                                                            color: step === maxAllowedStep && !completed ? "orange" : "green",
                                                            fontSize: "20px",
                                                            marginTop: "4px",
                                                            animation: "bounce 1s infinite",
                                                        }}
                                                    >
                                                        <ArrowDropUpOutlinedIcon />
                                                    </span>
                                                )}
                                            </div>
                                        </StepLabel>
                                    </StepButton>
                                </Step>
                            );
                        })}
                    </Stepper>
                    {success ? (
                        <Box sx={{ textAlign: 'center', p: 4 }}>
                            <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                            <Typography variant="h5" gutterBottom>
                                Application Submitted Successfully!
                            </Typography>
                            <Typography color="text.secondary">
                                Your Loan application has been received. Well contact you shortly.
                            </Typography>
                        </Box>
                    ) : (
                        renderStepContent()
                    )}
                </DialogContent>
                {!success && (
                    <DialogActions>
                        {step > 1 && (
                            <Button onClick={handleBack}
                                disabled={savingBack || loading || savingStep}
                                endIcon={savingBack ? <CircularProgress size={20} /> : null}
                            >
                                Back
                            </Button>
                        )}
                        {step < steps.length ? (
                            <Button onClick={handleNext} variant="contained"
                                disabled={savingNext || loading || savingStep}
                                endIcon={savingNext ? <CircularProgress size={20} /> : null}
                            >
                                Next
                            </Button>
                        ) : (
                            <Button
                                onClick={handleFormSubmit}
                                variant="contained"
                                color="primary"
                                disabled={loading || savingNext || savingBack || savingStep}
                                endIcon={loading ? <CircularProgress size={20} /> : null}
                            >
                                {mode === 'edit' ? 'Submit' : 'Submitn'}
                            </Button>
                        )}
                    </DialogActions>
                )}
            </Dialog>
            <CloseConfirmDialog
                open={closeConfirmDialog}
                handleCancelClose={handleCancelClose}
                handleConfirmClose={handleConfirmClose}
            />
            <Snackbar
                // open={true}
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default PersonalLoanFormDialog;