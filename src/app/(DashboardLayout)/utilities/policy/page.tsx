"use client";
import {
  Grid,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Typography,
  MenuItem,
  Select,
  CircularProgress,
  InputLabel,
  FormControl,
  Popover,
  IconButton,
  FormHelperText,
  Container,
  Alert,
  Divider,
  Snackbar,
  Tooltip
} from "@mui/material";
import axios from "axios";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { useEffect, useState } from "react";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import EditIcon from "@mui/icons-material/Edit";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import GridOnIcon from '@mui/icons-material/GridOn';
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import VisibilityIcon from '@mui/icons-material/Visibility';
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardCard from "../../components/shared/DashboardCard";
import { DataGrid, GridToolbar, GridToolbarColumnsButton, GridToolbarContainer } from "@mui/x-data-grid";
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";
// import PolicyDialog from "../../components/AI/AIAssistantPolicyDialog"
import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { formatDateTime } from "@/utils/utils";

const durations = [
  { value: "6 Months" },
  { value: "12 Months" },
  { value: "18 Months" },
  { value: "24 Months" },
  { value: "30 Months" },
  { value: "36 Months" }
];

const Policy = () => {
  const [Policies, setPolicies] = useState<any>(null);
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const [selectedId, setSelectedId] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [policyType, setPolicyType] = useState<string | null>(null);
  const [others, setOthers] = useState<{ value: string } | null>(null);
  const [openAddPolicyDialog, setOpenAddPolicyDialog] = useState(false);
  const [openDeletePolicyDialog, setOpenDeletePolicyDialog] =
    useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [policyTypeError, setPolicyTypeError] = useState("");
  const [preferredCallTime, setPreferredCallTime] = useState<Date | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [fromTime, setFromTime] = useState<any>(null);
  const [toTime, setToTime] = useState<any>(null);
  const [amountError, setAmountError] = useState("");
  const [toTimeError, setToTimeError] = useState("");
  const [durationError, setDurationError] = useState("");
  const [callTimeError, setCallTimeError] = useState("");
  const [othersError, setOthersError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [policyUpdated, setPolicyUpdated] = useState(false);
  const [policyOptions, setPolicyOptions] = useState([]);
  const [policyErrorMessage, setPolicyErrorMessage] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const handleOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
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

  const getUser = () => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem('user');
      return user;
    }
  }
  const user = getUser();
  const userObj = user ? JSON.parse(user) : null;
  console.log(userObj?.firstName);
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
      if (roleId !== 3) {
        localStorage.clear();
        router.push("/authentication/login");
      }
    } else {
      localStorage.clear();
      router.push("/authentication/login");
    }
  }, [router, token]);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const displayTimeRange =
    fromTime && toTime
      ? `${dayjs(fromTime).format("hh:mm A")} - ${dayjs(toTime).format(
        "hh:mm A"
      )}`
      : "Select time";

  const handleCloseAddPolicyDialog = () => {
    setAmountError("");
    setAmount("");
    setPolicyType(null);
    setOthers(null);
    setDate("");
    setFromTime(null);
    setToTime(null);
    setOpenAddPolicyDialog(false);
    setComment("");
    setPolicyTypeError("");

    setDurationError("");

    setCallTimeError("");

    setOpenAddPolicyDialog(false);

    setPolicyType(null);

    setPolicyTypeError("");
  };
  const fetchAllPolicyData = async () => {
    if (!token) {
      localStorage.clear();
      router.push("/authentication/login");
    }
    if (token) {
      const decoded: any = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
        router.push("/authentication/login");
      }
    }
    setLoading(true)
    try {
      const response = await axios.get(`${BASE_URL}/serviceType/getServiceTypeByServiceId/${2}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        const formattedData = response.data.data.map((item: any) => ({
          id: item.id,
          type: item.serviceSubType,
          amount: item.amount,
          duration: item.duration,
          fromTime: item.fromTime,
          toTime: item.toTime,
          status: item.status,
          comment: item.comment,
        }));

        setPolicies(formattedData);
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchAllPolicyData();
  }, [policyUpdated, token]);

  const fetchPolicyOptions = async () => {
    if (!token) {
      localStorage.clear();
      router.push("/authentication/login");
    }
    if (token) {
      const decoded: any = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
        router.push("/authentication/login");
      }
    }
    try {
      setLoading(true)
      const response = await axios.get(
        `${BASE_URL}/serviceSubType/getServiceSubTypeByServiceId/${2}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data.result) {
        const options = response.data.result.map((item: any) => ({
          id: item.id,
          label: item.ledgerType,
        }));
        setPolicyOptions(options);
        setLoading(false)
      } else {
        setLoading(false)
        console.error("Failed to fetch Policy options:", response.data);
      }
    } catch (error) {
      setLoading(false)
      console.error("Error fetching Policy options:", error);
    }
  };
  useEffect(() => {
    fetchPolicyOptions();
  }, [token]);

  const addPolicy = async () => {
    if (!token) {
      localStorage.clear();
      router.push("/authentication/login");
    }
    if (token) {
      const decoded: any = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
        router.push("/authentication/login");
      }
    }
    if (!amount.trim()) {
      setAmountError("Policy amount is required.");
      return;
    }

    setAmountError("");
    const formattedFromTime = fromTime ? fromTime.format("hh:mm ss") : "";

    const formattedToTime = toTime ? toTime.format("hh:mm ss") : "";

    const newPolicy = {
      id: Policies,
      type: policyType || "",
      amount,
      date,
      duration: others,
      fromTime: formattedFromTime,
      toTime: formattedToTime,
      status: "Pending",
      comment
    };

    const policyPayload = {
      amount: newPolicy.amount,
      serviceSubType: newPolicy.type,
      duration: newPolicy.duration?.value,
      status: "Pending",
      comment: newPolicy.comment,
      fromTime: newPolicy.fromTime,
      toTime: newPolicy.toTime,
      serviceId: 2,
    };
    try {
      setPolicyErrorMessage(false);
      setLoading(true)
      const response = await axios.post(
        `${BASE_URL}/serviceType/createServiceType`,
        policyPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 201) {
        setSnackbarOpen(true);
        setSnackbarMessage(response.data.notification.message)
        setPolicies(response.data.data);
        setPolicyUpdated(prev => !prev);
        handleCloseAddPolicyDialog();
        setLoading(false)
      } else {
        setLoading(false)
        setPolicyErrorMessage(response.data.message)
        console.error("API error:", response.data);
      }
    } catch (error: any) {
      setLoading(false)
      setPolicyErrorMessage(error.response.data.message)
      console.error("Error during Policy creation:", error);
      if (error.response) {
        setLoading(false)
        setPolicyErrorMessage(error.response.data.message)
        console.error("API Error Response:", error.response.data.message);
      } else if (error.request) {
        setLoading(false)
        setPolicyErrorMessage(error.response.data.message)
        console.error("No response from server.");
      } else {
        setLoading(false)
        setPolicyErrorMessage(error.response.data.message)
        console.error("Unexpected error:", error.message);
      }
    }
  };
  const editPolicy = async () => {
    if (!token) {
      localStorage.clear();
      router.push("/authentication/login");
    }
    if (token) {
      const decoded: any = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
        router.push("/authentication/login");
      }
    }
    if (!amount.trim()) {
      setAmountError("Policy amount is required.");
      return;
    }
    setAmountError("");
    try {
      const UpdatePolicyPayload = {
        amount,
        comment,
        fromTime: fromTime ? dayjs(fromTime).format("hh:mm A") : null,
        toTime: toTime ? dayjs(toTime).format("hh:mm A") : null,
        duration: others?.value,
        type: policyType,
        status: status || "Pending",
      };
      setPolicyErrorMessage(false)
      setLoading(true)
      const response = await axios.put(
        `${BASE_URL}/serviceType/updateServiceTypeById/${selectedId}`,
        UpdatePolicyPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.status) {
        handleCloseAddPolicyDialog();
        fetchAllPolicyData();
        setPolicyUpdated(prev => !prev);
        setLoading(false)
      } else {
        setLoading(false)
        setPolicyErrorMessage(response.data.message)
        console.error("Update failed:", response.data.message);
      }
    } catch (error: any) {
      setLoading(false)
      setPolicyErrorMessage(error.response.data.message)
      console.error("Error updating Policy:", error);
    }
  };
  const deletePolicy = async () => {
    if (!token) {
      localStorage.clear();
      router.push("/authentication/login");
    }
    if (token) {
      const decoded: any = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
        router.push("/authentication/login");
      }
    }
    if (!selectedId) {
      console.error("No Policy selected for deletion.");
      return;
    }
    setPolicyErrorMessage(false)
    setDialogLoading(true)
    try {
      await axios.delete(`${BASE_URL}/serviceType/deleteServiceTypeById/${selectedId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPolicyUpdated(prev => !prev);
      setPolicies((prevAllPolicy: any[]) => {
        const updatedAllPolicy = prevAllPolicy
          .filter((Policy) => Policy.id !== selectedId)
          .map((Policy, index) => ({
            ...Policy,
          }));

        return updatedAllPolicy;
      });
      setDialogLoading(false)
      console.log(`Policy with ID ${selectedId} deleted successfully.`);
    } catch (error: any) {
      setDialogLoading(false)
      setPolicyErrorMessage(error.response.data.message)
      console.error("Error deleting Policy:", error);
    }

    setOpenDeletePolicyDialog(false);
  };
  const [comment, setComment] = useState("");
  const handleCommentChange = (event: any) => {
    const newComment = event.target.value;
    setComment(newComment);

  };

  const validateAmount = () => {
    if (!amount.trim()) {
      setAmountError("Policy amount is required.");
    } else if (!/^\d+$/.test(amount)) {
      setAmountError("Only numeric values are allowed.");
    } else {
      setAmountError("");
    }
  };

  const validatePolicyType = () => {
    if (!policyType) {
      setPolicyTypeError("Policy type is required.");
    } else {
      setPolicyTypeError("");
    }
  };

  const validateOthers = () => {
    if (!others) {
      setDurationError("Duration of Policy is required.");
    } else {
      setDurationError("");
    }
  };

  const validateCallTime = () => {
    if (!fromTime || !toTime) {
      setCallTimeError("Both from and to time are required.");
      return false;
    } else if (dayjs(toTime).isBefore(dayjs(fromTime))) {
      setCallTimeError("The 'to' time cannot be before the 'from' time.");
      setToTimeError("The 'to' time cannot be before the 'from' time.");
      return false;
    } else {
      setCallTimeError("");
      setToTimeError("");
    }
    return true;
  };

  const validateForm = () => {
    let isValid = true;

    if (!amount.trim()) {
      setAmountError("Policy amount is required");
      isValid = false;
    }

    if (!policyType) {
      setPolicyTypeError("Policy type is required");
      isValid = false;
    }

    if (!others) {
      setDurationError("Duration of Policy is required");
      isValid = false;
    }

    if (!fromTime || !toTime) {
      setCallTimeError("Preferable call time is required");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = () => {
    const isValid = validateCallTime();
    if (!isValid) return;
    if (!validateForm()) return;
    if (isEdit) {
      editPolicy();
    } else {
      addPolicy();
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
  const handleViewButton = (row: any) => {
    setSelectedRow(row);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedRow(null);
  };
  const columns = [
    { field: "id", headerName: "ID", flex: 0.12 },
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
            color = "#fbf774";
            break;
          case "In Progress":
            color = "#fbe06f";
            break;
          case "Approved":
            color = "#8df1b4";
            break;
          case "Rejected":
            color = "#ff8780";
            break;
          default:
            color = "#fbf774";
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
              sx={{ color, textAlign: "center" }}
            >
              {status}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      minWidth: 100,
      flex: 0,
      renderCell: (params: any) => {
        const status = params.row.status;
        const isEditDeleteHidden = status === "Approved" || status === "Rejected" || status === "In Progress";

        return (
          <Box display="flex" width="100%" height="100%" >
            <Tooltip title="Edit">
              <IconButton
                color="info"
                size="small"
                onClick={() => handleViewButton(params.row)}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            {!isEditDeleteHidden && (
              <>
                <Tooltip title="Edit">
                  <IconButton
                    color="primary"
                    size="small"
                    onClick={() => handleEditButton(params.row)}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    size="small"
                    onClick={() => handleDeleteButton(params.row.id)}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </>
            )}

          </Box>
        );
      },
    }
  ];
  const handleEditButton = (formDataPolicy: any) => {
    setIsEdit(true);
    setSelectedId(formDataPolicy.id);
    setAmount(formDataPolicy.amount);
    setComment(formDataPolicy.comment);
    setFromTime(formDataPolicy.fromTime ? dayjs(formDataPolicy.fromTime.trim(), "hh:mm ss") : null);
    setToTime(formDataPolicy.toTime ? dayjs(formDataPolicy.toTime.trim(), "hh:mm ss") : null);
    const selectedDuration = durations.find((d: any) => d.value === formDataPolicy.duration) || null;
    setOthers(selectedDuration);
    setOpenAddPolicyDialog(true);
    setPolicyType(formDataPolicy.type);

  };

  const handleDeleteButton = (id: any) => {
    setSelectedId(id);
    setOpenDeletePolicyDialog(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  }
  const handleConfirmYes = () => {
    setIsEdit(false);
    setOpenAddPolicyDialog(true);
  };

  let getStatusColor = (status: any) => {
    switch (status) {
      case "Pending":
        return "#fbf774";
      case "In Progress":
        return "#fbe06f";
      case "Approved":
        return "#8df1b4";
      case "Rejected":
        return "#ff8780";
      default:
        return "#fbf774";
    }
  };

  const exportToPDF = async () => {
    const doc = new jsPDF();

    doc.setFontSize(12);
    doc.text("POLICY LIST", 14, 30);
    const logoWidth = 40;
    const logoHeight = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoX = (pageWidth - logoWidth) / 2;
    const dataTime = formatDateTime(new Date())
    doc.addImage('/images/logos/logo.png', "PNG", logoX, 7, logoWidth, logoHeight);
    doc.setFontSize(12);
    doc.text(dataTime, pageWidth - 14, 30, { align: "right" });
    doc.setFontSize(12);
    doc.text(`Name: ${userName}`, 14, 40);
    autoTable(doc, {
      startY: 50,
      head: [
        ["ID", "Type", "Amount", "Duration", "From Time", "To Time", "Status", "Comment"]
      ],
      body: (Policies || []).map((row: any) => [
        row.id,
        row.type,
        row.amount,
        row.duration,
        row.fromTime,
        row.toTime,
        row.status,
        row.comment,
      ]),
      headStyles: {
        fillColor: [165, 42, 42],
        textColor: 255,
        halign: "center",
        fontStyle: "bold",
        fontSize: 10
      },
      bodyStyles: {
        halign: "center",
      },
    });

    const pdfBlob = doc.output("blob");
    const fileURL = URL.createObjectURL(pdfBlob);
    window.open(fileURL);
    doc.save("AllPolicyData.pdf");
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(Policies || []);

    const headerKeys = Object.keys(Policies || {});
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Loans List");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileURL = URL.createObjectURL(blob);
    saveAs(blob, "Policies.xlsx");
  };

  return (
    <>
      {loading && (
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
      <PageContainer title="Policy" description="this is Policy page">
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                {/* <PolicyDialog onConfirmYes={handleConfirmYes} /> */}
                <Tooltip title="Add">
                  <IconButton
                    sx={{ textTransform: "none", color: "#44a7a2" }}
                    onClick={() => setOpenAddPolicyDialog(true)}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Export Excel'>
                  <IconButton onClick={exportToExcel} sx={{ color: "#44a7a2" }}>
                    <GridOnIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Export PDF'>
                  <IconButton onClick={exportToPDF} sx={{ color: "#44a7a2" }}>
                    <PictureAsPdfIcon />
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
                    <Typography variant="h4">Policy</Typography>
                  </Grid>
                  <Box sx={{ flexGrow: 1, width: "100%", height: "auto", minHeight: "60vh", display: "flex" }}>
                    <DataGrid
                      rows={Policies || []}
                      columns={columns.map((col) => ({ ...col, flex: 1, editable: false }))}
                      pageSizeOptions={[5, 10, 20, 50, 100]}
                      paginationModel={pagination}
                      onPaginationModelChange={setPagination}
                      disableRowSelectionOnClick
                      autoHeight
                      sortModel={[{ field: "id", sort: "desc" }]}
                      slots={{
                        toolbar: GridToolbar,
                      }}
                      slotProps={{
                        toolbar: {
                          showQuickFilter: true,
                          quickFilterProps: { debounceMs: 500 },
                          sx: {
                            backgroundColor: "#f5f5f5",
                            borderRadius: "4px",
                            padding: "8px",
                            '& .MuiButton-text': {
                              color: '#44a7a2',
                            },
                          },
                        },
                      }}
                    />
                  </Box>
                </Container>
              </DashboardCard>
            </Grid>
          </Grid>
        </Box>
        <Dialog
          open={openAddPolicyDialog}
          onClose={handleCloseAddPolicyDialog}
          maxWidth="sm"
          fullWidth
        >
          {loading && (
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
          <DialogTitle>
            <Typography variant="h3" component="h2">
              {isEdit ? "Edit policy" : "Add policy"}
            </Typography>
          </DialogTitle>
          {policyErrorMessage && (
            <Grid item>
              <Box sx={{
                border: 1,
                borderColor: '#ff9999',
                p: 0,
                m: 2,
                backgroundColor: '#f8bbd0'
              }}>
                <Alert severity="error">{policyErrorMessage}</Alert>
              </Box>
            </Grid>
          )}
          <Divider></Divider>
          <DialogContent sx={{ overflow: "visible", minHeight: "120px" }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label={
                    <span>
                      Policy amount <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={amount}
                  error={!!amountError}
                  helperText={amountError}
                  onChange={(e) => {
                    const value = e.target.value;
                    const isValid = /^\d*\.?\d*$/.test(value);

                    if (isValid && value.length <= 8) {
                      setAmount(value);
                      if (value.trim()) {
                        setAmountError("");
                      }
                    }
                  }}
                  onBlur={validateAmount}
                  inputProps={{
                    inputMode: "decimal",
                    pattern: "[0-9.]*",
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Autocomplete
                  options={policyOptions}
                  getOptionLabel={(option: any) => option.label || ""}
                  value={policyOptions.find((opt: any) => opt.label === policyType) || null}
                  onChange={(_, newValue: any) => {
                    setPolicyType(newValue ? newValue.label : null);
                    setPolicyTypeError("");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <span>
                          Policy type <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      variant="outlined"
                      error={!!policyTypeError}
                      helperText={policyTypeError}
                    />
                  )}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!durationError}>
                  <Autocomplete
                    options={durations}
                    getOptionLabel={(option) => (option && option.value ? option.value : "")}
                    isOptionEqualToValue={(option, value) => option?.value === value?.value}
                    value={others}
                    onChange={(event, newValue: any) => {
                      setOthers(newValue);
                      setDurationError("");
                    }}
                    onBlur={validateOthers}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label=
                        {
                          <span>
                            Duration of Policy{" "}
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        variant="outlined"
                        fullWidth
                        error={!!durationError}
                        helperText={durationError}
                      />
                    )}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TextField

                    label={
                      <span>
                        Preferable call time <span style={{ color: "red" }}>*</span>
                      </span>
                    }
                    value={displayTimeRange}
                    onClick={handleOpen}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    error={!!callTimeError}
                    helperText={callTimeError}
                    onBlur={() => {
                      setTimeout(() => {
                        if (!fromTime || !toTime) validateCallTime();
                      }, 10);
                    }}
                  />
                  <Popover
                    open={Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={() => {
                      handleClose();
                      if (fromTime && toTime) {
                        setCallTimeError("");
                        setToTimeError("");
                      } else {
                        validateCallTime();
                      }
                    }}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  >
                    <Dialog open={Boolean(anchorEl)} onClose={handleClose}>
                      <DialogTitle>Select time</DialogTitle>
                      <DialogContent sx={{ overflow: "visible" }}>

                        <Grid container spacing={2}>
                          <Grid item xs={6}>
                            <TimePicker
                              label="From"
                              value={fromTime}
                              onChange={(timeValue) => {
                                setFromTime(timeValue);
                                setCallTimeError("");
                              }}

                              slotProps={{
                                textField: { fullWidth: true, variant: "outlined", sx: { overflow: "visible", height: "auto" } },
                              }}
                            />
                          </Grid>
                          <Grid item xs={6}>
                            <TimePicker
                              label="To"
                              value={toTime}
                              onChange={(timeValue) => {
                                if (!fromTime || !timeValue) {
                                  setToTime(timeValue);
                                  setToTimeError("");
                                  return;
                                }

                                const from = dayjs(fromTime);
                                const to = dayjs(timeValue);
                                if (to.isBefore(from.add(5, "minute"))) {
                                  setToTimeError("The 'to' time cannot be before the 'from' time.");
                                } else {
                                  setToTime(timeValue);
                                  setToTimeError("");
                                  setCallTimeError("");
                                }
                              }}

                              slotProps={{
                                textField: {
                                  fullWidth: true, variant: "outlined", sx: { overflow: "visible", height: "auto" },
                                  error: !!toTimeError,
                                  helperText: toTimeError,
                                },
                              }}
                            />
                          </Grid>
                        </Grid>
                      </DialogContent>
                    </Dialog>
                  </Popover>
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Comment"
                  placeholder="Enter your comments (Max 300 words)"
                  multiline
                  rows={4}
                  fullWidth
                  variant="outlined"
                  inputProps={{ maxLength: 300 }}
                  value={comment}
                  onChange={handleCommentChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleCloseAddPolicyDialog}>
              Close
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              {isEdit ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delet button */}

        <Dialog
          open={openDeletePolicyDialog}
          onClose={() => setOpenDeletePolicyDialog(false)}
          maxWidth="xs"
          fullWidth
        >
          {dialogLoading && (
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
          <DialogTitle>Delete policy</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete ?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenDeletePolicyDialog(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={deletePolicy}
              variant="contained"
              color="primary"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </PageContainer>
      <Dialog open={openViewDialog} onClose={handleCloseViewDialog} fullWidth maxWidth="xs">
        <DialogTitle>Policy Details</DialogTitle>
        <DialogContent dividers>
          <Grid container>
            {selectedRow &&
              Object.entries(selectedRow).map(([key, value]) => {
                const isStatus = key.toLowerCase() === "status";
                const statusColor = isStatus ? getStatusColor(value) : undefined;

                return (
                  <React.Fragment key={key}>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <Box component="span" sx={{ fontWeight: 'bold' }}>
                          {key}:
                        </Box>{' '}
                        <Box
                          component="span"
                          sx={{
                            fontWeight: 'normal',
                            color: isStatus ? statusColor : 'inherit',
                          }}
                        >
                          {String(value)}
                        </Box>
                      </Typography>
                    </Grid>
                  </React.Fragment>
                );
              })}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
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
            backgroundColor: "green",
            color: "white",
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Policy;

