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
    Tooltip
} from "@mui/material";
import { CheckCircle, Cancel, HourglassEmpty, Pending, Visibility } from "@mui/icons-material";
import axios from "axios";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useRouter } from 'next/navigation';
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer } from "@mui/x-data-grid";
import DashboardCard from "../../components/shared/DashboardCard";
import { jwtDecode } from "jwt-decode";
import theme from "@/utils/theme";

dayjs.extend(customParseFormat);

const InquiryPage = () => {
    const [inquiries, setInquiries] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [actionType, setActionType] = useState<'approve' | 'reject' | 'in progress' | null>(null);
    const [selectedInquiryId, setSelectedInquiryId] = useState<number | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
    const router = useRouter();
    const getToken = () => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem('accessToken');
            return token;
        }
    }
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
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
                // setSnackbarSeverity("success");
                // setSnackbarMessage(response.data.message || "Data fetched successfully");
                // setSnackbarOpen(true);

                const formattedData = response.data.data.map((item: any) => ({
                    id: item.id,
                    firstName: item.firstName,
                    lastName: item.lastName,
                    email: item.email,
                    mobileNo: item.mobileNo,
                    type: item.serviceSubType,
                    amount: item.amount,
                    duration: item.duration,
                    fromTime: item.fromTime,
                    toTime: item.toTime,
                    status: item.status,
                    comment: item.comment,
                    profileImageURL: item.profileImageURL
                }));

                setInquiries(formattedData);
            } else {
                setSnackbarSeverity("error");
                setSnackbarMessage(response.data.message || "Something went wrong");
                setSnackbarOpen(true);
            }
        } catch (error: any) {
            setSnackbarSeverity("error");
            setSnackbarMessage(error.response.data.message);
            setSnackbarOpen(true);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchInquiries();
    }, [token]);

    const handleApproveClick = (id: number) => {
        setActionType('approve');
        setSelectedInquiryId(id);
        setIsDialogOpen(true);
    };

    const handleInProgressClick = (id: number) => {
        setActionType('in progress');
        setSelectedInquiryId(id);
        setIsDialogOpen(true);
    };

    const handleRejectClick = (id: number) => {
        setActionType('reject');
        setSelectedInquiryId(id);
        setIsDialogOpen(true);
    };

    const updateInquiryStatus = async (action: 'approve' | 'reject' | 'in progress', id: number, currentStatus: string) => {
        setIsLoading(true);
        try {
            let newStatus = "";

            if (action === 'approve') {
                newStatus = "Approved";
            } else if (action === 'reject') {
                newStatus = "Rejected";
            } else if (action === 'in progress') {

                if (currentStatus === "In Progress") {
                    newStatus = "Pending";
                } else {
                    newStatus = "In Progress";
                }
            }
            if (token) {
                const decoded: any = jwtDecode(token);
                if (decoded.exp * 1000 < Date.now()) {
                    localStorage.clear();
                    router.push("/authentication/login");
                }
            }
            const response = await axios.put(
                `${BASE_URL}/serviceType/updateStatus/${id}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.status) {
                setInquiries(prev => prev.map(inquiry =>
                    inquiry.id === id ? { ...inquiry, status: newStatus } : inquiry
                ));
            }
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (time: string | null) => {
        if (!time) return "N/A";
        const [hours, minutes] = time.split(":");
        let hourNum = parseInt(hours, 10);
        const amPm = hourNum >= 12 ? "PM" : "AM";
        hourNum = hourNum % 12 || 12;
        return `${hourNum}:${minutes} ${amPm}`;
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.02 },
        { field: "firstName", headerName: "First Name", flex: 0.08 },
        { field: "lastName", headerName: "Last Name", flex: 0.08 },
        { field: "email", headerName: "Email", flex: 0.08 },
        { field: "mobileNo", headerName: "Mobile No", flex: 0.08 },
        { field: "type", headerName: "Type", flex: 0.12 },
        { field: "amount", headerName: "Amount", flex: 0.12 },
        {
            field: "duration",
            headerName: "Duration",
            flex: 0.12,
            renderCell: (params: any) => `${params.value} Months`,
        },
        {
            field: "fromTime",
            headerName: "Contact Timing",
            flex: 0.12,
            renderCell: (params: any) => {
                const fromTime = formatTime(params.row.fromTime);
                const toTime = formatTime(params.row.toTime);
                return fromTime !== "N/A" && toTime !== "N/A" ? `${fromTime} - ${toTime}` : "N/A";
            },
        },
        {
            field: "status",
            headerName: "Status",
            flex: 0.12,
            renderCell: (params: any) => {
                const status = params.row.status;
                let color = "yellow";

                switch (status) {
                    case "Pending":
                        color = "#ffeb3b";
                        break;
                    case "In Progress":
                        color = "#ffa726";
                        break;
                    case "Approved":
                        color = "#4caf50";
                        break;
                    case "Rejected":
                        color = "#ff5252";
                        break;
                    default:
                        color = "#ffeb3b";
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
                            variant="body1"
                            sx={{ color, fontWeight: "bold", textAlign: "start" }}
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
            flex: 0.8,
            renderCell: (params: any) => {
                const status = params.row.status;
                return (
                    <>
                        <Tooltip title="View">
                            <IconButton
                                color="info"
                                onClick={() => {
                                    setSelectedInquiry(params.row);
                                    setIsViewDialogOpen(true);
                                }}
                            >
                                <Visibility />
                            </IconButton>
                        </Tooltip>
                        {status !== "Approved" && status !== "Rejected" && (
                            <>
                                <Tooltip title="Approve">
                                    <IconButton color="success" onClick={() => handleApproveClick(params.row.id)}>
                                        <CheckCircle />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Inprogress/Pending">
                                    <IconButton
                                        onClick={() => handleInProgressClick(params.row.id)}
                                        sx={{
                                            color:
                                                params.row.status === "Pending"
                                                    ? "#ffeb3b"
                                                    : params.row.status === "In Progress"
                                                        ? "#ffa726"
                                                        : "inherit",
                                        }}
                                    >
                                        <Pending />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Reject">
                                    <IconButton color="error" onClick={() => handleRejectClick(params.row.id)}>
                                        <Cancel />
                                    </IconButton>
                                </Tooltip>
                            </>
                        )}
                    </>
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
            default:
                return "";
        }
    };


    function CustomToolbar({ onButtonClick }: any) {
        return (
            <GridToolbarContainer>
                <GridToolbarColumnsButton />
            </GridToolbarContainer>
        );
    }

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
                                                toolbar: () => <CustomToolbar />,
                                            }}
                                        />
                                    </Box>
                                </Container>
                            </DashboardCard>
                        </Grid>
                    </Grid>
                </Box>
            </PageContainer>

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
                                const currentStatus = selectedInquiryItem?.status || '';
                                updateInquiryStatus(actionType, selectedInquiryId, currentStatus);
                            }
                            setIsDialogOpen(false);
                        }}
                        color="primary"
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isViewDialogOpen} onClose={() => setIsViewDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Inquiry Details</DialogTitle>
                <DialogContent>
                    {selectedInquiry && (
                        <>
                            <Box display="flex" justifyContent="center" mb={2}>
                                <Avatar
                                    src={selectedInquiry?.profileImageURL || '/images/profile/user-1.jpg'}
                                    alt="User"
                                    sx={{ width: 150, height: 150 }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = '/images/profile/user-1.jpg';
                                    }}
                                />
                            </Box>
                            <Divider sx={{ marginBottom: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    {Object.keys(selectedInquiry).filter(key => key !== 'profileImageURL').map((key, index) => {
                                        if (index % 2 === 0) {
                                            return (
                                                <Typography
                                                    variant="body1"
                                                    key={key}
                                                    sx={{ marginLeft: 2, marginBottom: 2 }}
                                                >
                                                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                                                    <span
                                                        style={{
                                                            color:
                                                                key === "status"
                                                                    ? selectedInquiry[key] === "Pending"
                                                                        ? theme.palette.warning.main
                                                                        : selectedInquiry[key] === "In Progress"
                                                                            ? theme.palette.info.main
                                                                            : selectedInquiry[key] === "Approved"
                                                                                ? theme.palette.success.main
                                                                                : selectedInquiry[key] === "Rejected"
                                                                                    ? theme.palette.error.main
                                                                                    : "inherit"
                                                                    : "inherit",
                                                            fontWeight: key === "status" ? "bold" : "normal",
                                                        }}
                                                    >
                                                        {selectedInquiry[key] || "N/A"}
                                                    </span>
                                                </Typography>
                                            );
                                        }
                                        return null;
                                    })}
                                </Grid>
                                <Grid item xs={6}>
                                    {Object.keys(selectedInquiry).filter(key => key !== 'profileImageURL').map((key, index) => {
                                        if (index % 2 !== 0) {
                                            return (
                                                <Typography
                                                    variant="body1"
                                                    key={key}
                                                    sx={{ marginBottom: 2 }}
                                                >
                                                    <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                                                    <span
                                                        style={{
                                                            color:
                                                                key === "status"
                                                                    ? selectedInquiry[key] === "Pending"
                                                                        ? theme.palette.warning.main
                                                                        : selectedInquiry[key] === "In Progress"
                                                                            ? theme.palette.info.main
                                                                            : selectedInquiry[key] === "Approved"
                                                                                ? theme.palette.success.main
                                                                                : selectedInquiry[key] === "Rejected"
                                                                                    ? theme.palette.error.main
                                                                                    : "inherit"
                                                                    : "inherit",
                                                            fontWeight: key === "status" ? "bold" : "normal",
                                                        }}
                                                    >
                                                        {selectedInquiry[key] || "N/A"}
                                                    </span>
                                                </Typography>
                                            );
                                        }
                                        return null;
                                    })}
                                </Grid>
                            </Grid>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsViewDialogOpen(false)} color="secondary">
                        Close
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

        </>
    );
};
export default InquiryPage;


