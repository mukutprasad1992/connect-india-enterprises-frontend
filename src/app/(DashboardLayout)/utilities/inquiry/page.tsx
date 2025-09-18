"use client";
import {
    Grid,
    Box,
    CircularProgress,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Container,
    Typography,
    Snackbar,
    Alert,
    Avatar,
    Divider,
    Tooltip,
    Link
} from "@mui/material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import GridOnIcon from '@mui/icons-material/GridOn';
import CloseIcon from "@mui/icons-material/Close";
import { CheckCircle, Cancel, HourglassEmpty, Pending, Visibility } from "@mui/icons-material";
import axios from "axios";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useRouter } from 'next/navigation';
import { DataGrid, GridToolbarColumnsButton, GridToolbar, GridToolbarContainer } from "@mui/x-data-grid";
import DashboardCard from "../../components/shared/DashboardCard";
import { jwtDecode } from "jwt-decode";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { formatDateTime } from "@/utils/utils";
import React from "react";
import { loadLayoutFromLocalStorage, saveLayoutToLocalStorage } from "@/app/utils/utils";
import CustomToolbar from "../../components/CustomToolbar";

const defaultColumnVisibility = {
    id: false,
    type: true,
    aadharNumber: true,
    email: false,
    mobile: false,
    placeOfBirth: false,
    income: false,
    occupation: false,
    nomineeIdType: false,
    nomineeId: false,
    nomineeMobile: false,
    nomineeRelation: false,
    submit: false,
    status: true,
    activeSteps: true,
    actions: true,
}

dayjs.extend(customParseFormat);

const InquiryPage = () => {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [actionType, setActionType] = useState<'approve' | 'reject' | 'in progress' | 'pending' | null>(null);
    const [selectedInquiryId, setSelectedInquiryId] = useState<number | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [columnsVisibilityModel, setColumnsVisibilityModel] = useState<any>(defaultColumnVisibility);
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    const [filterModel, setFilterModel] = React.useState({ items: [] });
    const router = useRouter();
    const getToken = () => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem('accessToken');
            return token;
        }
    }
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
    const AWS_S3_BUCKET_URL = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL || 'https://connect-india-upload-documents.s3.ap-south-1.amazonaws.com';
    const DOCUMENT_KEYS = [
        'panCardFileKey',
        'aadharCardFileKey',
        'cancelledChequeFileKey',
        'salarySlipsFileKey',
        'bankStatementFileKey',
        'itrDcumentsFileKey',
        'photoFileKey',
        'signatureFileKey',
        'salarySlipsFileKey',
        "itrDocumentsFileKey",
        "bankProofFileKey",
    ];

    const LOCAL_KEY = "adminPrefrence";

    useEffect(() => {
        const saved = loadLayoutFromLocalStorage(LOCAL_KEY);
        if (saved) {
            setColumnsVisibilityModel(saved);
        }
    }, []);
    const handleSaveLayout = () => {
        saveLayoutToLocalStorage(LOCAL_KEY, columnsVisibilityModel);
    };

    const token = getToken();
    const getRoleId = () => {
        if (typeof window !== "undefined") {
            const storedRole = localStorage.getItem("roleId");
            const roleId = storedRole ? parseInt(storedRole, 10) : null;
            return roleId;
        }
    }
    const roleId = getRoleId();
    const getUser = () => {
        if (typeof window !== "undefined") {
            const user = localStorage.getItem('user');
            return user;
        }
    }
    const user = getUser();
    const userObj = user ? JSON.parse(user) : null;
    const userName = `${userObj?.firstName}  ${userObj?.lastName}`

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
            if (roleId !== 1) {
                localStorage.clear();
                router.push("/authentication/login");
            }
        } else {
            localStorage.clear();
            router.push("/authentication/login");
        }
    }, [router, token]);
    const handleSnackbarClose = () => {
        setSnackbarOpen(false);

    }
    const fetchInquiries = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/serviceType/getAllServiceType`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.status) {
                const formattedData = response.data.data.map((item: any) => {
                    const formattedItem: Record<string, any> = {};

                    Object.keys(item).forEach(key => {
                        const outputKey = key === 'serviceSubTypeName' ? 'type' : key;
                        formattedItem[outputKey] = item[key];
                    });

                    return formattedItem;
                });
                setInquiries(formattedData);
            } else {
                setSnackbarSeverity("error");
                setSnackbarMessage(response.data.message || "Something went wrong");
                setSnackbarOpen(true);
            }
        } catch (error: any) {
            setSnackbarSeverity("error");
            setSnackbarMessage(error?.response?.data?.message || "Something went wrong");
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, [token]);
    const handleApproveClick = (row: any) => {
        setActionType('approve');
        setSelectedInquiryId(row.id);
        setSelectedInquiry(row);
        setIsDialogOpen(true);
    };

    const handleInProgressClick = (row: any) => {
        setActionType('in progress');
        setSelectedInquiryId(row.id);
        setSelectedInquiry(row);
        setIsDialogOpen(true);
    };

    const handleRejectClick = (row: any) => {
        setActionType('reject');
        setSelectedInquiryId(row.id);
        setSelectedInquiry(row);
        setIsDialogOpen(true);
    };

    const updateInquiryStatus = async (
        action: 'approve' | 'reject' | 'in progress' | 'pending',
        id: number,
        currentStatus: string
    ) => {
        setIsLoading(true);
        try {
            let newStatus = "";

            if (action === "approve") newStatus = "Approved";
            else if (action === "reject") newStatus = "Rejected";
            else if (action === "in progress") newStatus = currentStatus === "In Progress" ? "Pending" : "In Progress";

            // ✅ update locally for instant UI response
            // setInquiries((prev) =>
            //     prev.map((inq) =>
            //         inq.id === id ? { ...inq, status: newStatus } : inq
            //     )
            // );

            const response = await axios.put(
                `${BASE_URL}/serviceType/updateStatus/${id}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.status) {
                await fetchInquiries(); // sync with backend again
                setSnackbarSeverity("success");
                setSnackbarMessage(response.data.message || "Status updated successfully");
            } else {
                setSnackbarSeverity("error");
                setSnackbarMessage(response.data.message || "Failed to update status");
            }
            setSnackbarOpen(true);
        } catch (error: any) {
            setSnackbarSeverity("error");
            setSnackbarMessage(error?.response?.data?.message || "Something went wrong");
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.1 },
        { field: "firstName", headerName: "First Name", flex: 0.1 },
        { field: "lastName", headerName: "Last Name", flex: 0.1 },
        { field: "email", headerName: "Email", flex: 0.08 },
        { field: "mobile", headerName: "Mobile No", flex: 0.08 },
        { field: "aadharNumber", headerName: "Aadhar Number", flex: 0.12 },
        { field: "panNumber", headerName: "PAN Number", flex: 0.12 },
        { field: "type", headerName: "Type", flex: 0.12 },
        { field: "nomineeIdType", headerName: "nominee Id Type", flex: 0.12 },
        { field: "nomineeId", headerName: "nominee Id", flex: 0.12 },
        { field: "nomineeMobile", headerName: "Nominee Mobile", flex: 0.12 },
        { field: "nomineeRelation", headerName: "nominee Relation", flex: 0.12 },

        { field: "activeSteps", headerName: "activeSteps", flex: 0.12 },
        {
            field: "submit",
            headerName: "Form Status",
            flex: 0.1,
            renderCell: (params: any) => {
                return params.row.isDetailsConfirmed ? "True" : "False";
            },
        },
        {
            field: 'placeOfBirth',
            headerName: 'Place of Birth',
            width: 200,
            valueGetter: (params: any) => {
                return `${params?.city || ''}`.trim().replace(/^,|,$/, '') || 'N/A';
            },
        },
        {
            field: "status",
            headerName: "Status",
            flex: 0.12,
            renderCell: (params: any) => {
                const status = params.row.status;
                let color = "#8b8a3fff";

                switch (status) {
                    case "Pending":
                        color = "#8b8a3fff";
                        break;
                    case "In Progress":
                        color = "orange";
                        break;
                    case "Approved":
                        color = "#8df1b4";
                        break;
                    case "Rejected":
                        color = "#ff8780";
                        break;
                    default:
                        color = "#8b8a3fff";
                }

                return (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <Typography
                            sx={{ color, textAlign: "start" }}
                        >
                            {status}
                        </Typography>
                    </Box>
                );
            },
        }
        ,
        {
            field: "actions",
            headerName: "Actions",
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            minWidth: 130,
            flex: 0.12,
            renderCell: (params: any) => {
                const status = params.row.status;
                const submit = params.row.submit
                return (
                    <Box sx={{ display: "flex", gap: 0.01, alignItems: "center", px: 0.5, width: "100%", height: "100%" }}>
                        <Tooltip title="View">
                            <IconButton sx={{ p: 0.2 }}
                                color="info"
                                onClick={() => {
                                    setSelectedInquiry(params.row);
                                    setIsViewDialogOpen(true);
                                }}
                            >
                                <Visibility />
                            </IconButton>
                        </Tooltip>

                        {submit === 1 && status !== "Approved" && status !== "Rejected" && (
                            <>
                                <Tooltip title="Approve">
                                    <IconButton sx={{ p: 0.2 }} color="success" onClick={() => handleApproveClick(params.row)}>
                                        <CheckCircle />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title={status === "Pending" ? "Pending" : "In Progress"}>
                                    <IconButton
                                        key={`${params.id}-${status}`}
                                        color="inherit"
                                        onClick={() => handleInProgressClick(params.row)}
                                        sx={{ color: "unset !important", p: 0.2 }}
                                    >
                                        <Pending
                                            htmlColor={status === "Pending" ? "#8b8a3fff" : "orange"}
                                            fontSize="medium"
                                        />
                                    </IconButton>
                                </Tooltip>

                                <Tooltip title="Reject">
                                    <IconButton sx={{ p: 0.2 }} color="error" onClick={() => handleRejectClick(params.row)}>
                                        <Cancel />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                    </Box>
                );
            },
        }
    ];

    const getActionText = (actionType: string | null, currentStatus?: string) => {
        if (actionType === "in progress") {
            if (currentStatus === "In Progress") {
                return "Move back to Pending";
            } else {
                return "Mark as In Progress";
            }
        }
        switch (actionType) {
            case "approve":
                return "Approval";
            case "reject":
                return "Rejection";
            case "Pending":
                return "Pending";
            default:
                return "";
        }
    };

    const exportToPDF = async (inquiries: any[], userName: string) => {
        const doc = new jsPDF({ orientation: "landscape" });

        const pageWidth = doc.internal.pageSize.getWidth();
        const logoWidth = 60;
        const logoHeight = 15;
        const logoX = (pageWidth - logoWidth) / 2;

        const dataTime = formatDateTime(new Date());
        doc.addImage('/images/logos/logo.png', "PNG", logoX, 7, logoWidth, logoHeight);
        doc.setFontSize(12);
        doc.text("INQUIRY LIST", 14, 35);
        doc.text("Name: " + userName, 14, 43);
        doc.text(dataTime, pageWidth - 14, 35, { align: "right" });

        autoTable(doc, {
            startY: 50,
            head: [[
                "ID", "First Name", "Last Name", "Email", "Mobile No", "Type",
                "Service Id", "Email", "Aadhar Number", "Pan Number", "mobile", "Status"
            ]],
            body: (inquiries || []).map((row: any) => [
                row.id,
                row.firstName,
                row.lastName,
                row.email,
                row.mobileNo,
                row.type,
                row.serviceId,
                row.email,
                row.aadharNumber,
                row.panNumber,
                row.mobile,
                row.status,
            ]),
            headStyles: {
                fillColor: [165, 42, 42],
                textColor: 255,
                halign: "center",
                fontStyle: "bold",
                fontSize: 8,
            },
            bodyStyles: {
                fontSize: 8,
                halign: "center",
            },
            styles: {
                overflow: "linebreak",
                cellWidth: "wrap",
            },
        });
        const pdfBlob = doc.output("blob");
        const fileURL = URL.createObjectURL(pdfBlob);
        window.open(fileURL);
        doc.save("AllInquiryData.pdf");
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(inquiries || []);

        const headerKeys = Object.keys(inquiries[0] || {});
        headerKeys.forEach((key, idx) => {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: idx });
            worksheet[cellAddress].s = {
                fill: {
                    patternType: "solid",
                    fgColor: { rgb: "A52A2A" },
                },
                font: {
                    bold: true,
                    color: { rgb: "FFFFFF" },
                },
                alignment: {
                    horizontal: "center",
                    vertical: "center",
                },
            };
        });

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inquiry");

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });

        const blob = new Blob([excelBuffer], {
            type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        const fileURL = URL.createObjectURL(blob);
        saveAs(blob, "Inquiry.xlsx");
    };
    const formatKey = (key: any) => {
        return key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str: any) => str.toUpperCase());
    };

    const renderValue = (key: any, value: any) => {
        if (typeof value === "object" && value !== null) {
            return Object.entries(value)
                .map(([k, v]) => `${k}: ${v}`)
                .join(", ");
        }

        if (DOCUMENT_KEYS.includes(key)) {
            return value ? (
                <Link
                    href={`${AWS_S3_BUCKET_URL}/${value}`}
                    target="_blank"
                    color="primary"
                    underline="hover"
                >
                    View Document
                </Link>
            ) : "N/A";
        }
        const statusColors: Record<string, string> = {
            Complete: "green",
            'In Complete': "gray",
            Pending: "#8b8a3fff",
            "In Progress": "orange",
            Approved: "#6ad392ff",
            Rejected: "#ff8780",
        };

        if (key === "submit") {
            const displayValue = value === 1 ? "Complete" : "In Complete";
            return (
                <span
                    style={{
                        color: statusColors[displayValue],
                        // fontWeight: "bold",
                    }}
                >
                    {displayValue}
                </span>
            );
        }
        if (key === "status") {
            return (
                <span
                    style={{
                        color: statusColors[value] || "inherit",
                        fontWeight: "bold",
                    }}
                >
                    {value || "N/A"}
                </span>
            );
        }
        return value ?? "N/A";
    };
    return (
        <>
            {isLoading && (
                <div
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 1000,
                    }}
                >
                    <CircularProgress />
                </div>
            )}
            <PageContainer title="Inquiry" description="This is the inquiry page">
                <Box>
                    <Grid container spacing={1}>
                        <Grid item xs={12} sx={{ mb: 2 }}>
                            <Box display="flex" justifyContent="flex-end" alignItems="center">
                                <Tooltip title="Export to Excel">
                                    <IconButton onClick={exportToExcel}>
                                        <GridOnIcon sx={{ color: "#44a7a2" }} />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Export to PDF">
                                    <IconButton
                                        onClick={() => exportToPDF(inquiries, userName)}
                                    >
                                        <PictureAsPdfIcon sx={{ color: "#44a7a2" }} />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <DashboardCard >
                                <Container>
                                    <Grid
                                        container
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ mb: 2 }}
                                    >
                                        <Typography variant="h4">Inquiry</Typography>
                                    </Grid>
                                    <Box sx={{ flexGrow: 1, width: "100%", height: "auto", minHeight: "60vh", display: "flex" }}>
                                        <DataGrid
                                            rows={inquiries || []}
                                            columns={columns.map((col) => ({ ...col, flex: 1, editable: false }))}
                                            pageSizeOptions={[5, 10, 20, 50, 100]}
                                            paginationModel={pagination}
                                            onPaginationModelChange={setPagination}
                                            disableRowSelectionOnClick
                                            autoHeight
                                            sortModel={[{ field: "id", sort: "desc" }]}
                                            slots={{
                                                toolbar: () => <CustomToolbar onSave={handleSaveLayout} />
                                            }}
                                            columnVisibilityModel={columnsVisibilityModel}
                                            onColumnVisibilityModelChange={(newModel) =>
                                                setColumnsVisibilityModel(newModel)
                                            }
                                        />
                                    </Box>
                                </Container>
                            </DashboardCard>
                        </Grid>
                    </Grid>
                </Box>
            </PageContainer >
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                <DialogTitle>
                    {`Confirm ${getActionText(actionType, selectedInquiry?.status)}`}
                </DialogTitle>

                <DialogContent>
                    Are you sure you want to {getActionText(actionType, selectedInquiry?.status)} this inquiry?
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            if (actionType && selectedInquiryId !== null) {
                                const selectedInquiryItem = inquiries.find(inq => inq.id === selectedInquiryId);
                                updateInquiryStatus(actionType, selectedInquiryId, selectedInquiryItem?.status || "");
                                setIsDialogOpen(false);
                            }
                        }}
                        color="primary"
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={isViewDialogOpen} onClose={() => setIsViewDialogOpen(false)} maxWidth="sm" fullWidth>
                <Grid container justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
                    <Grid item>
                        <Typography variant="h6">Inquiry Details</Typography>
                    </Grid>
                    <Grid item>
                        <IconButton onClick={() => setIsViewDialogOpen(false)} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Grid>
                </Grid>
                <DialogContent>
                    {selectedInquiry && (
                        <>
                            <Box display="flex" justifyContent="center" mb={2}>
                                <Avatar
                                    src={
                                        selectedInquiry?.profileImageKey
                                            ? `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL}/${selectedInquiry.profileImageKey}`
                                            : '/images/profile/user-1.jpg'
                                    }
                                    alt="User"
                                    sx={{ width: 150, height: 150 }}
                                    onError={(e) => { (e.target as HTMLImageElement).src = '/images/profile/user-1.jpg'; }}
                                />
                            </Box>

                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={2}>
                                {Object.entries(selectedInquiry)
                                    .filter(([key]) => key !== 'profileImageKey')
                                    .map(([key, value]) => (
                                        <Grid item xs={12} key={key}>
                                            <Box display="flex" gap={1}>
                                                <Typography variant="subtitle1" fontWeight="bold" minWidth="250px">
                                                    {formatKey(key)}:
                                                </Typography>
                                                <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                                                    {renderValue(key, value)}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                            </Grid>
                        </>
                    )}
                </DialogContent>
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
        </>
    );
};

export default InquiryPage;


