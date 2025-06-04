"use client";
import {
  Grid,
  Box,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Divider,
  CircularProgress,
  Alert,
  Snackbar,
  Avatar,
} from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import dayjs from "dayjs";
import axios from 'axios';
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import DeleteIcon from "@mui/icons-material/Delete";
import { formatDate } from "../../../../utils/utils";
import { DataGrid, GridColDef, GridToolbarColumnsButton, GridToolbarContainer, } from "@mui/x-data-grid";
import DashboardCard from "../../components/shared/DashboardCard";
import { formatDateToIST } from '../../../../utils/utils';
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";
import React from "react";
interface Collaborator {
  id: number;
  code?: string;
  response: {
    names: { first_name: string };
    input_text: string;
    email: string;
    numeric_field: string;
    address: string;
  };
}
const Collaborator = () => {
  const [rows, setRows] = useState<
    {
      id: number;
      code: string;
      business_name: string;
      business_representative: string;
      email: string;
      numeric_field: string;

    }[]
  >([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<any>(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [successVendorMessage, setSuccessVendorMessage] = useState(false);
  const [vendorErrorMessage, setVendorErrorMessage] = useState(false);
  const [openVendorSuccessSnackbar, setOpenVendorSuccessSnackbar] = useState(false)
  const [selectedId, setSelectedId] = useState("");
  const [amount, setAmount] = useState("");
  const [others, setOthers] = useState("");
  const [openAddVendorDialog, setOpenAddVendorDialog] = useState(false);
  const [openStatusVendorDialog, setOpenStatusVendorDialog] =
    useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [amountError, setAmountError] = useState("");
  const [durationError, setDurationError] = useState("");
  const [callTimeError, setCallTimeError] = useState("");
  const [othersError, setOthersError] = useState("");
  const [vendorList, setVendorList] = useState([]);
  const [vendorUpdated, setVendorUpdated] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const [vendorFormData, setVendorFormData] = useState({
    id: "",
    businessName: "",
    businessRepresentative: "",
    email: "",
    mobileNo: "",
    roleId: 2,
    vendorCode: "",
    address: "",
    status: "",
  });
  const [errorVendorFormData, setErrorVendorFormData] = useState<any>({
    id: "",
    businessName: "",
    businessRepresentative: "",
    email: "",
    roleId: 2,
    mobileNo: "",
    vendorCode: "",
    address: "",
    status: "",
  });
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const emailRegex = /^[^\s@]+@([^\s@.]+\.)+[a-zA-Z]{2,}$/;
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
      router.push('/authentication/login');
    }
    if (token) {
      const decoded: any = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
        router.push("/authentication/login");
      }
    }
  }, [router]);
  const validateVendorForm = () => {


    let isValid = true;
    let error: any = {};

    if (!vendorFormData?.businessName?.trim()) {
      error.businessName = "Business name is required";
      isValid = false;
    }
    if (!vendorFormData?.businessRepresentative?.trim()) {
      error.businessRepresentative = "Business representative is required";
      isValid = false;
    }
    if (!vendorFormData?.email?.trim()) {
      error.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(vendorFormData.email)) {
      error.email = "Enter a valid email address";
      isValid = false;
    }
    if (!vendorFormData?.mobileNo?.trim()) {
      error.mobileNo = "mobileNo is required";
      isValid = false;
    }
    if (!vendorFormData?.address?.trim()) {
      error.address = "Address is required";
      isValid = false;
    }
    setErrorVendorFormData(error);
    return isValid;
  };

  const handleCloseAddVendorDialog = () => {
    setComment("");
    setOpenAddVendorDialog(false);
    setErrorVendorFormData({
      id: "",
      businessName: "",
      businessRepresentative: "",
      email: "",
      roleId: "",
      mobileNo: "",
      vendorCode: "",
      vendorErrorMessage: "",
      vendorSuccessMessage: ""
    });
    setVendorFormData({
      id: "",
      businessName: "",
      businessRepresentative: "",
      email: "",
      roleId: 0,
      mobileNo: "",
      vendorCode: "",
      address: "",
      status: ""
      ,
    });
    setVendorErrorMessage(false)
  };
  const toggleVendorStatus = async () => {
    if (!token) return;
    if (token) {
      const decoded: any = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
        router.push("/authentication/login");
      }
    }
    try {
      const vendorId = selectedId;
      const currentStatus = vendorFormData.status;

      if (!vendorId || !currentStatus) return;

      let status = "";
      if (currentStatus === "Enable") {
        console.log("currentStatus --- Enable", currentStatus)
        status = "Disable";
        console.log("status -- enable", status);
      } else if (currentStatus === "Disable") {
        console.log("currentStatus --- Disable", currentStatus)
        status = "Enable";
      } else {
        return;
      }
      setLoading(true);

      const response = await axios.put(
        `${BASE_URL}/user/updateUserStatusById/${vendorId}`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setOpenStatusVendorDialog(false);
        setSuccessVendorMessage(response.data.message);
        setOpenVendorSuccessSnackbar(true);
        setVendorUpdated(prev => !prev);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Error response data:", error.response.data.message);
          setVendorErrorMessage(error.response.data.message);
        } else if (error.request) {
          console.error("No response from server:", error.request);
        } else {
          console.error("Error during request setup:", error.message);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const [comment, setComment] = useState("");

  const handleCommentChange = (event: any) => {
    const newComment = event.target.value;
    setComment(newComment);
  };
  const validateForm = () => {
    let isValid = true;

    if (!amount.trim()) {
      setAmountError("Investment amount is required");
      isValid = false;
    }


    if (!others) {
      setDurationError("Duration of investment is required");
      isValid = false;
    }
    return isValid;
  };
  const handleSubmit = async () => {
    const isValid = validateVendorForm();
    if (!isValid) {
      return;
    }
    const vendorPayload = {
      email: vendorFormData.email,
      address: vendorFormData.address,
      businessName: vendorFormData.businessName,
      businessRepresentative: vendorFormData.businessRepresentative,
      roleId: vendorFormData.roleId,
      mobileNo: vendorFormData.mobileNo,
      vendorCode: generatedCode || vendorFormData.vendorCode,
      status: "Enable"
    };
    setVendorErrorMessage(false)
    setLoading(true);

    try {
      if (!token) {
        return;
      }
      if (token) {
        const decoded: any = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.clear();
          router.push("/authentication/login");
        }
      }
      if (!isEdit) {
        const response = await axios.post(`${BASE_URL}/user/register`, vendorPayload, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 201) {
          setSuccessVendorMessage(response.data.message);
          setOpenAddVendorDialog(false);
          setLoading(false);
          setOpenVendorSuccessSnackbar(true);
          setVendorUpdated(prev => !prev);
        } else {
          setLoading(false);
        }
      } else {
        const response = await axios.put(`${BASE_URL}/user/updateUser/${selectedId}`, vendorPayload, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setOpenAddVendorDialog(false);
          setLoading(false);
          setOpenVendorSuccessSnackbar(true);
          setSuccessVendorMessage(response.data.message);
          setVendorUpdated(prev => !prev);
        } else {
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.log("Error response data:", error.response.data.message);
          setVendorErrorMessage(error.response.data.message);
        } else if (error.request) {
          console.error("No response from server:", error.request);
        } else {
          console.error("Error during request setup:", error.message);
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        if (!token) {
          return;
        }
        if (token) {
          const decoded: any = jwtDecode(token);
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.clear();
            router.push("/authentication/login");
          }
        }
        const response = await axios.get(`${BASE_URL}/user/getAllVendor`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVendorList(response?.data?.data)
        const formattedDate = formatDateToIST(response.data.data.createdAt);
      }
      catch (error) {
        console.error('Error fetching vendors:', error);

      }
    };

    fetchVendors();
  }, [token, vendorUpdated]);
  const handleViewButton = (rowData: any) => {
    setSelectedRow(rowData);
    setViewDialogOpen(true);
  };

  const handleViewDialogClose = () => {
    setViewDialogOpen(false);
    setSelectedRow(null);
  };
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.5 },

    { field: "businessName", headerName: "Business name", flex: 1 },
    { field: "businessRepresentative", headerName: "Business representative", flex: 1 },
    { field: "email", headerName: "Email", headerAlign: "center", flex: 1 },
    {
      field: "mobileNo",
      headerName: "Phone",
      flex: .6,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "vendorCode",
      headerName: "Vendor code",
      flex: 1,
      align: "center",
    },
    {
      field: "createdAt",
      headerName: "Created At",
      flex: .8,
      align: "center",
      renderCell: (params: any) => {
        return formatDate(params.value || params.row.createdAt);
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: .5,
      align: "center",
    },
    {
      field: "actions",
      headerName: "Action",
      flex: .8,
      align: "center",
      renderCell: (params: any) => (
        <Box display="flex" justifyContent="flex-start" width="100%" mt={1.5}>
          <Tooltip title="View">
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleViewButton(params.row)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleEditButton(params.row)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={vendorFormData.status === "Enable" ? "Block" : "Unblock"}
          >
            <IconButton
              color={params.row.status === "Enable" ? "success" : "error"}
              size="small"
              onClick={() => handleStatusButton(params.row)}
            >
              {params.row.status === "Enable" ? (
                <CheckCircleIcon fontSize="small" />
              ) : (
                <BlockIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      ),
    }
  ];

  const handleOpenDialog = (row: Collaborator) => {
    setCurrentRow(row);
    setGeneratedCode(row.code || "");
    setOpen(true);
  };

  const generateUniqueCode = () => {
    let newCode: string;
    do {
      const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
      newCode = `EUR-${randomPart}-2025`;
    } while (rows.some((r) => r.code === newCode));
    setGeneratedCode(newCode);
  };
  const handleEditButton = (rowData: any) => {
    setGeneratedCode('');
    setVendorFormData({
      id: rowData.id,
      businessName: rowData.businessName,
      businessRepresentative: rowData.businessRepresentative,
      email: rowData.email,
      mobileNo: rowData.mobileNo,
      roleId: rowData.roleId || 2,
      vendorCode: rowData.vendorCode,
      address: rowData.address,
      status: "Enable",
    });
    setIsEdit(true);
    setSelectedId(rowData.id);
    setOpenAddVendorDialog(true);
  };
  const handleStatusButton = (formData: any) => {
    setSelectedId(formData.id);
    setVendorFormData({
      id: formData.id,
      businessName: formData.businessName,
      businessRepresentative: formData.businessRepresentative,
      email: formData.email,
      mobileNo: formData.mobileNo,
      roleId: formData.roleId || 2,
      vendorCode: formData.vendorCode,
      address: formData.address,
      status: formData.status,
    });
    setOpenStatusVendorDialog(true);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setVendorFormData((prev) => ({ ...prev, [name]: value }));
    if (value) {
      setErrorVendorFormData((prev: any) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const addVendor = () => {
    setGeneratedCode('');
    setErrorVendorFormData({
      id: "",
      businessName: "",
      businessRepresentative: "",
      email: "",
      roleId: 2,
      mobileNo: "",
      vendorCode: "",
    });
    setVendorFormData({
      id: "",
      businessName: "",
      businessRepresentative: "",
      email: "",
      mobileNo: "",
      roleId: 2,
      vendorCode: "",
      address: "",
      status: ""
    });
    setOpenAddVendorDialog(false);
  };
  const handleCloseVendorSuccessSnackbar = () => {
    setOpenVendorSuccessSnackbar(false);
  }

  function CustomToolbar({ onButtonClick }: any) {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
      </GridToolbarContainer>
    );
  }
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
      <PageContainer title="Vendor" description="This is Vendor page">
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    setIsEdit(false);
                    generateUniqueCode();
                    setErrorVendorFormData({
                      id: "",
                      businessName: "",
                      businessRepresentative: "",
                      email: "",
                      mobileNo: "",
                      vendorCode: "",

                    });
                    setVendorFormData({
                      id: "",
                      businessName: "",
                      businessRepresentative: "",
                      email: "",
                      mobileNo: "",
                      roleId: 2,
                      vendorCode: "",
                      address: "",
                      status: "",
                    });
                    setOpenAddVendorDialog(true);
                  }}

                >
                  Add
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12}>
              <DashboardCard>
                <Box>
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                  >
                    <Typography variant="h4">Vendor</Typography>
                  </Grid>

                  <Box
                    sx={{ flexGrow: 1, width: "100%", height: "auto", minHeight: "60vh", display: "flex" }}
                  >
                    <DataGrid
                      rows={vendorList}
                      columns={columns}
                      sortModel={[{ field: "id", sort: "desc" }]}
                      pageSizeOptions={[5, 10, 20, 50, 100]}
                      paginationModel={pagination}
                      onPaginationModelChange={setPagination}
                      disableRowSelectionOnClick
                      autoHeight
                      sx={{ flexGrow: 1 }}
                      slots={{
                        toolbar: () => <CustomToolbar />,
                      }}
                    />
                  </Box>
                </Box>
              </DashboardCard>
            </Grid>
          </Grid>
        </Box>
        <Dialog
          open={openAddVendorDialog}
          onClose={() => setOpenAddVendorDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle> Vendor </DialogTitle>
          <Divider></Divider>
          <DialogContent sx={{ overflow: "visible", marginTop: "5px" }}>
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
            {vendorErrorMessage && (
              <Grid item>
                <Box sx={{
                  border: 1,
                  borderColor: '#ff9999',
                  p: 0,
                  mb: 2,
                  backgroundColor: '#f8bbd0'
                }}>
                  <Alert severity="error">{vendorErrorMessage}</Alert>
                </Box>
              </Grid>
            )}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label={
                    <span>
                      Business name<span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  name="businessName"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={vendorFormData.businessName}
                  onChange={handleChange}
                  onBlur={() => {
                    if (!vendorFormData.businessName.trim()) {
                      setErrorVendorFormData((prev: any) => ({
                        ...prev,
                        businessName: "Business name is required",
                      }));
                    } else {
                      setErrorVendorFormData((prev: any) => ({ ...prev, businessName: "" }));
                    }
                  }}
                  error={!!errorVendorFormData.businessName}
                  helperText={errorVendorFormData.businessName}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField

                  label={
                    <span>
                      Business representative<span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  name="businessRepresentative"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={vendorFormData.businessRepresentative}
                  onChange={handleChange}
                  onBlur={() => {
                    if (!vendorFormData.businessRepresentative.trim()) {
                      setErrorVendorFormData((prev: any) => ({
                        ...prev,
                        businessRepresentative: "Business representative  is required",
                      }));
                    } else {
                      setErrorVendorFormData((prev: any) => ({ ...prev, businessRepresentative: "" }));
                    }
                  }}
                  error={!!errorVendorFormData.businessRepresentative}
                  helperText={errorVendorFormData.businessRepresentative}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField

                  label={
                    <span>
                      Email<span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  name="email"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={vendorFormData.email}
                  onChange={handleChange}
                  onBlur={() => {
                    const emailRegex = /^[^\s@]+@([^\s@.]+\.)+[a-zA-Z]{2,}$/;


                    if (!vendorFormData.email.trim()) {
                      setErrorVendorFormData((prev: any) => ({
                        ...prev,
                        email: "Email is required",
                      }));
                    } else if (!emailRegex.test(vendorFormData.email)) {
                      setErrorVendorFormData((prev: any) => ({
                        ...prev,
                        email: "Enter a valid email address",
                      }));
                    } else {
                      setErrorVendorFormData((prev: any) => ({ ...prev, email: "" }));
                    }
                  }}
                  error={!!errorVendorFormData.email}
                  helperText={errorVendorFormData.email}
                />

              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label={
                    <span>
                      mobileNo<span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  name="mobileNo"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={vendorFormData.mobileNo}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^[+-]?\d{0,13}$/.test(value)) {
                      handleChange(e);
                      setErrorVendorFormData((prev: any) => ({ ...prev, mobileNo: "" }));
                    }
                  }}
                  onBlur={() => {
                    const mobileNo = vendorFormData.mobileNo.trim();
                    if (!mobileNo) {
                      setErrorVendorFormData((prev: any) => ({
                        ...prev,
                        mobileNo: "Phone is required.",
                      }));
                    } else if (mobileNo.length < 10) {
                      setErrorVendorFormData((prev: any) => ({
                        ...prev,
                        mobileNo: "Phone number must be at least 10 digits",
                      }));
                    }
                  }}
                  error={!!errorVendorFormData.mobileNo}
                  helperText={errorVendorFormData.mobileNo}
                />

              </Grid>


              <Grid item xs={12} md={6}>
                <TextField

                  label={
                    <span>
                      Vendor code<span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  name="vendorCode"
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={isEdit ? vendorFormData.vendorCode : generatedCode || ""}
                  InputProps={{ readOnly: true }}
                  onChange={handleChange}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={
                    <span>
                      Address<span style={{ color: "red" }}> *</span>
                    </span>
                  }
                  name="address"
                  multiline
                  rows={2}
                  maxRows={2}
                  fullWidth
                  variant="outlined"
                  inputProps={{
                    maxLength: 60,
                    style: { lineHeight: 1.0, wordBreak: "break-word" },
                  }}
                  value={vendorFormData.address}
                  onChange={(e) => {
                    let inputValue = e.target.value;
                    inputValue = inputValue.replace(/\s{2,}/g, " ");

                    setVendorFormData((prev: any) => ({ ...prev, address: inputValue }));
                  }}
                  onBlur={() => {
                    let trimmedAddress = vendorFormData.address.trim();

                    setVendorFormData((prev: any) => ({ ...prev, address: trimmedAddress }));

                    if (!trimmedAddress) {
                      setErrorVendorFormData((prev: any) => ({
                        ...prev,
                        address: "Address is required",
                      }));
                    } else {
                      setErrorVendorFormData((prev: any) => ({ ...prev, address: "" }));
                    }
                  }}
                  error={!!errorVendorFormData.address}
                  helperText={errorVendorFormData.address}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleCloseAddVendorDialog}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              {isEdit ? "Update" : "Submit"}
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={openStatusVendorDialog}
          onClose={() => !loading && setOpenStatusVendorDialog(false)} // Disable close on backdrop click while loading
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>
            {vendorFormData.status === "Enable" ? "Block" : "Unblock"} Vendor
          </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to{" "}
              <strong>
                {vendorFormData.status === "Enable" ? "Block" : "Unblock"}
              </strong>{" "}
              this vendor?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenStatusVendorDialog(false)}
              variant="outlined"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={toggleVendorStatus}
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress color="inherit" size={24} /> : vendorFormData.status === "Enable" ? "Block" : "Unblock"}
            </Button>
          </DialogActions>
        </Dialog>
      </PageContainer>
      <Dialog open={viewDialogOpen} onClose={handleViewDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>View Details</DialogTitle>
        <DialogContent dividers>
          <Box display="flex" justifyContent="center" mb={2}>
            <Avatar
              src={selectedRow?.profileImageURL || '/images/profile/user-1.jpg'}
              alt="User"
              sx={{ width: 150, height: 150 }}
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/profile/user-1.jpg';
              }}
            />
          </Box>
          <Divider sx={{ marginBottom: 2 }} />
          <Grid container spacing={1}>
            {selectedRow &&
              Object.entries(selectedRow)
                .filter(([key]) => key !== 'profileImageURL')
                .map(([key, value]) => {
                  if (value && typeof value === 'object') return null;
                  const formattedValue =
                    (key === 'createdAt' || key === 'dateOfBirth') && value
                      ? formatDate(value)
                      : value === null || value === undefined
                        ? '-'
                        : String(value);
                  return (
                    <React.Fragment key={key}>
                      <Grid item xs={6}>
                        <Typography>
                          <strong>
                            {key
                              .replace(/([A-Z])/g, ' $1')
                              .replace(/^./, str => str.toUpperCase())}
                            :
                          </strong>{' '}
                          {formattedValue}
                        </Typography>
                      </Grid>
                    </React.Fragment>
                  );
                })}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openVendorSuccessSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseVendorSuccessSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseVendorSuccessSnackbar}
          severity="success" sx={{ width: '100%', border: 1 }}>
          {successVendorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Collaborator;
