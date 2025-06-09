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
  FormControl,
  Popover,
  IconButton,
  FormHelperText,
  Container,
  Alert,
  Divider,
  Snackbar,
  Tooltip,
  CircularProgress
} from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { SetStateAction, useEffect, useState } from "react";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from "@mui/icons-material/Edit";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer } from "@mui/x-data-grid";
import DashboardCard from "../../components/shared/DashboardCard";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
//import InsuranceDialogDialog from '../AI/aiAssistantInsurance/page';
import React from "react";

const durations = [
  { value: "6 Months" },
  { value: "12 Months" },
  { value: "18 Months" },
  { value: "24 Months" },
  { value: "30 Months" },
  { value: "36 Months" }
];
const Insurance = () => {
  const [insurances, setInsurances] = useState<any>(null);

  const [selectedId, setSelectedId] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [insuranceType, setInsuranceType] = useState<string | null>(null);
  const [others, setOthers] = useState<{ value: string } | null>(null);
  const [openAddInsuranceDialog, setOpenAddInsuranceDialog] = useState(false);
  const [openDeleteInsuranceDialog, setOpenDeleteInsuranceDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [preferredCallTime, setPreferredCallTime] = useState<Date | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [fromTime, setFromTime] = useState<any>(null);
  const [toTime, setToTime] = useState<any>(null);
  const [amountError, setAmountError] = useState("");
  const [toTimeError, setToTimeError] = useState("");
  const [insuranceTypeError, setInsuranceTypeError] = useState("");
  const [durationError, setDurationError] = useState("");
  const [callTimeError, setCallTimeError] = useState("");
  const [othersError, setOthersError] = useState("");
  const router = useRouter();
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [insuranceUpdated, setInsuranceUpdated] = useState(false);
  const [insuranceOptions, setInsuranceOptions] = useState([]);
  const [insuranceErrorMessage, setInsuranceErrorMessage] = useState(false);
  const [openAddInsurancementDialog, setOpenAddInsurancetDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const handleOpen = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const displayTimeRange =
    fromTime && toTime
      ? `${dayjs(fromTime).format("hh:mm A")} - ${dayjs(toTime).format(
        "hh:mm A"
      )}`
      : "Select time";

  const handleCloseAddInsuranceDialog = () => {
    setAmount("");
    setOthers(null);
    setDate("");
    setFromTime(null);
    setToTime(null);
    setComment("");
    setAmountError("");
    setInsuranceTypeError("");
    setDurationError("");
    setCallTimeError("");
    setOpenAddInsuranceDialog(false);
    setInsuranceType(null);
    setInsuranceTypeError("");
    setInsuranceErrorMessage(false);
  };

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
  }, [router, token]);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const fetchInsurancesData = async () => {
    setInsuranceErrorMessage(false);
    setLoading(true)
    try {
      const response = await axios.get(`${BASE_URL}/serviceType/getServiceTypeByServiceId/${3}`, {
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

        setInsurances(formattedData);
        setLoading(false)
      }
    } catch (error: any) {
      setLoading(false)
    }
  };
  useEffect(() => {
    fetchInsurancesData();
  }, [insuranceUpdated, token]);

  const fetchInsuranceOptions = async () => {
    try {
      if (token) {
        const decoded: any = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.clear();
          router.push("/authentication/login");
        }
      }
      setInsuranceTypeError("")
      setInsuranceErrorMessage(false);
      setLoading(true)
      const response = await axios.get(
        `${BASE_URL}/serviceSubType/getServiceSubTypeByServiceId/${3}`,
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
        setInsuranceOptions(options);
        setLoading(false)
      } else {
        setLoading(false)
        console.error("Failed to fetch  insurance options:", response.data);
      }
    } catch (error) {
      setLoading(false)
      console.error("Error fetching  insurance options:", error);
    }
  };
  useEffect(() => {
    fetchInsuranceOptions();
  }, [insuranceUpdated, token]);
  const addInsurance = async () => {
    if (!token) {
      localStorage.clear();
      router.push("/authentication/login");
    }
    if (!amount.trim()) {
      setAmountError("Insurance amount is required.");
      return;
    }

    setAmountError("");
    const formattedFromTime = fromTime ? fromTime.format("hh:mm ss") : "";

    const formattedToTime = toTime ? toTime.format("hh:mm ss") : "";

    const newInsurance = {
      id: insurances,
      type: insuranceType || "",
      amount,
      date,
      duration: others,
      fromTime: formattedFromTime,
      toTime: formattedToTime,
      status: "Pending",
      comment,
    };
    const insurancePayload = {
      amount: Number(newInsurance.amount),
      serviceSubType: newInsurance.type,
      duration: newInsurance.duration?.value || newInsurance.duration,
      status: "Pending",
      comment: newInsurance.comment,
      fromTime: newInsurance.fromTime,
      toTime: newInsurance.toTime,
      serviceId: 3,
    };
    try {
      if (token) {
        const decoded: any = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.clear();
          router.push("/authentication/login");
        }
      }
      setInsuranceErrorMessage(false)
      setLoading(true)
      const response = await axios.post(
        `${BASE_URL}/serviceType/createServiceType`,
        insurancePayload,
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
        setInsurances(response.data.data);
        setInsuranceUpdated(prev => !prev);
        handleCloseAddInsuranceDialog();
        setLoading(false)
      } else {
        setLoading(false)
        setInsuranceErrorMessage(response.data.message)
        console.error("API error:", response.data);
      }
    } catch (error: any) {
      setLoading(false)
      setInsuranceErrorMessage(error.response.data.message)
      console.error("Error during voucher deletion:", error);
      if (error.response) {
        setLoading(false)
        setInsuranceErrorMessage(error.response.data.message)
        console.error("API Error Response:", error.response.data.message);
      } else if (error.request) {
        setLoading(false)
        setInsuranceErrorMessage(error.response.data.message)
        console.error("No response from server.");
      } else {
        setLoading(false)
        setInsuranceErrorMessage(error.response.data.message)
        console.error("Unexpected error:", error.message);
      }
    }
  };

  const editInsurance = async () => {
    try {
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
      const UpdateInsurancePayload = {
        amount,
        comment,
        fromTime: fromTime ? dayjs(fromTime).format("hh:mm ss") : null,
        toTime: toTime ? dayjs(toTime).format("hh:mm ss") : null,
        duration: others?.value,
        type: insuranceType,
        status: status || "Pending",
      };
      setInsuranceErrorMessage(false)
      setLoading(true)
      const response = await axios.put(
        `http://localhost:4000/serviceType/updateServiceTypeById/${selectedId}`,
        UpdateInsurancePayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        setOpenAddInsuranceDialog(false);
        fetchInsurancesData();
        setInsuranceUpdated(prev => !prev);
        setLoading(false)
      } else {
        setLoading(false)
        console.error("Update failed:", response.data.message);
      }
    } catch (error: any) {
      setLoading(false)
      setInsuranceErrorMessage(error.response.data.message)
      console.error("Error during voucher deletion:", error);
      if (error.response) {
        setLoading(false)
        setInsuranceErrorMessage(error.response.data.message)
        console.error("API Error Response:", error.response.data.message);
      } else if (error.request) {
        setLoading(false)
        setInsuranceErrorMessage(error.response.data.message)
        console.error("No response from server.");
      } else {
        setLoading(false)
        setInsuranceErrorMessage(error.response.data.message)
        console.error("Unexpected error:", error.message);
      }
    }
  };

  const deleteInsurance = async () => {
    if (!token) {
      return
    }
    if (!selectedId) {
      console.error("No  insurance selected for deletion.");
      return;
    }
    setInsuranceErrorMessage(false)
    setLoading(true)
    try {
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
      await axios.delete(`${BASE_URL}/serviceType/deleteServiceTypeById/${selectedId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInsuranceUpdated(prev => !prev);
      setInsurances((prevAllInsurance: any[]) => {
        const updatedAllInsurance = prevAllInsurance
          .filter((insurance) => insurance.id !== selectedId)
          .map((insurance, index) => ({
            ...insurance,
          }));

        return updatedAllInsurance;
      });
      setLoading(false)
      console.log(`Insurance with ID ${selectedId} deleted successfully.`);
    } catch (error: any) {
      setLoading(false)
      setInsuranceErrorMessage(error.response.data.message)
      console.error("Error during voucher deletion:", error);
      if (error.response) {
        setLoading(false)
        setInsuranceErrorMessage(error.response.data.message)
        console.error("API Error Response:", error.response.data.message);
      } else if (error.request) {
        setLoading(false)
        setInsuranceErrorMessage(error.response.data.message)
        console.error("No response from server.");
      } else {
        setLoading(false)
        setInsuranceErrorMessage(error.response.data.message)
        console.error("Unexpected error:", error.message);
      }
    }

    setOpenDeleteInsuranceDialog(false);
  };

  const [comment, setComment] = useState("");

  const handleCommentChange = (event: any) => {
    const newComment = event.target.value;
    setComment(newComment);
  };

  const validateAmount = () => {
    if (!amount.trim()) {
      setAmountError(" insurance amount is required.");
    } else if (!/^\d+$/.test(amount)) {
      setAmountError("Only numeric values are allowed.");
    } else {
      setAmountError("");
    }
  };

  const validateInsuranceType = () => {
    if (!insuranceType) {
      setInsuranceTypeError("Insurance type is required.");
    } else {
      setInsuranceTypeError("");
    }
  };

  const validateOthers = () => {
    if (!others) {
      setDurationError("Duration of insurance is required.");
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
      setAmountError("Insurance amount is required");
      isValid = false;
    }

    if (!insuranceType) {
      setInsuranceTypeError("Insurance type is required");
      isValid = false;
    }

    if (!others) {
      setDurationError("Duration of  insurance is required");
      isValid = false;
    }

    if (!fromTime || !toTime) {
      setCallTimeError("Preferable call time is required");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = () => {
    setInsuranceErrorMessage(false);
    const isValid = validateCallTime();

    if (!isValid) return;

    if (!validateForm()) return;

    if (isEdit) {
      editInsurance();
    } else {
      addInsurance();
    }
  };
  const handleViewButton = (row: any) => {
    setSelectedRow(row);
    setOpenViewDialog(true);
  };

  const handleCloseViewDialog = () => {
    setOpenViewDialog(false);
    setSelectedRow(null);
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
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Typography
              variant="body1"
              sx={{ color, fontWeight: "bold", textAlign: "center" }}
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
      flex: 0.12,
      renderCell: (params: any) => {
        const status = params.row.status;
        const isEditDeleteHidden = status === "Approved" || status === "Rejected";

        return (
          <Box display="flex" width="100%" gap={1}>
            <Tooltip title="View">
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

  const handleEditButton = (formDataInsurance: any) => {
    setIsEdit(true);
    setSelectedId(formDataInsurance.id);
    setAmount(formDataInsurance.amount);
    setComment(formDataInsurance.comment);
    setFromTime(
      formDataInsurance.fromTime ? dayjs(formDataInsurance.fromTime, "HH:mm:ss") : null
    );
    setToTime(
      formDataInsurance.toTime ? dayjs(formDataInsurance.toTime, "HH:mm:ss") : null
    );
    const selectedDuration = durations.find((d: any) => d.value === formDataInsurance.duration) || null;
    setOthers(selectedDuration);
    setOpenAddInsuranceDialog(true);
    setInsuranceType(formDataInsurance.type);
  };

  const handleDeleteButton = (id: any) => {
    setSelectedId(id);
    setOpenDeleteInsuranceDialog(true);
  };

  function CustomToolbar({ onButtonClick }: any) {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
      </GridToolbarContainer>
    );
  }
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  }
  const handleConfirmYes = () => {
    setIsEdit(false);
    setOpenAddInsuranceDialog(true)
  };

  let getStatusColor = (status: any) => {
    switch (status) {
      case "Pending":
        return "#ffeb3b";
      case "In Progress":
        return "#ffa726";
      case "Approved":
        return "#4caf50";
      case "Rejected":
        return "#ff5252";
      default:
        return "#ffeb3b";
    }
  };

  return (
    <>
      <PageContainer title="Insurance" description="this is insurance page">
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                {/* <InsuranceDialogDialog onConfirmYes={handleConfirmYes} /> */}
                <Button
                  variant="contained"
                  sx={{ textTransform: "none" }}
                  onClick={() => {
                    setIsEdit(false);
                    setOpenAddInsuranceDialog(true);
                  }}
                >
                  Add
                </Button>
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
                    <Typography variant="h4">Insurance</Typography>
                  </Grid>
                  <Box
                    sx={{ flexGrow: 1, width: "100%", height: "auto", minHeight: "60vh", display: "flex" }}
                  >
                    <DataGrid
                      rows={insurances}
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
        <Dialog
          open={openAddInsuranceDialog}
          onClose={handleCloseAddInsuranceDialog}
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
              {isEdit ? "Edit insurance" : "Add insurance"}
            </Typography>
          </DialogTitle>
          {insuranceErrorMessage && (
            <Grid item>
              <Box sx={{
                border: 1,
                borderColor: '#ff9999',
                p: 0,
                m: 2,
                backgroundColor: '#f8bbd0'
              }}>
                <Alert severity="error">{insuranceErrorMessage}</Alert>
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
                      Insurance amount <span style={{ color: "red" }}>*</span>
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
                  options={insuranceOptions}
                  getOptionLabel={(option: any) => option.label || ""}
                  value={insuranceOptions.find((opt: any) => opt.label === insuranceType) || null}
                  onChange={(_, newValue: any) => {
                    setInsuranceType(newValue ? newValue.label : null);
                    setInsuranceTypeError("");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <span>
                          Insurance type <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      variant="outlined"
                      error={!!insuranceTypeError}
                      helperText={insuranceTypeError}
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
                            Duration of insurance{" "}
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
                        Preferable call time{" "}
                        <span style={{ color: "red" }}>*</span>
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
                                textField: {
                                  fullWidth: true,
                                  variant: "outlined",
                                  sx: { overflow: "visible", height: "auto" },
                                },
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
                                  setToTimeError(
                                    "The 'to' time cannot be before the 'from' time."
                                  );

                                } else {
                                  setToTime(timeValue);
                                  setToTimeError("");
                                  setCallTimeError("");
                                }
                              }}
                              slotProps={{
                                textField: {
                                  fullWidth: true,
                                  variant: "outlined",
                                  sx: { overflow: "visible", height: "auto" },
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
            <Button variant="outlined" onClick={handleCloseAddInsuranceDialog}>
              Close
            </Button>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {isEdit ? "Update" : "Add"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delet button */}

        <Dialog
          open={openDeleteInsuranceDialog}
          onClose={() => setOpenDeleteInsuranceDialog(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Delete insurance</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete ?</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenDeleteInsuranceDialog(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button onClick={deleteInsurance} variant="contained" color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </PageContainer>
      <Dialog open={openViewDialog} onClose={handleCloseViewDialog} fullWidth maxWidth="xs">
        <DialogTitle>Insurance Details</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={0.1}>
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

export default Insurance;
