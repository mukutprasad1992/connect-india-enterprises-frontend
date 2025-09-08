import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Typography,
    Stepper,
    Step,
    StepLabel,
    StepButton,
    IconButton,
    Link,
    CircularProgress,
    Box,
    Paper,
    Divider,
    FormControlLabel,
    Checkbox,
    Autocomplete,
    Tooltip,
    Chip
} from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileOpenOutlinedIcon from '@mui/icons-material/FileOpenOutlined';
import PreviewIcon from "@mui/icons-material/Preview";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import type { SelectChangeEvent } from "@mui/material/Select";
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";

interface MutualFundData {
    id: number | null;
    aadharNumber: string;
    aadharCardFileKey: File | string | null;
    panNumber: string;
    panCardFileKey: File | string | null;
    bankProofFileKey: File | string | null;
    salarySlipsFileKey: File | string | null;
    itrDocumentsFileKey: File | string | null;
    email: string;
    mobile: string;
    placeOfBirth: {
        city: string;
        state: string;
    };
    income: string;
    occupation: string;
    nomineeIdType: "aadhar" | "pan";
    nomineeId: string;
    nomineeMobile: string;
    nomineeRelation: string;
    submit: boolean;
    activeSteps?: string;
}

const defaultFormData: MutualFundData = {
    id: null,
    aadharNumber: "",
    aadharCardFileKey: null,
    panNumber: "",
    panCardFileKey: null,
    bankProofFileKey: null,
    salarySlipsFileKey: null,
    itrDocumentsFileKey: null,
    email: "",
    mobile: "",
    placeOfBirth: {
        city: "",
        state: ""
    },
    income: "",
    occupation: "",
    nomineeIdType: "aadhar",
    nomineeId: "",
    nomineeMobile: "",
    nomineeRelation: "",
    submit: false,
    activeSteps: "basicDetails"
};

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
interface City {
    city: string;
    state: string;
}
interface Props {
    open: boolean;
    onClose: () => void;
    initialData?: MutualFundData;
    mode?: "create" | "edit";
    setOpenDialog: (open: boolean) => void;
    onSuccess?: () => void;
}

const MutualFundFormDialog: React.FC<Props> = ({
    open,
    onClose,
    initialData,
    mode = "create",
    setOpenDialog,
    onSuccess,
}) => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<MutualFundData>(defaultFormData);
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState("");
    const [serviceId, setServiceId] = useState<number | null>(null);
    const [success, setSuccess] = useState(false);
    const [filePreviewUrls, setFilePreviewUrls] = useState<Record<string, string>>({});
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    const DOCUMENT_URL = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL;
    const steps = ["Basic Details", "Personal Details", "Nominee Details", "Documents", "Review"];
    const gridSpacing = { xs: 12, sm: 6 };
    const [savingNext, setSavingNext] = useState(false);
    const [savingBack, setSavingBack] = useState(false);
    const [initialFormData, setInitialFormData] = useState(formData);
    const [declarationIsDetailsConfirmed, setDeclarationIsDetailsConfirmed] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [savingStep, setSavingStep] = useState(false);
    const [cities, setCities] = useState<City[]>([]);
    const [maxAllowedStep, setMaxAllowedStep] = useState(1);
    const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
    const [dialogFileUrl, setDialogFileUrl] = useState<string | null>(null);
    const [dialogFileType, setDialogFileType] = useState<"image" | "pdf" | null>(null);
    const [fullScreen, setFullScreen] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [fileToRemove, setFileToRemove] = useState<keyof MutualFundData | null>(null);
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
        const token = getToken();
        if (!token) return;
        const fetchCities = async () => {
            setLoading(true);
            try {
                const res = await axios.get("http://localhost:4000/city/getCities", {
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

            const documentKeys: (keyof MutualFundData)[] = [
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

            let initialStep = 1;
            if (initialData.activeSteps) {
                initialStep = statusStepMap[initialData.activeSteps] || 1;
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

    const validateField = useCallback(
        (
            name: string,
            value: string | number | boolean | File | { city: string; state: string } | null | undefined
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
                    if (typeof value !== "string") return "Invalid email input";
                    const emailRegex =
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    if (!emailRegex.test(value)) return "Invalid email format";
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

                case "nomineeMobile":
                    if (!value) return "Nominee mobile is required";
                    if (typeof value === "string") {
                        const cleanNomineeMobile = value.replace(/^(\+91)/, "").trim().replace(/\D/g, "");
                        if (!/^[6-9]\d{9}$/.test(cleanNomineeMobile)) {
                            return "Invalid nominee mobile number";
                        }
                    }
                    return "";

                case "placeOfBirth":
                    if (!value || typeof value !== "object") return "Place of birth is required";
                    const place = value as { city: string; state: string };
                    if (!place.city) return "Place of birth is required";
                    const fullName = `${place.city}, ${place.state}`.trim();
                    if (fullName.length > 200) return "Place of birth cannot exceed 200 characters";
                    if ((fullName.match(/[A-Za-z]/g) || []).length < 5)
                        return "Place of birth must contain at least 5 letters";
                    return "";

                case "income":
                    if (!value) return "Income is required";
                    if (typeof value !== "string") return "Invalid income input";
                    return "";

                case "nomineeId":
                    return validateNomineeId(
                        typeof value === "string" ? value : "",
                        formData.nomineeIdType
                    );

                case "nomineeRelation":
                    if (!value) return "This field is required";
                    return "";

                case "occupation":
                    if (!value) return "Occupation is required";
                    return "";

                case "aadharCardFileKey":
                case "panCardFileKey":
                case "bankProofFileKey":
                    if (!value) return "This document is required";
                    if (!(typeof value === "string" || value instanceof File)) return "Invalid file input";
                    return "";

                case "salarySlipsFileKey":
                    if (formData.occupation === "Job") {
                        if (!value) return "Salary slips are required for Job";
                        if (!(typeof value === "string" || value instanceof File)) return "Invalid salary slips input";
                    }
                    return "";

                case "itrDocumentsFileKey":
                    if (formData.occupation === "Business") {
                        if (!value) return "ITR documents are required for Business";
                        if (!(typeof value === "string" || value instanceof File)) return "Invalid ITR document input";
                    }
                    return "";
            }
        },
        [formData.occupation, formData.nomineeIdType]
    );


    function validateNomineeId(
        nomineeId: string,
        type: "aadhar" | "pan"
    ): string {
        if (!nomineeId) return "Nominee ID is required";

        const id = nomineeId.trim().toUpperCase();

        if (type === "aadhar") {
            if (!/^(\d{12}|\d{16})$/.test(id)) {
                return "Invalid Aadhaar format (must be 12 or 16 digits)";
            }
            return "";
        }

        if (type === "pan") {
            if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(id)) {
                return "Invalid PAN format (e.g., ABCDE1234F)";
            }
            return "";
        }

        return "";
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === "panNumber" || (name === "nomineeId" && formData.nomineeIdType === "pan")) {

            formattedValue = value.toUpperCase().slice(0, 10);
        } else if (
            name === "aadharNumber" ||
            name === "mobile" ||
            name === "nomineeMobile" ||
            (name === "nomineeId" && formData.nomineeIdType === "aadhar")
        ) {
            const maxLength =
                name === "aadharNumber" || formData.nomineeIdType === "aadhar" ? 16 : 10;
            formattedValue = value.replace(/\D/g, "").slice(0, maxLength);
        }

        setFormData((prev) => ({ ...prev, [name]: formattedValue }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (!files?.length) {
            // If user clears the file, reset value and error
            setFormData(prev => ({ ...prev, [name]: "" }));
            setErrors(prev => ({ ...prev, [name]: "This document is required" }));
            setFilePreviewUrls(prev => ({ ...prev, [name]: "" }));
            return;
        }

        const file = files[0];
        const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
        const maxSize = 10 * 1024 * 1024; // 10MB

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

        // Set file and clear error
        setFormData(prev => ({ ...prev, [name]: file }));
        setErrors(prev => ({ ...prev, [name]: "" }));

        const previewUrl = URL.createObjectURL(file);
        setFilePreviewUrls(prev => ({ ...prev, [name]: previewUrl }));
    };


    const [fileCache, setFileCache] = useState<{
        salarySlips?: File | string | null;
        itrDocuments?: File | string | null;
    }>({});

    const handleSelectChange = (event: SelectChangeEvent<string>) => {
        const { name, value } = event.target;

        setFormData(prev => {
            const updatedData: any = { ...prev, [name]: value };

            if (prev.occupation === "Job" && value !== "Job") {
                setFileCache(cache => ({ ...cache, salarySlips: prev.salarySlipsFileKey }));
                updatedData.salarySlipsFileKey = null;
            }

            if (prev.occupation === "Business" && value !== "Business") {
                setFileCache(cache => ({ ...cache, itrDocuments: prev.itrDocumentsFileKey }));
                updatedData.itrDocumentsFileKey = null;
            }

            if (value === "Job" && prev.occupation !== "Job" && fileCache.salarySlips) {
                updatedData.salarySlipsFileKey = fileCache.salarySlips;
            }

            if (value === "Business" && prev.occupation !== "Business" && fileCache.itrDocuments) {
                updatedData.itrDocumentsFileKey = fileCache.itrDocuments;
            }

            return updatedData;
        });

        if (errors.occupation) {
            setErrors(prev => ({ ...prev, occupation: '' }));
        }
    };

    const saveStepData = async (stepNumber: number) => {
        try {
            const token = getToken();
            if (!token) return;

            const stepKey = stepStatusMap[stepNumber];
            if (!stepKey) return;

            let stepData: Partial<MutualFundData> = {};

            switch (stepKey) {
                case "basicDetails":
                    stepData = {
                        aadharNumber: formData.aadharNumber,
                        panNumber: formData.panNumber,
                    };
                    break;

                case "personalDetails":
                    stepData = {
                        email: formData.email,
                        mobile: formData.mobile ? `+91 ${formData.mobile}` : undefined,
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
                        nomineeIdType: formData.nomineeIdType,
                        nomineeId: formData.nomineeId,
                        nomineeMobile: formData.nomineeMobile ? ` +91 ${formData.nomineeMobile}` : undefined,
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
                        nomineeMobile: formData.nomineeMobile ? `+91 ${formData.nomineeMobile}` : undefined,
                    };
                    break;
            }

            const payload = {
                activeSteps: stepKey,
                ...stepData,
                serviceId: 1,
                ServiceSubType: "Mutual Funds",
                status: "Pending",
            };

            if (formData.id) {
                const response = await axios.put(
                    `${BASE_URL}/serviceType/updateServiceTypeById/${formData.id || serviceId}`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (stepNumber > maxAllowedStep) {
                    setMaxAllowedStep(stepNumber);
                }
            } else if (stepNumber === 1) {
                const res = await axios.post(
                    `${BASE_URL}/serviceType/createServiceType`,
                    payload,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setServiceId(res.data.data.id);
                setFormData(prev => ({ ...prev, id: res.data.data.id }));
                setMaxAllowedStep(1);
            } else {
                console.warn("Cannot save step without an ID");
            }
        } catch (error) {
            console.error("Step save failed", error);
            throw error;
        }
    };

    // const isFormDataChanged = () => {
    //     return JSON.stringify(formData) !== JSON.stringify(initialFormData);
    // };

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
                const documentFields: (keyof MutualFundData)[] = ['aadharCardFileKey', 'panCardFileKey', 'bankProofFileKey'];
                if (formData.occupation === "Job") documentFields.push('salarySlipsFileKey');
                if (formData.occupation === "Business") documentFields.push('itrDocumentsFileKey');

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


    const handleNext = async () => {
        const isValid = validateStep();
        if (!isValid) {
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

                for (const { field, folder } of fileKeys) {
                    const file = formData[field as keyof MutualFundData];
                    if (file instanceof File) {
                        const key = await uploadFileToServer(file, folder);
                        (formData as any)[field] = key;
                    }
                }
                await saveStepData(step);
                setInitialFormData(formData);
                setStep((prev) => prev + 1);
                setMaxAllowedStep(5);
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

    const handleBlur = (e: any) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        if (error) {
            setErrors(prev => ({ ...prev, [name]: error }));
        } else {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

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
        setStep(1);
        setErrors({});
        setSuccess(false);
        setFormData(defaultFormData);
        setMaxAllowedStep(1);
        onClose();

        if (onSuccess) {
            onSuccess();
        }
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

            await axios.put(
                `${BASE_URL}/serviceType/updateServiceTypeById/${finalId}`,
                {
                    activeSteps: "review",
                    submit: formData.submit ? 1 : 0,
                    serviceId: 1,
                    ServiceSubType: "mutualFund",
                    status: "Pending",
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setSuccess(true);
            onSuccess?.();

            setTimeout(() => {
                setOpenPreviewDialog(false);
            }, 1500);

        } catch (err) {
            console.error("Failed to submit application", err);
            setErrors(prev => ({
                ...prev,
                form: "Failed to submit application. Please try again."
            }));
        }
    };

    const getShortFileName = (fileName: string): string => {
        if (!fileName) return "";
        const parts = fileName.split(".");
        const ext = parts.length > 1 ? "." + parts.pop() : "";
        const firstChar = fileName.charAt(0);
        return `${firstChar}...${ext}`;
    };

    const renderFilePreviewDialog = () => (
        <Dialog
            open={openPreviewDialog}
            onClose={() => setOpenPreviewDialog(false)}
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
    const renderFileUpload = (label: string, name: keyof MutualFundData) => {
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
                                p: 2,
                                border: "1px solid #e0e0e0",
                                borderRadius: 2,
                                "&:hover": { borderColor: "primary.main", boxShadow: 2 },
                            }}
                        >
                            <Grid container alignItems="center" spacing={2}>
                                {/* Label */}
                                <Grid item xs={12} sm={3}>
                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                        <span style={{ color: "red" }}>*</span> {label}
                                    </Typography>
                                </Grid>

                                {/* File Info + Actions */}
                                <Grid item xs={12} sm={5} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                    {fileName ? (
                                        <Tooltip title={fileName || "No file chosen"} arrow>
                                            <Chip
                                                icon={<InsertDriveFileIcon />}
                                                label={fileName}
                                                variant="outlined"
                                                sx={{ maxWidth: "70%", textOverflow: "ellipsis", overflow: "hidden" }}
                                            />
                                        </Tooltip>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            No file chosen
                                        </Typography>
                                    )}
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

                                {/* Upload Button */}
                                <Grid item xs={12} sm={4}>
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
            <Grid item xs={12} sm={6}>
                <Paper
                    elevation={0}
                    sx={{ p: 2, mb: 2, border: "1px solid #eee", borderRadius: 2 }}
                >
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {label}
                    </Typography>

                    {fileUrl ? (
                        <Link href={fileUrl} target="_blank" rel="noopener">
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
                {renderReviewItem("Place of Birth", formData.placeOfBirth.city)}
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
                {formData.aadharCardFileKey && renderReviewItem("Aadhar Card", formData.aadharCardFileKey)}
                {formData.panCardFileKey && renderReviewItem("PAN Card", formData.panCardFileKey)}
                {formData.bankProofFileKey && renderReviewItem("Bank Proof", formData.bankProofFileKey)}
                {formData.occupation === "Job" && formData.salarySlipsFileKey &&
                    renderReviewItem("Salary Slips", formData.salarySlipsFileKey)}
                {formData.occupation === "Business" && formData.itrDocumentsFileKey &&
                    renderReviewItem("ITR Documents", formData.itrDocumentsFileKey)}
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
    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <Grid container spacing={2}>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label={
                                    <>
                                        Aadhar Number<span style={{ color: "red" }}>*</span>
                                    </>
                                }
                                name="aadharNumber"
                                value={formData.aadharNumber}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.aadharNumber}
                                disabled={loading}
                                helperText={errors.aadharNumber || "Format: 12 or 16 digit"}
                                margin="dense"
                                className="customTextField"
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label={
                                    <>
                                        Pan Number<span style={{ color: "red" }}>*</span>
                                    </>
                                }
                                name="panNumber"
                                value={formData.panNumber}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                error={!!errors.panNumber}
                                helperText={errors.panNumber || "Format: ABCDE1234F"}
                                disabled={loading}
                                margin="dense"
                                className="customTextField"
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
                                    <>
                                        Email<span style={{ color: "red" }}>*</span>
                                    </>
                                }
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                inputProps={{
                                    maxLength: 50,
                                }}
                                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                    const input = e.currentTarget;
                                    if (input?.value?.length > 50) {
                                        input.value = input?.value.slice(0, 50);
                                    }
                                }}
                                error={!!errors.email}
                                helperText={errors.email}
                                disabled={loading}
                                className="customTextField"
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label={
                                    <>
                                        Mobile Number<span style={{ color: "red" }}>*</span>
                                    </>
                                }
                                name="mobile"
                                value={formData?.mobile ? formData.mobile.replace(/^(\+91 )/, '') : ""}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        mobile: e.target?.value.replace(/\D/, ''),
                                    })
                                }
                                onBlur={handleBlur}
                                error={!!errors.mobile}
                                helperText={errors.mobile}
                                disabled={loading}
                                className="customTextField"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment
                                            position="start"
                                            sx={{
                                                marginRight: "0px",
                                            }}
                                        >
                                            +91
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
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
                                    const error = validateField("placeOfBirth", formData.placeOfBirth as any);
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
                                        helperText={errors.placeOfBirth || "Select your city"}
                                        margin="dense"
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <FormControl fullWidth error={!!errors.occupation} className="customSelect">
                                <InputLabel >Occupation <span style={{ color: "red" }}>*</span></InputLabel>
                                <Select
                                    name="occupation"
                                    value={formData.occupation}
                                    onChange={handleSelectChange}
                                    label="Occupation"
                                    disabled={loading}
                                    className="customSelect"
                                >
                                    <MenuItem value="Job">JOB</MenuItem>
                                    <MenuItem value="Business">BUSINESS</MenuItem>
                                </Select>
                                {errors.occupation && (
                                    <Typography color="error" variant="caption">
                                        {errors.occupation}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <FormControl fullWidth error={!!errors.income} disabled={loading} className="customSelect">
                                <InputLabel>{formData.occupation === "Business" ? "Net Gross Profit" : "Annual Income"}<span style={{ color: "red" }}>*</span></InputLabel>
                                <Select
                                    name="income"
                                    value={formData.income}
                                    onChange={handleSelectChange}
                                    label={formData.occupation === "Business" ? "Net Gross Profit" : "Annual Income"}
                                    disabled={loading}
                                    className="customSelect"
                                >
                                    {incomeOptions.map(option => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.income && (
                                    <Typography color="error" variant="caption">
                                        {errors.income}
                                    </Typography>
                                )}
                            </FormControl>

                        </Grid>
                    </Grid >
                );
            case 3:
                return (
                    <Grid container spacing={2}>
                        <Grid item {...gridSpacing}>
                            <TextField
                                select
                                fullWidth
                                label={
                                    <>
                                        Select ID Type<span style={{ color: "red" }}>*</span>
                                    </>
                                }
                                name="nomineeIdType"
                                value={formData.nomineeIdType}
                                onChange={handleInputChange}
                                disabled={loading}
                                className="customTextField"
                            >
                                <MenuItem value="aadhar">Aadhar</MenuItem>
                                <MenuItem value="pan">PAN</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label={
                                    <>
                                        {formData.nomineeIdType === "aadhar" ? "Aadhar Number" : "PAN Number"}<span style={{ color: "red" }}>*</span>
                                    </>
                                }
                                name="nomineeId"
                                value={formData.nomineeId}
                                onChange={handleInputChange}
                                onBlur={handleBlur}
                                inputProps={{
                                    maxLength: formData?.nomineeIdType === "aadhar" ? 16 : 10,
                                    style: { textTransform: formData?.nomineeIdType === "pan" ? "uppercase" : "none" },
                                }}
                                onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                    const input = e.currentTarget;
                                    const maxLength = formData?.nomineeIdType === "aadhar" ? 16
                                        : formData?.nomineeIdType === "pan" ? 10
                                            : undefined;

                                    if (maxLength && input?.value?.length > maxLength) {
                                        input.value = input?.value?.slice(0, maxLength);
                                    }
                                }}
                                error={!!errors.nomineeId}
                                helperText={
                                    errors.nomineeId ||
                                    (formData.nomineeIdType === "aadhar" ? "12 or 16 digits" : "10 alphanumeric characters")
                                }
                                disabled={loading}
                                className="customTextField"
                            />
                        </Grid>
                        <Grid item {...gridSpacing}>
                            <TextField
                                fullWidth
                                label={
                                    <>
                                        Nominee Mobile<span style={{ color: "red" }}>*</span>
                                    </>
                                }
                                name="nomineeMobile"
                                value={formData?.nomineeMobile ? formData.nomineeMobile.replace(/^(\+91 )/, '') : ""}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        nomineeMobile: e.target?.value.replace(/\D/, ''),
                                    });
                                }}
                                onBlur={handleBlur}
                                error={!!errors.nomineeMobile}
                                helperText={errors.nomineeMobile}
                                disabled={loading}
                                className="customTextField"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment
                                            position="start"
                                            sx={{ marginRight: "0px" }}
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

                        {/* Preview Dialog */}
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
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
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
                        const completed = stepNumber < step || (stepNumber < maxAllowedStep && stepNumber !== step);
                        const isEditable = stepNumber <= maxAllowedStep;

                        return (
                            <Step key={label} completed={completed}>
                                <StepButton
                                    onClick={() => isEditable && handleStepClick(stepNumber)}
                                    disabled={!isEditable || savingStep}
                                    sx={{
                                        '& .MuiStepLabel-label.Mui-active': {
                                            color: 'green !important',
                                            fontWeight: 'bold',
                                        },
                                        '& .MuiStepIcon-root.Mui-active': {
                                            color: 'green',
                                        },
                                        '& .MuiStepIcon-root.Mui-completed': {
                                            color: 'green',
                                        },
                                    }}
                                >
                                    <StepLabel>{label}</StepLabel>
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
            )}
        </Dialog>
    );
};

export default MutualFundFormDialog;