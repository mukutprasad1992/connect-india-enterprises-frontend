"use client";
import {
  Box,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Typography,
  Divider,
  Alert,
  CircularProgress,
  Snackbar,
  Tooltip,
  Paper
} from "@mui/material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import GridOnIcon from '@mui/icons-material/GridOn';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios from 'axios';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { formatDateTime } from "@/utils/utils";
import { loadLayoutFromLocalStorage, saveLayoutToLocalStorage } from "@/app/utils/utils";
import CustomToolbar from "../../components/CustomToolbar";

interface CustomerData {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  pincode: string;
}

const defaultColumnVisibility = {
  id: true,
  name: true,
  email: false,
  address: false,
  phone: false,
  pincode: false,
  actions: true
}
const pageName = 'customerPage'
const User = () => {
  const router = useRouter();
  const [rows, setRows] = useState<CustomerData[]>([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openCustomerSuccessSnackbar, setOpenCustomerSuccessSnackbar] = useState(false)
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [successCustomerMessage, setSuccessCustomerMessage] = useState(false);
  const [customerErrorMessage, setCustomerErrorMessage] = useState(false);
  const [customerUpdated, setCustomerUpdated] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [columnsVisibilityModel, setColumnsVisibilityModel] = useState<any>(defaultColumnVisibility);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const [addError, setAddError] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    pincode: '',
  });
  const [addFormData, setAddFormData] = useState({
    id: '',
    name: '',
    email: '',
    address: '',
    phone: '',
    pincode: '',
  });
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const getRoleId = () => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("roleId");
      const roleId = storedRole ? parseInt(storedRole, 10) : null;
      return roleId;
    }
  }
  const getToken = () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem('accessToken');
      return token;
    }
  }
  const token = getToken();
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
      if (roleId !== 1 && roleId !== 2) {
        localStorage.clear();
        router.push("/authentication/login");
      }
    } else {
      localStorage.clear();
      router.push("/authentication/login");
    }
  }, [router, token]);
  const handleEditButton = (rowData: any) => {
    setSelectedId(rowData.id);
    setIsEdit(true);
    setAddFormData(rowData);
    setOpenAddDialog(true);
  };

  const handleAddUser = () => {
    setOpenAddDialog(true);
  };

  const handleAddChange = (e: any) => {
    const { name, value } = e.target;
    setAddFormData((prev) => ({ ...prev, [name]: value }));
    if (value) {
      setAddError((prev: any) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const validateAddForm = () => {
    let isValid = true;
    const newErrors = { ...addError };
    if (!addFormData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    if (!addFormData.address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }
    if (!addFormData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(addFormData.email)) {
      newErrors.email = 'Enter a valid email address';
      isValid = false;
    }
    if (!addFormData.phone.trim()) {
      newErrors.phone = 'Phone is required';
      isValid = false;
    } else if (!/^\+?\d{10,13}$/.test(addFormData.phone)) {
      newErrors.phone = 'Phone number must be between 10 to 13 digits, optionally starting with "+"';
      isValid = false;
    }
    if (!addFormData.pincode.trim()) {
      newErrors.pincode = 'Pin code is required';
      isValid = false;
    }

    setAddError(newErrors);
    return isValid;
  };
  useEffect(() => {
    const fetchAllCustomers = async () => {
      if (!roleId || !token) {
        return;
      } else {
        if (token) {
          const decoded: any = jwtDecode(token);
          if (decoded.exp * 1000 < Date.now()) {
            localStorage.clear();
            router.push("/authentication/login");
          }
        }
        try {
          setLoading(true);
          const response = await axios.get(`${BASE_URL}/customer/getAllCustomer`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response?.data?.status && response?.data?.data) {
            setRows(response.data.data);
          }

          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error("Error fetching customers:", error);
        }
      }
    };
    fetchAllCustomers();
  }, [roleId, token]);
  const handleAdd = async () => {
    if (!validateAddForm()) {
      return;
    }
    if (!token) {
      return;
    }
    if (roleId !== 2) {
      return;
    }
    if (token) {
      const decoded: any = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
        router.push("/authentication/login");
      }
    }
    try {
      const addPayload = {
        name: addFormData.name,
        email: addFormData.email,
        phone: addFormData.phone,
        address: addFormData.address,
        pincode: addFormData.pincode
      };
      setCustomerErrorMessage(false)
      setLoading(true);
      const response = await axios.post(
        `${BASE_URL}/customers/createCustomer`,
        addPayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201) {
        setSuccessCustomerMessage(response.data.message)
        setOpenAddDialog(false);
        setLoading(false);
        setCustomerErrorMessage(false)
        setOpenCustomerSuccessSnackbar(true);
        setAddFormData({
          id: '',
          name: '',
          email: '',
          address: '',
          phone: '',
          pincode: '',
        });
        setAddError({
          name: '',
          email: '',
          address: '',
          phone: '',
          pincode: '',
        });
        setCustomerUpdated(prev => !prev);
      }
      else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          setCustomerErrorMessage(error.response.data.message);
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
  const handleUpdate = async () => {
    if (!validateAddForm()) {
      return;
    }
    if (!token) {
      return;
    }
    if (roleId !== 2) {
      return;
    }
    if (token) {
      const decoded: any = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
        router.push("/authentication/login");
      }
    }
    try {
      const updatePayload = {
        name: addFormData.name,
        email: addFormData.email,
        phone: addFormData.phone,
        address: addFormData.address,
        pincode: addFormData.pincode
      };
      setCustomerErrorMessage(false)
      setLoading(true);
      const response = await axios.put(
        `${BASE_URL}/customers/updateCustomer/${addFormData.id}`,
        updatePayload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (response.status === 201 || response.data.data) {
        setSuccessCustomerMessage(response.data.message);
        setOpenAddDialog(false);
        setOpenCustomerSuccessSnackbar(true);
        setLoading(false)
        setCustomerErrorMessage(false)
        setAddFormData({
          id: '',
          name: '',
          email: '',
          address: '',
          phone: '',
          pincode: '',
        });

        setAddError({
          name: '',
          email: '',
          address: '',
          phone: '',
          pincode: '',
        });

        setCustomerUpdated(prev => !prev);
      } else {
        setLoading(false)
        console.warn("Unexpected response status:", response.status);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setLoading(false)
          console.error("Error response data:", error.response.data.message);
          setCustomerErrorMessage(error.response.data.message);
        } else if (error.request) {
          setLoading(false)
          console.error("No response from server:", error.request);
        } else {
          setLoading(false)
          console.error("Error during request setup:", error.message);
        }
      } else {
        setLoading(false)
        console.error("Unexpected error:", error);
      }
    }
  };
  const handleCloseAddCustomerDialog = () => {
    setCustomerErrorMessage(false)
    setOpenAddDialog(false);
    setAddFormData({
      id: '',
      name: "",
      email: "",
      address: "",
      phone: "",
      pincode: "",
    });
    setAddError({
      name: '',
      email: '',
      address: '',
      phone: '',
      pincode: '',
    });
  };

  const resetAddForm = () => {
    setAddFormData({
      id: '',
      name: '',
      email: '',
      address: '',
      phone: '',
      pincode: '',
    });

    setAddError({
      name: '',
      email: '',
      address: '',
      phone: '',
      pincode: '',
    });
  };
  const handleViewButton = (row: any) => {
    setSelectedRow(row);
    setOpenViewDialog(true);
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 100, flex: 0, maxWidth: 40 },
    { field: "name", headerName: "Name", flex: .8 },
    { field: "email", headerName: "Email", flex: .8 },
    { field: "phone", headerName: "Phone", flex: .8 },
    { field: "address", headerName: "Address", flex: .8 },
    { field: "pincode", headerName: "Pin Code", flex: .8 },
    {
      field: "actions",
      headerName: "Actions",
      flex: .8,
      renderCell: (params: any) => (
        <>
          <Tooltip title="View">
            <IconButton color="secondary" size="small" onClick={() => handleViewButton(params.row)}>
              <VisibilityIcon fontSize="small" sx={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
          {roleId === 2 && (
            <Tooltip title="Edit">
              <IconButton color="primary" size="small" onClick={() => handleEditButton(params.row)}>
                <EditIcon fontSize="small" sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
          )}
        </>
      ),
    },
  ];



  const handleCloseCustomerSuccessSnackbar = () => {
    setOpenCustomerSuccessSnackbar(false);
  }

  const exportToPDF = async () => {
    const doc = new jsPDF();

    doc.setFontSize(12);
    doc.text("INVESTMENT LIST", 14, 30);
    const logoWidth = 40;
    const logoHeight = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoX = (pageWidth - logoWidth) / 2;
    const dataTime = formatDateTime(new Date())
    doc.addImage('/images/logos/logo.png', "PNG", logoX, 7, logoWidth, logoHeight);
    doc.setFontSize(12);
    doc.text("Name: " + userName, 14, 40);
    doc.text(dataTime, pageWidth - 14, 30, { align: "right" });

    autoTable(doc, {
      startY: 50,
      head: [
        ["ID", "Name", "Email", "Phone", "Address", "Pin Code", "business Name", "Representative"]
      ],
      body: (rows || []).map((row: any) => [
        row.id,
        row.name,
        row.email,
        row.phone,
        row.address,
        row.pincode,
        row.businessName,
        row.businessRepresentative
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
    doc.save("AllInvestmentData.pdf");
  };
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(rows || []);

    const headerKeys = Object.keys(rows[0] || {});
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileURL = URL.createObjectURL(blob);
    saveAs(blob, "customers.xlsx");
  }

  useEffect(() => {
    const saved = loadLayoutFromLocalStorage(pageName);
    if (saved) {
      setColumnsVisibilityModel(saved);
    }
  }, []);

  const handleSaveLayout = () => {
    saveLayoutToLocalStorage(pageName, columnsVisibilityModel);
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
      <Box >
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Paper sx={{ mr: 1.5 }} >
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"

              ><Grid sx={{ m: 2 }} >
                  <Typography variant="h4">Customer</Typography>
                </Grid>
                <Grid item xs={6} sx={{ mr: 1 }}>
                  <Box display="flex" justifyContent="flex-end" >
                    {roleId === 2 && (
                      <IconButton
                        sx={{ color: "#465fff" }}
                        onClick={handleAddUser}
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>
                    )}
                    <IconButton onClick={exportToExcel}>
                      <GridOnIcon sx={{ color: "#465fff" }} />
                    </IconButton>
                    <IconButton onClick={exportToPDF}>
                      <PictureAsPdfIcon sx={{ color: "#465fff" }} />
                    </IconButton>
                  </Box>
                </Grid>
                <Box sx={{ flexGrow: 1, width: "100%", height: "auto", minHeight: "60vh", display: "flex" }}>
                  <DataGrid
                    rows={rows || []}
                    columns={columns.map((col: any) => {
                      if (col.field === "actions") {
                        return { ...col, flex: 1, editable: false };
                      }
                      return {
                        ...col,
                        flex: 1,
                        editable: false,
                        renderCell: (params: any) =>
                          params.value === null || params.value === undefined || params.value === ""
                            ? "-"
                            : params.value,
                      };
                    })}
                    pageSizeOptions={[5, 10, 20, 50, 100]}
                    paginationModel={pagination}
                    onPaginationModelChange={setPagination}
                    disableRowSelectionOnClick
                    density="compact"
                    autoHeight
                    sortModel={[{ field: "id", sort: "desc" }]}
                    slots={{
                      toolbar: () => <CustomToolbar onSave={handleSaveLayout} />
                    }}
                    columnVisibilityModel={columnsVisibilityModel}
                    onColumnVisibilityModelChange={(newModel) =>
                      setColumnsVisibilityModel(newModel)
                    }
                    slotProps={{
                      columnsPanel: {
                        sx: {
                          maxHeight: 500,
                          overflowY: "auto"
                        }
                      }
                    }}
                    sx={{
                      fontSize: "0.575rem",
                      "& .MuiDataGrid-columnHeaders": {
                        fontSize: "0.575rem",
                        fontWeight: 600
                      },
                      "& .MuiDataGrid-cell": {
                        fontSize: "0.575rem"
                      },
                      "& .MuiDataGrid-toolbarContainer": {
                        fontSize: "0.575rem"
                      }
                    }}
                  />
                </Box>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Dialog open={openAddDialog} onClose={handleCloseAddCustomerDialog}>
        <DialogTitle> Customer</DialogTitle>
        <Divider></Divider>
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
        {customerErrorMessage && (
          <Grid item>
            <Box sx={{
              border: 1,
              borderColor: '#ff9999',
              p: 0,
              mb: 2,
              backgroundColor: '#f8bbd0'
            }}>
              <Alert severity="error">{customerErrorMessage}</Alert>
            </Box>
          </Grid>
        )}
        <DialogContent sx={{ overflow: 'visible', minHeight: '120px' }}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label={
                  <span>
                    Name <span style={{ color: "red" }}>*</span>
                  </span>
                }
                name="name"
                className="customTextField"
                fullWidth
                value={addFormData.name}
                onChange={handleAddChange}
                onBlur={() => {
                  if (!addFormData.name.trim()) {
                    setAddError((prev: any) => ({
                      ...prev,
                      name: "Name is required",
                    }));
                  } else {
                    setAddError((prev: any) => ({ ...prev, name: "" }));
                  }
                }}
                error={!!addError.name}
                helperText={addError.name}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label={
                  <span>
                    Phone<span style={{ color: "red" }}>*</span>
                  </span>
                }
                name="phone"
                className="customTextField"
                fullWidth
                value={addFormData.phone}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^[+-]?\d{0,13}$/.test(value)) {
                    setAddFormData((prev: any) => ({
                      ...prev,
                      phone: value,
                    }));
                    setAddError((prev: any) => ({
                      ...prev,
                      phone: "",
                    }));
                  }
                }}
                onBlur={() => {
                  const phone = addFormData.phone.trim();

                  if (!phone) {
                    setAddError((prev: any) => ({
                      ...prev,
                      phone: "Phone is required",
                    }));
                  } else if (!/^\+?\d{10,13}$/.test(phone)) {
                    setAddError((prev: any) => ({
                      ...prev,
                      phone: "Phone number must be between 10 to 13 digits, optionally starting with '+'",
                    }));
                  } else {
                    setAddError((prev: any) => ({ ...prev, phone: "" }));
                  }
                }}

                error={!!addError.phone}
                helperText={addError.phone}
                inputProps={{ maxLength: 13 }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={
                  <span>
                    Email<span style={{ color: "red" }}>*</span>
                  </span>
                }
                className="customTextField"
                name="email"
                fullWidth
                value={addFormData.email}
                onChange={handleAddChange}
                InputProps={{
                  readOnly: isEdit,
                }}
                onBlur={() => {
                  const email = addFormData.email.trim();
                  const emailRegex =
                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                  if (!email) {
                    setAddError((prev: any) => ({
                      ...prev,
                      email: "Email is required",
                    }));
                  } else if (!emailRegex.test(email)) {
                    setAddError((prev: any) => ({
                      ...prev,
                      email: "Enter a valid email address",
                    }));
                  } else {
                    setAddError((prev: any) => ({ ...prev, email: "" }));
                  }
                }}
                error={!!addError.email}
                helperText={addError.email}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={
                  <span>
                    Pin code<span style={{ color: "red" }}>*</span>
                  </span>
                }
                name="pincode"
                className="customTextField"
                fullWidth
                value={addFormData.pincode}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow only numbers and '+'
                  if (/^[+]?[0-9]*$/.test(value)) {
                    setAddFormData((prev: any) => ({
                      ...prev,
                      pincode: value,
                    }));
                    setAddError((prev: any) => ({
                      ...prev,
                      pincode: "",
                    }));
                  }
                }}
                onBlur={() => {
                  const pincode = addFormData.pincode.trim();

                  if (!pincode) {
                    setAddError((prev: any) => ({
                      ...prev,
                      pincode: "Pin code is required",
                    }));
                  } else if (pincode.length < 6) {
                    setAddError((prev: any) => ({
                      ...prev,
                      pincode: "Pincode  must be  6 digits",
                    }));
                  } else {
                    setAddError((prev: any) => ({ ...prev, pincode: "" }));
                  }
                }}
                error={!!addError.pincode}
                helperText={addError.pincode}
                inputProps={{ maxLength: 6 }}
              />
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} marginTop={2} marginLeft={2}>
                <TextField
                  label={
                    <span>
                      Address<span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  name="address"
                  fullWidth
                  className="customTextField"
                  multiline
                  rows={2}
                  maxRows={2}
                  inputProps={{
                    maxLength: 100,
                    style: {
                      lineHeight: 1.0,
                      wordBreak: "break-word",
                    },
                  }}
                  value={addFormData.address}
                  onChange={(e) => {
                    let inputValue = e.target.value;
                    inputValue = inputValue.replace(/\s{2,}/g, " ");
                    setAddFormData((prev: any) => ({ ...prev, address: inputValue }));
                  }}
                  onBlur={() => {
                    let trimmedValue = addFormData.address.trim();
                    setAddFormData((prev: any) => ({ ...prev, address: trimmedValue }));
                    if (!trimmedValue) {
                      setAddError((prev: any) => ({
                        ...prev,
                        address: "Address is required",
                      }));
                    } else {
                      setAddError((prev: any) => ({ ...prev, address: "" }));
                    }
                  }}
                  error={!!addError.address}
                  helperText={addError.address}
                />
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddCustomerDialog} color="error">
            Cancel
          </Button>
          <Button
            onClick={isEdit ? handleUpdate : handleAdd}
            variant="contained"
            color="primary"
          >
            {isEdit ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            {selectedRow &&
              Object.entries(selectedRow).map(([key, value], index) => (
                <Grid item xs={6} sm={6} key={index}>
                  <Typography variant="caption" color="textSecondary">
                    <strong> {key}:</strong> {String(value)}
                  </Typography>
                </Grid>
              ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openCustomerSuccessSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseCustomerSuccessSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseCustomerSuccessSnackbar} variant="filled" severity="success" sx={{ width: '100%' }}>
          {successCustomerMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default User;