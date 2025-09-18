import React, { useCallback, useEffect, useState } from "react";
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
    Alert,
    StepButton,
    Autocomplete,
    Tooltip,
    Chip,
    FormControlLabel,
    Checkbox
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { SelectChangeEvent } from "@mui/material/Select";
import ArrowDropUpOutlinedIcon from '@mui/icons-material/ArrowDropUpOutlined';
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatDate } from "@/utils/utils";
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";
import { error } from "console";

type FilePreviewUrls = {
    panCardFileKey?: string;
    aadharCardFileKey?: string;
    bankProofFileKey?: string;
    salarySlipsFileKey?: string;
    itrDocumentsFileKey?: string;
};
interface LifeInsuranceData {
    id?: number;
    panNumber: string;
    aadharNumber: string;
    panCardFileKey: File | string | null;
    aadharCardFileKey: File | string | null;
    bankProofFileKey: File | string | null;
    salarySlipsFileKey: File | string | null;
    itrDocumentsFileKey: File | string | null;
    email: string;
    mobile: string;
    motherName: string;
    placeOfBirth: {
        city: string;
        state: string;
    };
    heightCM: string;
    weightKG: string;
    income: string;
    occupation: string;
    smoker: string;
    alcohol: string;
    nomineeName: string;
    nomineeDOB: string;
    nomineeRelation: string;
    submit: boolean;
    activeSteps: string;
}

const defaultFormData: LifeInsuranceData = {
    motherName: "",
    placeOfBirth: {
        city: "",
        state: ""
    },
    heightCM: "",
    weightKG: "",
    smoker: "No",
    alcohol: "No",
    email: "",
    mobile: "",
    income: "",
    occupation: "",
    nomineeName: "",
    nomineeDOB: "",
    nomineeRelation: "",
    panNumber: "",
    panCardFileKey: null,
    aadharNumber: "",
    aadharCardFileKey: null,
    bankProofFileKey: null,
    salarySlipsFileKey: null,
    itrDocumentsFileKey: null,
    submit: false,
    activeSteps: "basicDetails"
};
interface City {
    city: string;
    state: string;
}

const incomeOptions = [
    "1,00,000 - 5,00,000",
    "5,00,000 - 10,00,000",
    "10,00,000 - 15,00,000",
    "15,00,000 - 20,00,000",
    "20,00,000 - 25,00,000",
    "25,00,000 - 30,00,000",
    "30,00,000 - 35,00,000",
    "35,00,000 - 40,00,000",
    "40,00,000 - 45,00,000",
    "45,00,000 - 50,00,000",
    "50,00,000+"
];

const nomineeRelations = [
    "Father",
    "Mother",
    "Brother",
    "Sister",
    "Wife",
    "Husband",
    "Son",
    "Daughter",
    "Uncle",
    "Aunt",
    "Other"
];
interface Props {
    open: boolean;
    onClose: () => void;
    initialData?: LifeInsuranceData;
    mode?: 'create' | 'edit';
    setOpenDialog: (open: boolean) => void;
    onSuccess?: () => void;
}

const LifeInsuranceFormDialog: React.FC<Props> = ({
    open,
    onClose,
    initialData,
    mode = 'create',
    setOpenDialog,
    onSuccess,
}) => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<LifeInsuranceData>(defaultFormData);
    const [fileToRemove, setFileToRemove] = useState<keyof LifeInsuranceData | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [serviceId, setServiceId] = useState<number | null>(null);
    const [savingBack, setSavingBack] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [maxAllowedStep, setMaxAllowedStep] = useState(1);
    const [isReviewSubmitted, setIsReviewSubmitted] = useState(false);
    const [initialFormData, setInitialFormData] = useState(formData);
    const [savingStep, setSavingStep] = useState(false);
    const [successVoucherMessage, setSuccessVoucherMessage] = useState("");
    const [dialogFileUrl, setDialogFileUrl] = useState<string | null>(null);
    const [dialogFileType, setDialogFileType] = useState<"image" | "pdf" | null>(null);
    const [fullScreen, setFullScreen] = useState(false);
    const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
    const [closeConfirmDialog, setCloseConfirmDialog] = React.useState(false);
    const [cities, setCities] = useState<City[]>([]);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [declarationIsDetailsConfirmed, setDeclarationIsDetailsConfirmed] = useState(false);
    const [savingNext, setSavingNext] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [filePreviewUrls, setFilePreviewUrls] = useState<Record<string, string>>({});
    const [openLifeInsuranceSuccessSnackbar, setOpenLifeInsuranceSuccessSnackbar] = useState(false);
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const DOCUMENT_URL = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL || 'https://connect-india-upload-documents.s3.ap-south-1.amazonaws.com';
    const steps = ["basicDetails", "personalDetails", "nomineeDetails", "Documents", "Review"];
    const gridSpacing = { xs: 12, sm: 6 };
    const stepStatusMap: { [key: number]: string } = {
        1: "basicDetails",
        2: "personalDetails",
        3: "nomineeDetails",
        4: "documents",
        5: "review"
    };

    const statusStepMap: { [key: string]: number } = {
        "basicDetails": 1,
        "personalDetails": 2,
        "nomineeDetails": 3,
        "documents": 4,
        "review": 5
    };

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
        const token = getToken();
        if (!token) return;
        const fetchCities = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${BASE_URL}/city/getCities`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.status) {
                    setCities(res.data.data);
                } else {
                    console.error("API Error:", res.data.message);
                }
            } catch (err: any) {
                console.error("Error fetching cities:", err.message || err);
            } finally {
                setLoading(false);
            }
        };

        fetchCities();
    }, []);

    useEffect(() => {
        if (mode === "edit" && initialData) {
            const updatedFormData: any = { ...initialData };
            const urls: Record<string, string> = {};

            const documentKeys: (keyof LifeInsuranceData)[] = [
                "aadharCardFileKey",
                "panCardFileKey",
                "bankProofFileKey",
                "salarySlipsFileKey",
                "itrDocumentsFileKey"
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
                else {
                    initialStep = statusStepMap[initialData.activeSteps] || 1;
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

    function formatDateForInput(isoString: string) {
        const d = new Date(isoString);
        return d.toLocaleDateString("en-CA");
    }
    const handleNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d{0,3}$/.test(value)) {
            handleInputChange(e);
        }
    };

    const handleAadharNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (/^\d{0,16}$/.test(value)) {
            handleInputChange(e);
        }
    };

    // const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value, type } = e.target;

    //     let newValue = value;

    //     if (type === "date" && value) {
    //         newValue = `${value} 00:00:00`;
    //     }

    //     setFormData(prev => ({
    //         ...prev,
    //         [name]: newValue
    //     }));

    //     validateField(name, newValue);
    // };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        let formattedValue = value;

        let newValue = value;

        if (type === "date" && value) {
            newValue = `${value} 00:00:00`;
        }

        if (
            name === "aadharNumber"
        ) {
            const maxLength =
                name === "aadharNumber" || formData.aadharNumber === "aadhar" ? 16 : 12;

            formattedValue = value.replace(/\D/g, "").slice(0, maxLength);
        }

        setFormData((prev) => ({ ...prev, [name]: formattedValue }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateField = useCallback(
        (
            name: keyof LifeInsuranceData,
            value:
                | string
                | number
                | boolean
                | File
                | { city: string; state: string }
                | null
                | undefined
        ): string | undefined => {
            switch (name) {
                case "aadharNumber":
                    if (!value) return "Aadhar number is required";
                    if (typeof value === "string" && !/^(\d{12}|\d{16})$/.test(value))
                        return "Aadhar must be 12 or 16 digits";
                    return "";

                case "panNumber":
                    if (!value) return "PAN number is required";
                    if (typeof value !== "string") return "Invalid value type for PAN";
                    const pan = value.trim().toUpperCase();
                    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan))
                        return "Invalid PAN format (e.g., ABCDE1234F)";
                    return "";

                case "email":
                    if (!value) return "Email is required";
                    if (typeof value === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
                        return "Invalid email format";
                    return "";

                case "mobile":
                    if (!value) return "Mobile number is required";
                    if (typeof value === "string") {
                        const cleanMobile = value.replace(/^(\+91)/, "").trim().replace(/\D/g, "");
                        if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
                            return "Invalid mobile number";
                        }
                    }
                    return "";

                case "motherName":
                    if (!value) return "Mother's name is required";
                    if (typeof value === "string" && value.trim().length < 3)
                        return "Mother's name must be at least 3 characters long";
                    return "";

                case "placeOfBirth":
                    if (!value || typeof value !== "object") return "Place of birth is required";
                    const place = value as { city: string; state: string };
                    if (!place.city || !place.state) return "City and State are required";
                    const fullName = `${place.city}, ${place.state}`.trim();
                    if (fullName.length > 200) return "Place of birth cannot exceed 200 characters";
                    if ((fullName.match(/[A-Za-z]/g) || []).length < 5)
                        return "Place of birth must contain at least 5 letters";
                    return "";

                case "heightCM":
                    if (!value) return "Height is required";
                    if (isNaN(Number(value)) || Number(value) < 50 || Number(value) > 300)
                        return "Height must be between 50cm and 300cm";
                    return "";

                case "weightKG":
                    if (!value) return "Weight is required";
                    if (isNaN(Number(value)) || Number(value) < 10 || Number(value) > 500)
                        return "Weight must be between 10kg and 500kg";
                    return "";

                case "income":
                    if (!value) return "Income is required";
                    if (typeof value !== "string") return "Invalid income input";
                    return "";

                case "occupation":
                    if (!value) return "Occupation is required";
                    return "";

                case "smoker":
                    if (!value) return "Smoker status is required";
                    if (value !== "Yes" && value !== "No")
                        return "Smoker must be Yes or No";
                    return "";

                case "alcohol":
                    if (!value) return "Alcohol consumption status is required";
                    if (value !== "Yes" && value !== "No")
                        return "Alcohol must be Yes or No";
                    return "";

                case "nomineeName":
                    if (!value) return "Nominee name is required";
                    if (typeof value === "string" && value.trim().length < 3)
                        return "Nominee name must be at least 3 characters long";
                    return "";

                case "nomineeDOB":
                    if (!value) return "Nominee date of birth is required";
                    // Basic date check
                    if (typeof value === "string" && isNaN(Date.parse(value)))
                        return "Invalid date format";
                    return "";

                case "nomineeRelation":
                    if (!value) return "Nominee relation is required";
                    return "";

                case "aadharCardFileKey":
                    if (!value) return "Aadhar card document is required";
                    if (!(typeof value === "string" || value instanceof File))
                        return "Invalid file input";
                    return "";

                case "panCardFileKey":
                    if (!value) return "PAN card document is required";
                    if (!(typeof value === "string" || value instanceof File))
                        return "Invalid file input";
                    return "";

                case "bankProofFileKey":
                    if (!value) return "Bank proof document is required";
                    if (!(typeof value === "string" || value instanceof File))
                        return "Invalid file input";
                    return "";

                case "salarySlipsFileKey":
                    if (formData.occupation === "Job") {
                        if (!value) return "Salary slips are required for Job";
                        if (!(typeof value === "string" || value instanceof File))
                            return "Invalid salary slips input";
                    }
                    return "";

                case "itrDocumentsFileKey":
                    if (formData.occupation === "Business") {
                        if (!value) return "ITR documents are required for Business";
                        if (!(typeof value === "string" || value instanceof File))
                            return "Invalid ITR document input";
                    }
                    return "";

                case "submit":
                    if (!value) return "You must confirm before submitting";
                    return "";

                case "activeSteps":
                    if (!value) return "Active step is required";
                    return "";

                default:
                    return "";
            }
        },
        [formData.occupation]
    );

    const handleBlur = (e: any) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        if (error) {
            setErrors(prev => ({ ...prev, [name]: error }));
        } else {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleFileChange = (e: any) => {
        const { name, files } = e.target;
        if (files?.length) {
            const file = files[0];
            const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
            const maxSize = 5 * 1024 * 1024; // 10MB

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

    const saveStepData = async (stepNumber: number) => {
        try {
            const token = getToken();
            if (!token) return;

            const stepKey = stepStatusMap[stepNumber];
            if (!stepKey) return;

            let stepData: Partial<LifeInsuranceData> = {};

            switch (stepKey) {
                case "basicDetails":
                    stepData = {
                        aadharNumber: formData.aadharNumber,
                        panNumber: formData.panNumber,
                    };
                    break;

                case "personalDetails":
                    stepData = {
                        motherName: formData.motherName,
                        heightCM: formData.heightCM,
                        weightKG: formData.weightKG,
                        smoker: formData.smoker,
                        alcohol: formData.alcohol,
                        placeOfBirth: formData.placeOfBirth
                            ? {
                                city: formData.placeOfBirth.city,
                                state: formData.placeOfBirth.state,
                            }
                            : undefined,
                        income: formData.income,
                        occupation: formData.occupation,
                    };
                    break;
                case "nomineeDetails":
                    stepData = {
                        nomineeName: formData.nomineeName,
                        nomineeDOB: formData.nomineeDOB,
                        nomineeRelation: formData.nomineeRelation,
                    };
                    break;

                case "documents":
                    stepData = {
                        aadharCardFileKey: formData.aadharCardFileKey,
                        panCardFileKey: formData.panCardFileKey,
                        bankProofFileKey: formData.bankProofFileKey,
                        salarySlipsFileKey: formData.salarySlipsFileKey,
                        itrDocumentsFileKey: formData.itrDocumentsFileKey,
                    };
                    break;

                case "review":
                    stepData = {
                        ...formData,
                        mobile: formData.mobile ? `+91 ${formData.mobile}` : undefined,
                    };
                    break;
            }

            const payload = {
                activeSteps: stepKey,
                ...stepData,
                serviceId: 3,
                serviceSubType: "Life insurance policies",
                status: "Pending",
            };

            if (formData.id) {
                const response = await axios.put(
                    `${BASE_URL}/insurance/updateInsuranceById/${formData.id || serviceId}`,
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
                    `${BASE_URL}/insurance/createInsurance`,
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
    const validateStep = (): boolean => {
        const newErrors: Record<string, string> = {};

        const runValidation = (field: string, value: any) => {
            let message = "";

            switch (field) {
                case "panNumber":
                    if (!value) message = "PAN number is required";
                    else if (typeof value !== "string" || !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value))
                        message = "Invalid PAN format (e.g., ABCDE1234F)";
                    break;

                case "aadharNumber":
                    if (!value) message = "Aadhar number is required";
                    else if (!/^(\d{12}|\d{16})$/.test(value))
                        message = "Aadhar must be 12 or 16 digits";
                    break;

                case "heightCM":
                    if (!value) message = "Height is required";
                    else if (isNaN(Number(value)) || Number(value) < 50 || Number(value) > 300)
                        message = "Height must be between 50cm and 300cm";
                    break;

                case "weightKG":
                    if (!value) message = "Weight is required";
                    else if (isNaN(Number(value)) || Number(value) < 10 || Number(value) > 500)
                        message = "Weight must be between 10kg and 500kg";
                    break;

                case "income":
                    if (!value) return "Income is required";
                    if (typeof value !== "string") return "Invalid income input";
                    return "";

                case "motherName":
                    if (!value) message = "Mother's name is required";
                    else if (typeof value === "string" && value.trim().length < 3)
                        message = "Mother's name must be at least 3 characters";
                    else if (typeof value === "string" && value.length > 50)
                        message = "Mother's name cannot exceed 50 characters";
                    break;

                case "placeOfBirth":
                    if (!value?.city) message = "Place of birth is required";
                    break;

                case "occupation":
                    if (!value) message = "Occupation is required";
                    break;

                case "smoker":
                    if (!value) message = "Smoker status is required";
                    else if (value !== "Yes" && value !== "No")
                        message = "Smoker must be Yes or No";
                    break;

                case "alcohol":
                    if (!value) message = "Alcohol consumption status is required";
                    else if (value !== "Yes" && value !== "No")
                        message = "Alcohol must be Yes or No";
                    break;

                case "nomineeName":
                    if (!value) message = "Nominee name is required";
                    else if (typeof value === "string" && value.trim().length < 3)
                        message = "Nominee name must be at least 3 characters";
                    else if (typeof value === "string" && value.length > 50)
                        message = "Nominee name cannot exceed 50 characters";
                    break;

                case "nomineeDOB":
                    if (!value) message = "Nominee DOB is required";
                    else if (isNaN(Date.parse(value)))
                        message = "Invalid date format";
                    else if (new Date(value).getTime() > Date.now())
                        message = "Date cannot be in the future";
                    break;

                case "nomineeRelation":
                    if (!value) message = "Nominee relation is required";
                    break;

                default:
                    break;
            }

            if (message) newErrors[field] = message;
        };

        // ✅ step-based validation
        if (step === 1) {
            runValidation("email", formData.email);
            runValidation("mobile", formData.mobile);
            runValidation("panNumber", formData.panNumber);
            runValidation("aadharNumber", formData.aadharNumber);
        }

        if (step === 2) {
            runValidation("motherName", formData.motherName);
            runValidation("heightCM", formData.heightCM);
            runValidation("weightKG", formData.weightKG);
            runValidation("income", formData.income);
            runValidation("occupation", formData.occupation);
            runValidation("placeOfBirth", formData.placeOfBirth);
            runValidation("smoker", formData.smoker);
            runValidation("alcohol", formData.alcohol);
        }

        if (step === 3) {
            runValidation("nomineeName", formData.nomineeName);
            runValidation("nomineeDOB", formData.nomineeDOB);
            runValidation("nomineeRelation", formData.nomineeRelation);
        }

        if (step === 4) {
            if (!formData.panCardFileKey)
                newErrors.panCardFileKey = "PAN card is required";
            if (!formData.aadharCardFileKey)
                newErrors.aadharCardFileKey = "Aadhar card is required";
            if (!formData.bankProofFileKey)
                newErrors.bankProofFileKey = "Bank proof is required";

            if (formData.occupation === "Job" && !formData.salarySlipsFileKey) {
                newErrors.salarySlipsFileKey = "Salary slip is required for Job";
            }
            if (formData.occupation === "Business" && !formData.itrDocumentsFileKey) {
                newErrors.itrDocumentsFileKey = "ITR proof is required for Business";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = async () => {
        const isValid = validateStep();
        if (!isValid) {
            // ✅ if step 4 has missing files, validateStep already sets errors
            if (step === 4) {
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
            if (step === 4) {
                const fileKeys = [
                    { field: "aadharCardFileKey", folder: "aadhar" },
                    { field: "panCardFileKey", folder: "pan" },
                    { field: "bankProofFileKey", folder: "bank-proof" },
                    ...(formData.occupation === "Job"
                        ? [{ field: "salarySlipsFileKey", folder: "salary-slips" }]
                        : []),
                    ...(formData.occupation === "Business"
                        ? [{ field: "itrDocumentsFileKey", folder: "itr-documents" }]
                        : []),
                ];

                // ✅ clone formData before modifying uploaded file keys
                const updatedFormData = { ...formData };

                for (const { field, folder } of fileKeys) {
                    const file = formData[field as keyof LifeInsuranceData];
                    if (file instanceof File) {
                        const key = await uploadFileToServer(file, folder);
                        (updatedFormData as any)[field] = key;
                    }
                }

                await saveStepData(step);
                setInitialFormData(updatedFormData);
                setFormData(updatedFormData); // ✅ keep UI in sync
                setStep((prev) => prev + 1);
                setMaxAllowedStep(5);
                return;
            }

            // ✅ for steps 1–3
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


    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const handleBack = async () => {
        try {
            // setSavingBack(true);
            if (step === 1 && !formData.id && !serviceId) {
                // await saveStepData(step);
                setInitialFormData(formData);
                setStep((prev) => prev - 1);
                return;
            }
            if (JSON.stringify(formData) === JSON.stringify(initialFormData)) {
                setStep((prev) => prev - 1);
                return;
            }
            // await saveStepData(step);
            setInitialFormData(formData);
            setStep((prev) => prev - 1);
        } catch (err) {
            console.error("Failed to save step data", err);
            setErrors((prev) => ({
                ...prev,
                form: "Failed to save progress. Please try again.",
            }));
        } finally {
            setSavingBack(false);
        }
    };

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
        setCloseConfirmDialog(true);
    };

    const handleConfirmClose = () => {
        setStep(1);
        setErrors({});
        setSuccess(false);
        setFormData(defaultFormData);
        setMaxAllowedStep(1);
        onClose();

        if (onSuccess) {
            onSuccess();
        }

        setCloseConfirmDialog(false);
    };

    const handleCancelClose = () => {
        setCloseConfirmDialog(false);
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
                `${BASE_URL}/insurance/updateInsuranceById/${finalId}`,
                {
                    activeSteps: "review",
                    submit: formData.submit ? 1 : 0,
                    serviceId: 1,
                    serviceSubType: "mutualFund",
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

    const renderFileUpload = (label: string, name: keyof LifeInsuranceData) => {
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
                                        <span style={{ color: "red" }}>*</span> {label}
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

                            {error && (
                                <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
                                    {error}
                                </Typography>
                            )}
                        </Paper>
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
                    <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                    Review Your Application
                </Typography>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Document Information</Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                    {formData.occupation === "Job" && renderReviewItem("Salary Slips", formData.salarySlipsFileKey, "salarySlipsFileKey")}
                    {formData.occupation === "Business" && renderReviewItem("ITR Documents", formData.itrDocumentsFileKey, "itrDocumentsFileKey")}
                    {renderReviewItem("PAN Card", formData.panCardFileKey, "panCardFileKey")}
                    {renderReviewItem("Aadhar Card", formData.aadharCardFileKey, "aadharCardFileKey")}
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
                    {renderReviewItem("Place of Birth", formData.placeOfBirth.city)}
                    {renderReviewItem("Height (cm)", formData.heightCM)}
                    {renderReviewItem("Weight (kg)", formData.weightKG)}
                    {renderReviewItem("Smoker", formData.smoker)}
                    {renderReviewItem("Alcohol", formData.alcohol)}
                </Grid>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Work Information</Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                    {renderReviewItem("Annual Income", formData.income)}
                    {renderReviewItem("Occupation", formData.occupation)}
                </Grid>

                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Nominee Information</Typography>
                <Divider sx={{ mb: 3 }} />
                <Grid container spacing={2}>
                    {renderReviewItem("Nominee Name", formData.nomineeName)}
                    {renderReviewItem("Nominee DOB", formData.nomineeDOB)}
                    {renderReviewItem("Nominee Relation", formData.nomineeRelation)}
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
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setFormData(prev => ({
                                        ...prev,
                                        submit: e.target.checked
                                    }))
                                }
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
                                label={
                                    <>
                                        Pan Number<span style={{ color: "red" }}>*</span>
                                    </>
                                }
                                name="panNumber"
                                value={formData.panNumber || ""}
                                onChange={(e) => {
                                    const onlyAlphaNum = e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
                                    setFormData((prev) => ({
                                        ...prev,
                                        panNumber: onlyAlphaNum,
                                    }));
                                }}
                                onBlur={handleBlur}
                                error={!!errors.panNumber}
                                inputProps={{ maxLength: 10 }}
                                helperText={errors.panNumber}
                                disabled={loading}
                                margin="dense"
                                className="customTextField"
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label={
                                    <React.Fragment>
                                        Aadhar Number<span style={{ color: "red" }}>*</span>
                                    </React.Fragment>
                                }
                                name="aadharNumber"
                                value={formData.aadharNumber || ""}
                                onChange={handleAadharNumberInput}
                                onBlur={handleBlur}
                                error={!!errors.aadharNumber}
                                helperText={errors.aadharNumber}
                                inputProps={{ maxLength: 16, inputMode: "numeric", pattern: "[0-9]*" }}
                                // disabled={loading || mode === 'edit'}
                                className="customTextField"
                            />
                        </Grid>
                    </Grid>
                );
            case 2:
                return (
                    <Grid container spacing={2}>
                        <Grid container item spacing={2}>
                            <Grid item xs={6} sx={{ mt: 2.3 }}>
                                <TextField
                                    fullWidth
                                    label=
                                    {
                                        <React.Fragment>
                                            Mother's Name<span style={{ color: "red" }}>*</span>
                                        </React.Fragment>
                                    }
                                    name="motherName"
                                    value={formData.motherName || ""}
                                    onChange={handleInputChange}
                                    onBlur={handleBlur}
                                    error={!!errors.motherName}
                                    inputProps={{ maxLength: 50 }}
                                    helperText={errors.motherName}
                                    disabled={loading}
                                    className="customTextField"
                                />
                            </Grid>
                            <Grid item xs={6} sx={{ mt: 2.3 }}>
                                <Autocomplete
                                    className="customAutocomplete"
                                    options={cities}
                                    getOptionLabel={(option: City) => option.city || ""}
                                    value={
                                        formData.placeOfBirth?.city
                                            ? cities.find(
                                                (c) =>
                                                    c.city === formData.placeOfBirth.city &&
                                                    c.state === formData.placeOfBirth.state
                                            ) || null
                                            : null
                                    }
                                    onChange={(_, newValue: City | null) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            placeOfBirth: newValue
                                                ? { city: newValue.city, state: newValue.state }
                                                : { city: "", state: "" },
                                        }));

                                        if (errors.placeOfBirth) {
                                            setErrors((prev) => ({ ...prev, placeOfBirth: "" }));
                                        }
                                    }}
                                    onBlur={() => {
                                        const error = validateField(
                                            "placeOfBirth",
                                            formData.placeOfBirth as any
                                        );
                                        setErrors((prev: any) => ({ ...prev, placeOfBirth: error }));
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label={
                                                <>
                                                    Place of Birth <span style={{ color: "red" }}>*</span>
                                                </>
                                            }
                                            error={!!errors.placeOfBirth}
                                            helperText={errors.placeOfBirth}
                                            fullWidth
                                        />
                                    )}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2.3 }}>
                            <TextField
                                fullWidth
                                label=
                                {
                                    <React.Fragment>
                                        Height (cm)<span style={{ color: "red" }}>*</span>
                                    </React.Fragment>
                                }
                                name="heightCM"
                                value={formData.heightCM || ""}
                                onChange={handleNumberInput}
                                onBlur={handleBlur}
                                error={!!errors.heightCM}
                                helperText={errors.heightCM}
                                disabled={loading}
                                className="customTextField"
                            />
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2.3 }}>
                            <TextField
                                fullWidth
                                label={
                                    <>
                                        Weight (kg)<span style={{ color: "red" }}>*</span>
                                    </>
                                }
                                name="weightKG"
                                value={formData.weightKG || ""}
                                onChange={handleNumberInput}
                                onBlur={handleBlur}
                                error={!!errors.weightKG}
                                helperText={errors.weightKG}
                                disabled={loading}
                                className="customTextField"
                            />
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2.3 }}>
                            <Autocomplete
                                options={["Yes", "No"]}
                                className="customAutocomplete"
                                getOptionLabel={(option: any) => option || ""}
                                value={formData.smoker || ""}
                                onChange={(_, newValue) => {
                                    handleSelectChange({
                                        target: { name: "smoker", value: newValue || "" },
                                    } as any);
                                }}
                                disabled={loading}
                                onBlur={() => {
                                    const error = validateField("smoker", formData.smoker);
                                    setErrors((prev: any) => ({ ...prev, smoker: error }));
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={
                                            <>
                                                Smoker <span style={{ color: "red" }}>*</span>
                                            </>
                                        }
                                        error={!!errors.smoker}
                                        helperText={errors.smoker}
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2.3 }}>
                            <Autocomplete
                                options={["Yes", "No"]}
                                className="customAutocomplete"
                                getOptionLabel={(option: any) => option || ""}
                                value={formData.alcohol || ""}
                                onChange={(_, newValue) => {
                                    handleSelectChange({
                                        target: { name: "alcohol", value: newValue || "" },
                                    } as any);
                                }}
                                disabled={loading}
                                onBlur={() => {
                                    const error = validateField("alcohol", formData.alcohol);
                                    setErrors((prev: any) => ({ ...prev, alcohol: error }));
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={
                                            <>
                                                Alcohol <span style={{ color: "red" }}>*</span>
                                            </>
                                        }
                                        error={!!errors.alcohol}
                                        helperText={errors.alcohol}
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2.4 }}>
                            <Autocomplete
                                options={["Job", "Business"]}
                                className="customAutocomplete"
                                getOptionLabel={(option: any) => option || ""}
                                value={formData.occupation || ""}
                                onChange={(_, newValue) => {
                                    handleSelectChange({
                                        target: { name: "occupation", value: newValue || "" },
                                    } as any);
                                }}
                                disabled={loading}
                                onBlur={() => {
                                    const error = validateField("occupation", formData.occupation);
                                    setErrors((prev: any) => ({ ...prev, occupation: error }));
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={
                                            <>
                                                Occupation <span style={{ color: "red" }}>*</span>
                                            </>
                                        }
                                        error={!!errors.occupation}
                                        helperText={errors.occupation}
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6} sx={{ mt: 2.3 }}>
                            <Autocomplete
                                options={incomeOptions}
                                className="customAutocomplete"
                                getOptionLabel={(option) => option || ""}
                                value={formData.income || ""}
                                onChange={(_, newValue) => {
                                    setFormData((prev) => ({
                                        ...prev,
                                        income: newValue || "",
                                    }));

                                    if (errors.income) {
                                        setErrors((prev) => ({ ...prev, income: "" }));
                                    }
                                }}
                                onBlur={() => {
                                    const error = validateField("income", formData.income);
                                    setErrors((prev: any) => ({ ...prev, income: error }));
                                }}
                                disabled={loading}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={
                                            <>
                                                {formData.occupation === "Business"
                                                    ? "Net Gross Profit"
                                                    : "Annual Income"}{" "}
                                                <span style={{ color: "red" }}>*</span>
                                            </>
                                        }
                                        error={!!errors.income}
                                        helperText={errors.income}
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                    </Grid >
                );
            case 3:
                return (
                    <Grid container spacing={3}>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label=
                                {
                                    <React.Fragment>
                                        Nominee Name<span style={{ color: "red" }}>*</span>
                                    </React.Fragment>
                                }
                                name="nomineeName"
                                value={formData.nomineeName || ""}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                inputProps={{ maxLength: 50 }}
                                error={!!errors.nomineeName}
                                helperText={errors.nomineeName}
                                disabled={loading}
                                className="customTextField"
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label=
                                {
                                    <React.Fragment>
                                        Nominee Date of Birth<span style={{ color: "red" }}>*</span>
                                    </React.Fragment>
                                }
                                name="nomineeDOB"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={formData.nomineeDOB ? formatDateForInput(formData.nomineeDOB) : ""}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.nomineeDOB}
                                helperText={errors.nomineeDOB}
                                disabled={loading}
                                className="customTextField"
                            />

                        </Grid>
                        <Grid item {...gridSpacing}>
                            <Autocomplete
                                fullWidth
                                options={nomineeRelations}
                                value={formData.nomineeRelation || ""}
                                onChange={(event, newValue) => {
                                    setFormData({ ...formData, nomineeRelation: newValue || "" });
                                }}
                                slotProps={{
                                    popper: {
                                        sx: { zIndex: 1300 },
                                    },
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label={
                                            <>
                                                Relation with Nominee<span style={{ color: "red" }}>*</span>
                                            </>
                                        }
                                        name="nomineeRelation"
                                        onBlur={handleBlur}
                                        error={!!errors.nomineeRelation}
                                        helperText={errors.nomineeRelation}
                                        disabled={loading}
                                        className="customTextField"
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                );
            case 4:
                return (
                    <>
                        <Grid container spacing={2}>
                            {renderFileUpload("Aadhar Card", "aadharCardFileKey")}
                            {renderFileUpload("PAN Card", "panCardFileKey")}
                            {renderFileUpload("Bank Proof", "bankProofFileKey")}
                            {formData.occupation === "Job" &&
                                <React.Fragment key="salarySlips">
                                    {renderFileUpload("Salary Slips", "salarySlipsFileKey")}
                                </React.Fragment>
                            }
                            {formData.occupation === "Business" &&
                                <React.Fragment key="itrDocuments">
                                    {renderFileUpload("ITR Documents", "itrDocumentsFileKey")}
                                </React.Fragment>
                            }
                        </Grid>

                        {renderFilePreviewDialog()}
                    </>
                );
            case 5:
                return renderReviewStep();
            default:
                return null;
        }
    };

    return (
        <>
            <Dialog open={open}
                onClose={(event, reason) => {
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
                            {mode === 'edit' ? 'Edit mutual fund' : 'New mutual fund / SIP'}
                        </Typography>
                        <IconButton onClick={handleClose} disabled={loading}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <Stepper activeStep={step - 1} alternativeLabel sx={{ mb: 3 }}>
                        {steps.map((label, index) => {
                            const stepNumber = index + 1;
                            const completed =
                                stepNumber < step ||
                                (stepNumber < maxAllowedStep && stepNumber !== step) ||
                                (isReviewSubmitted && stepNumber === 5);
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
                    <style>
                        {`
                  @keyframes bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(4px); }
                  }
                  `}
                    </style>
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
                {
                    !success && (
                        <DialogActions>
                            {step > 1 && (
                                <Button
                                    onClick={handleBack}
                                    disabled={savingBack || loading || savingStep}
                                    endIcon={savingBack ? <CircularProgress size={20} /> : null}
                                >
                                    Back
                                </Button>
                            )}

                            {step < steps.length ? (
                                <Button
                                    onClick={handleNext}
                                    variant="contained"
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
                                    {mode === "edit" ? "Submit" : "Submit"}
                                </Button>
                            )}
                        </DialogActions>
                    )
                }
            </Dialog >
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
            <Dialog open={closeConfirmDialog} onClose={handleCancelClose}>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogContent>
                    <Typography>
                        Do you really want to close?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmClose} color="primary" variant="contained">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
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

export default LifeInsuranceFormDialog;