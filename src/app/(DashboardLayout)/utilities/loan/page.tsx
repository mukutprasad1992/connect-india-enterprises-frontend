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
  InputLabel,
  CircularProgress,
  FormControl,
  Popover,
  IconButton,
  FormHelperText,
  Container,
  Divider,
  Alert,
  Snackbar,
} from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { SetStateAction, useEffect, useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import EditIcon from "@mui/icons-material/Edit";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import DeleteIcon from "@mui/icons-material/Delete";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer } from "@mui/x-data-grid";

import DashboardCard from "../../components/shared/DashboardCard";
import { jwtDecode } from "jwt-decode";
//import LoanDialog from "../AI/aiSssistanceLoan/page"
import React from "react";

const durations = [
  { value: "6 Months" },
  { value: "12 Months" },
  { value: "18 Months" },
  { value: "24 Months" },
  { value: "30 Months" },
  { value: "36 Months" }
];

const Loan = () => {
  const [loans, setLoans] = useState<any>(null);


  const [selectedId, setSelectedId] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [loanType, setLoanType] = useState<string | null>(null);
  const [others, setOthers] = useState<{ value: string } | null>(null);
  const [openAddLoanDialog, setOpenAddLoanDialog] = useState(false);
  const [openDeleteLoanDialog, setOpenDeleteLoanDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [preferredCallTime, setPreferredCallTime] = useState<Date | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [fromTime, setFromTime] = useState<any>(null);
  const [toTime, setToTime] = useState<any>(null);
  const [amountError, setAmountError] = useState("");
  const [toTimeError, setToTimeError] = useState("");
  const [loanTypeError, setLoanTypeError] = useState("");
  const [durationError, setDurationError] = useState("");
  const [callTimeError, setCallTimeError] = useState("");
  const [othersError, setOthersError] = useState("");
  const [loanOptions, setLoanOptions] = useState([]);
  const router = useRouter();
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [loanErrorMessage, setLoanErrorMessage] = useState(false);
  const [loanUpdated, setLoanUpdated] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const handleOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const displayTimeRange =
    fromTime && toTime
      ? `${dayjs(fromTime).format("hh:mm A")} - ${dayjs(toTime).format(
        "hh:mm A"
      )}`
      : "Select time";

  const handleCloseAddLoanDialog = () => {
    setAmountError("");
    setAmount("");
    setLoanType(null);
    setOthers(null);
    setDate("");
    setFromTime(null);
    setToTime(null);
    setOpenAddLoanDialog(false);
    setComment("");
    setAmountError("");

    setLoanTypeError("");

    setDurationError("");

    setCallTimeError("");

    setOpenAddLoanDialog(false);

    setLoanType(null);

    setLoanTypeError("");
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

  const fetchLoansData = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${BASE_URL}/serviceType/getServiceTypeByServiceId/${4}`, {
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

        setLoans(formattedData);
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchLoansData();
  }, [loanUpdated, token]);

  const fetchLoanOptions = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `${BASE_URL}/serviceSubType/getServiceSubTypeByServiceId/${4}`,
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
        setLoanOptions(options);
        setLoading(false)
      } else {
        setLoading(false)
        console.error("Failed to loan options:", response.data);
      }
    } catch (error) {
      setLoading(false)
      console.error("Error fetching loan options:", error);
    }
  };
  useEffect(() => {
    fetchLoanOptions();
  }, [loanUpdated, token]);
  const addLoan = async () => {
    if (!amount.trim()) {
      setAmountError("Loan Amount is required.");
      return;
    }

    setAmountError("");
    const formattedFromTime = fromTime ? fromTime.format("hh:mm ss") : "";

    const formattedToTime = toTime ? toTime.format("hh:mm ss") : "";

    const newLoan = {
      id: loans,
      type: loanType || "",
      amount,
      date,
      duration: others,
      fromTime: formattedFromTime,
      toTime: formattedToTime,
      status: "Pending",
      comment,
    };
    const loanPayload = {
      amount: newLoan.amount,
      serviceSubType: newLoan.type,
      duration: newLoan.duration?.value,
      status: "Pending",
      comment: newLoan.comment,
      fromTime: newLoan.fromTime,
      toTime: newLoan.toTime,
      serviceId: 4,
    };
    try {
      setLoanErrorMessage(false)
      setLoading(true)
      const response = await axios.post(
        `${BASE_URL}/serviceType/createServiceType`,
        loanPayload,
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
        setLoans(response.data.data);
        setLoanUpdated(prev => !prev);
        handleCloseAddLoanDialog();
        setLoading(false)
      } else {
        setLoading(false)
        setLoanErrorMessage(response.data.message)
        console.error("API error:", response.data);
      }
    } catch (error: any) {
      setLoading(false)
      setLoanErrorMessage(error.response.data.message)
      console.error("Error during loan creation:", error);
      if (error.response) {
        setLoading(false)
        setLoanErrorMessage(error.response.data.message)
        console.error("API Error Response:", error.response.data.message);
      } else if (error.request) {
        setLoading(false)
        setLoanErrorMessage(error.response.data.message)
        console.error("No response from server.");
      } else {
        setLoading(false)
        setLoanErrorMessage(error.response.data.message)
        console.error("Unexpected error:", error.message);
      }
    }
  };
  const editLoan = async () => {
    try {
      const UpdateLoanPayload = {
        amount,
        comment,
        fromTime: fromTime ? dayjs(fromTime).format("hh:mm A") : null,
        toTime: toTime ? dayjs(toTime).format("hh:mm A") : null,
        duration: others?.value,
        type: loanType,
        status: status || "Pending",
      };
      setLoanErrorMessage(false)
      setLoading(true)
      const response = await axios.put(
        `${BASE_URL}/serviceType/updateServiceTypeById/${selectedId}`,
        UpdateLoanPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status) {
        console.log("Loan updated successfully:", response.data);
        handleCloseAddLoanDialog();
        fetchLoansData();
        setLoanUpdated(prev => !prev);
        setLoading(false)
      } else {
        setLoading(false)
        setLoanErrorMessage(response.data.message)
        console.error("Update failed:", response.data.message);
      }
    } catch (error: any) {
      setLoading(false)
      setLoanErrorMessage(error.response.data.message)
      console.error("Error updating loan:", error);
    }
  };
  const deleteLoan = async () => {
    if (!selectedId) {
      console.error("No loan selected for deletion.");
      return;
    }
    setLoading(true)
    try {
      await axios.delete(`${BASE_URL}/serviceType/deleteServiceTypeById/${selectedId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoanUpdated(prev => !prev);
      setLoans((prevAllLoan: any[]) => {
        const updatedAllLoan = prevAllLoan
          .filter((loan) => loan.id !== selectedId)
          .map((loan, index) => ({
            ...loan,
          }));

        return updatedAllLoan;
      });
      setLoading(false)
      console.log(`Loan with ID ${selectedId} deleted successfully.`);
    } catch (error) {
      setLoading(false)
      console.error("Error deleting loan:", error);
    }
    setOpenDeleteLoanDialog(false);
  };

  const [comment, setComment] = useState("");

  const handleCommentChange = (event: any) => {
    const newComment = event.target.value;
    setComment(newComment);
  };

  const validateAmount = () => {
    if (!amount.trim()) {
      setAmountError("Loan amount is required.");
    } else if (!/^\d+$/.test(amount)) {
      setAmountError("Only numeric values are allowed.");
    } else {
      setAmountError("");
    }
  };

  const validateLoanType = () => {
    if (!loanType) {
      setLoanTypeError("Loan type is required.");
    } else {
      setLoanTypeError("");
    }
  };

  const validateOthers = () => {
    if (!others) {
      setDurationError("Duration of loan is required.");
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

    // setCallTimeError("");

    return true;
  };

  const validateForm = () => {
    let isValid = true;

    if (!amount.trim()) {
      setAmountError("Loan amount is required");

      isValid = false;
    }

    if (!loanType) {
      setLoanTypeError("Loan type is required");

      isValid = false;
    }

    if (!others) {
      setDurationError("Duration of loan is required");

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
      editLoan();
    } else {
      addLoan();
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
            <IconButton
              color="info"
              size="small"
              onClick={() => handleViewButton(params.row)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
            {!isEditDeleteHidden && (
              <>
                <IconButton
                  color="primary"
                  size="small"
                  onClick={() => handleEditButton(params.row)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => handleDeleteButton(params.row.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </>
            )}

          </Box>
        );
      },
    }
  ];
  const handleEditButton = (formDataLoan: any) => {
    setIsEdit(true);
    setSelectedId(formDataLoan.id);
    setAmount(formDataLoan.amount);
    setComment(formDataLoan.comment);
    setFromTime(
      formDataLoan.fromTime ? dayjs(formDataLoan.fromTime, "HH:mm:ss") : null
    );
    setToTime(
      formDataLoan.toTime ? dayjs(formDataLoan.toTime, "HH:mm:ss") : null
    );
    const selectedDuration = durations.find((d: any) => d.value === formDataLoan.duration) || null;
    setOthers(selectedDuration);
    setOpenAddLoanDialog(true);
    setLoanType(formDataLoan.type);
  };

  const handleDeleteButton = (id: any) => {
    setSelectedId(id);

    setOpenDeleteLoanDialog(true);
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
    setOpenAddLoanDialog(true);
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
      <PageContainer title="Loan" description="this is Loan page">
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                {/* <LoanDialog onConfirmYes={handleConfirmYes} /> */}
                <Button
                  variant="contained"
                  sx={{ textTransform: "none" }}
                  onClick={() => {
                    setIsEdit(false);
                    setOpenAddLoanDialog(true);
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
                    <Typography variant="h4">Loan</Typography>
                  </Grid>
                  <Box
                    sx={{ flexGrow: 1, width: "100%", height: "auto", minHeight: "60vh", display: "flex" }}
                  >
                    <DataGrid
                      rows={loans}
                      columns={columns.map((col) => ({ ...col, flex: 1 }))}
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
          open={openAddLoanDialog}
          onClose={handleCloseAddLoanDialog}
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
              {isEdit ? "Edit Loan" : "Add Loan"}
            </Typography>
          </DialogTitle>
          {loanErrorMessage && (
            <Grid item>
              <Box sx={{
                border: 1,
                borderColor: '#ff9999',
                p: 0,
                m: 2,
                backgroundColor: '#f8bbd0'
              }}>
                <Alert severity="error">{loanErrorMessage}</Alert>
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
                      Loan amount <span style={{ color: "red" }}>*</span>
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
                  options={loanOptions}
                  getOptionLabel={(option: any) => option.label || ""}
                  value={loanOptions.find((opt: any) => opt.label === loanType) || null}
                  onChange={(_, newValue: any) => {
                    setLoanType(newValue ? newValue.label : null);
                    setLoanTypeError("");
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        <span>
                          Loan type <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      variant="outlined"
                      error={!!loanTypeError}
                      helperText={loanTypeError}
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
                            Duration of loan{" "}
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
                                if (to.isBefore(from)) {
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
            <Button variant="outlined" onClick={handleCloseAddLoanDialog}>
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
          open={openDeleteLoanDialog}
          onClose={() => setOpenDeleteLoanDialog(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Delete Loan</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to delete ?</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenDeleteLoanDialog(false)}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button onClick={deleteLoan} variant="contained" color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </PageContainer>
      <Dialog open={openViewDialog} onClose={handleCloseViewDialog} fullWidth maxWidth="xs">
        <DialogTitle>Loan Details</DialogTitle>
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

export default Loan;
