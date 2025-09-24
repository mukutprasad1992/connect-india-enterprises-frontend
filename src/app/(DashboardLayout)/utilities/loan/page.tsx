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
  Tooltip,
  Link,
  Paper
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
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import GridOnIcon from '@mui/icons-material/GridOn';
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useRouter } from 'next/navigation';
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";

import DashboardCard from "../../components/shared/DashboardCard";
import { jwtDecode } from "jwt-decode";
// import LoanDialog from "../../components/AI/AIAssistanceLoan";
import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { formatDateTime } from "@/utils/utils";
import PersonalLoanFormDialog from "../../components/serviceTypeForm/personalLoanFormDialog";
import CustomToolbar from "../../components/CustomToolbar";
import { loadLayoutFromLocalStorage, saveLayoutToLocalStorage } from "@/app/utils/utils";
import LoanStepProgress from "../../components/LoanStepProgress";

const defaultColumnVisibility = {
  id: false,
  submit: false,
  motherName: false,
  landmark: false,
  email: false,
  mobileNo: false,
  currentAddress: false,
  yearsOfCity: false,
  alternateNo: false,
  maritalStatus: false,
  designation: false,
  companyExp: false,
  totalWorkExp: false,
  officeAddress: false,
  officeMobile: false,
  ref1Name: false,
  ref1Mobile: false,
  ref1Address: false,
  ref2Name: false,
  ref2Mobile: false,
  ref2Address: false,
  panNumber: true,
  aadharNumber: true,
  photoFileKey: false,
  panCardFileKey: false,
  aadharCardFileKey: false,
  salarySlipsFileKey: false,
  bankStatementFileKey: false,
  serviceId: false,
  serviceSubTypeName: true,
  status: true,
  activeSteps: true,
  actions: true

}
const pageName = "loanPage";
const Loan = () => {
  const [loans, setLoans] = useState<any>(null);


  const [selectedId, setSelectedId] = useState("");
  const [loanType, setLoanType] = useState<string | null>(null);
  const [openAddLoanDialog, setOpenAddLoanDialog] = useState(false);
  const [openDeleteLoanDialog, setOpenDeleteLoanDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [preferredCallTime, setPreferredCallTime] = useState<Date | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loanTypeError, setLoanTypeError] = useState("");
  const [loanOptions, setLoanOptions] = useState([]);
  const router = useRouter();
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [loanErrorMessage, setLoanErrorMessage] = useState(false);
  const [loanUpdated, setLoanUpdated] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [columnsVisibilityModel, setColumnsVisibilityModel] = useState<any>(defaultColumnVisibility);
  const [editData, setEditData] = useState<any>(null);
  const [openLoanFormDialog, setOpenLoanFormDialog] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const AWS_S3_BUCKET_URL = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL;
  const handleCloseAddLoanDialog = () => {
    setLoanType(null);
    setOpenAddLoanDialog(false);
    setLoanTypeError("");
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

  const fetchLoansData = async () => {
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
      const response = await axios.get(`${BASE_URL}/loan/getloanByServiceId/${4}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status) {
        const formattedData = response.data.data.map((item: any) => ({
          id: item.id,
          submit: item.submit === 1 ? true : false,
          status: item.status,
          motherName: item.motherName,
          landmark: item.landmark,
          email: item.email,
          mobileNo: item.mobileNo,
          currentAddress: item.currentAddress,
          yearsOfCity: item.yearsOfCity,
          alternateNo: item.alternateNo?.toString()
            .replace(/\s+/g, "")
            .replace(/^\+91/, "")
            .slice(-10),
          maritalStatus: item.maritalStatus,
          designation: item.designation,
          companyExp: item.companyExp,
          totalWorkExp: item.totalWorkExp,
          officeAddress: item.officeAddress,
          officeMobile: item.officeMobile?.toString()
            .replace(/\s+/g, "")
            .replace(/^\+91/, "")
            .slice(-10),
          ref1Name: item.ref1Name,
          ref1Mobile: item.ref1Mobile?.toString()
            .replace(/\s+/g, "")
            .replace(/^\+91/, "")
            .slice(-10),
          ref1Address: item.ref1Address,
          ref2Name: item.ref2Name,
          ref2Mobile: item.ref2Mobile?.toString()
            .replace(/\s+/g, "")
            .replace(/^\+91/, "")
            .slice(-10),
          ref2Address: item.ref2Address,
          panNumber: item.panNumber,
          aadharNumber: item.aadharNumber,
          photoFileKey: item.photoFileKey,
          panCardFileKey: item.panCardFileKey,
          aadharCardFileKey: item.aadharCardFileKey,
          salarySlipsFileKey: item.salarySlipsFileKey,
          bankStatementFileKey: item.bankStatementFileKey,
          serviceId: item.serviceId,
          activeSteps: item.activeSteps,
          serviceSubTypeName: item.serviceSubTypeName,

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

  const deleteLoan = async () => {
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
      console.error("No loan selected for deletion.");
      return;
    }
    setDialogLoading(true)
    try {
      const response = await axios.delete(`${BASE_URL}/loan/deleteLoanById/${selectedId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSnackbarMessage(response.data.message);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setLoanUpdated(prev => !prev);
      setLoans((prevAllLoan: any[]) => {
        const updatedAllLoan = prevAllLoan
          .filter((loan) => loan.id !== selectedId)
          .map((loan, index) => ({
            ...loan,
          }));

        return updatedAllLoan;
      });
      setDialogLoading(false)
      console.log(`Loan with ID ${selectedId} deleted successfully.`);
    } catch (error) {
      setDialogLoading(false)
      console.error("Error deleting loan:", error);
    }
    setOpenDeleteLoanDialog(false);
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
    { field: "id", headerName: "ID", width: 100, flex: 0, maxWidth: 40 },
    { field: "panNumber", headerName: "PAN Number", flex: 0 },
    { field: "aadharNumber", headerName: "Aadhar Number", flex: 0 },
    { field: "serviceSubTypeName", headerName: "Type", flex: 0 },
    { field: "email", headerName: "Email", flex: 0 },
    { field: "mobileNo", headerName: "mobile No", flex: 0 },
    { field: "landmark", headerName: "Landmark", flex: 0 },
    { field: "motherName", headerName: "Mother Name", flex: 0 },
    { field: "yearsOfCity", headerName: "City Of Years", flex: 0 },
    { field: "alternateNo", headerName: "Alternate No", flex: 0 },
    { field: "maritalStatus", headerName: "Marital Status", flex: 0 },
    { field: "designation", headerName: "designation", flex: 0 },
    { field: "companyExp", headerName: "company Exp", flex: 0 },
    { field: "totalWorkExp", headerName: "totalWork Exp", flex: 0 },
    { field: "officeAddress", headerName: "Office Address", flex: 0 },
    { field: "officeMobile", headerName: "Office Mobile", flex: 0 },
    { field: "officeAddress", headerName: "Office Address", flex: 0 },
    // { field: "ref1Name", headerName: "Ref 1 Name", flex: 0 },
    // { field: "ref1Mobile", headerName: "Ref 1 Mobile", flex: 0 },
    // { field: "ref1Address", headerName: "Ref 2 Address", flex: 0 },
    // { field: "ref2Name", headerName: "Ref 2 Name", flex: 0 },
    // { field: "ref2Mobile", headerName: "Ref 2 Mobile", flex: 0 },
    // { field: "ref2Address", headerName: "Ref 2 Address", flex: 0 },
    // { field: "ref2Address", headerName: "Ref 2 Address", flex: 0 },
    {
      field: "status",
      headerName: "Status",
      flex: 0,
      renderCell: (params: any) => {
        const status = params.row.status;
        const color = getStatusColor(status);
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              height: "100%",
              fontFamily: "Verdana",
              fontSize: "10px",
            }}
          >
            <Typography
              variant="body1"
              sx={{ color, textAlign: "center", fontSize: "10px" }}
            >
              {status}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "activeSteps",
      headerName: "Active Steps",
      flex: 0,
      renderCell: (params: any) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexShrink: 0,
            gap: "4px",
          }}
        >
          <LoanStepProgress activeStep={params.value} />
        </Box>
      ),
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
            <Tooltip title="View">
              <IconButton
                sx={{ p: 0.1 }}
                color="info"
                size="small"
                onClick={() => handleViewButton(params.row)}
              >
                <VisibilityIcon fontSize="small" sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
            {!isEditDeleteHidden && (
              <>
                <Tooltip title="Edit">
                  <IconButton
                    sx={{ p: 0.1 }}
                    color="primary"
                    size="small"
                    onClick={() => handleEditButton(params.row)}
                  >
                    <EditIcon fontSize="small" sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    sx={{ p: 0.1 }}
                    color="error"
                    size="small"
                    onClick={() => handleDeleteButton(params.row.id)}
                  >
                    <DeleteIcon fontSize="small" sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
              </>
            )}

          </Box>
        );
      },
    }
  ];
  const handleEditButton = (rowData: any) => {
    setEditData(rowData);
    setIsEdit(true);
    setSelectedOption("personalLoan");
    setOpenDialog(true);
  };

  const handleDeleteButton = (id: any) => {
    setSelectedId(id);

    setOpenDeleteLoanDialog(true);
  };

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
        return "#8b8a3fff";
      case "In Progress":
        return "orange";
      case "Approved":
        return "#6ad392ff";
      case "Rejected":
        return "#ff8780";
      default:
        return "#8b8a3fff";
    }
  };
  const exportToPDF = async () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm'
    });
    doc.setProperties({
      title: 'Loan List Report',
      subject: 'Loan Data Export',
      author: 'Your Application Name',
      keywords: 'loan, report, data',
      creator: 'Your Application Name'
    });

    // Add header with logo and timestamp
    doc.setFontSize(12);
    doc.text("LOAN LIST", 14, 20);

    const logoWidth = 60;
    const logoHeight = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoX = (pageWidth - logoWidth) / 2;
    const dataTime = formatDateTime(new Date());

    doc.addImage('/images/logos/logo.png', "PNG", logoX, 7, logoWidth, logoHeight);
    doc.setFontSize(10);
    doc.text(dataTime, pageWidth - 14, 20, { align: "right" });
    doc.text(`Name: ${userName}`, 14, 30);

    const headers = [
      "ID",
      "Type",
      "PAN Number",
      "Aadhar Number",
      "Email",
      "Landmark",
      "City Years",
      "Mother Name",
      "Alternate No",
      "Status",
      "Comment"
    ];

    const bodyData = (loans || []).map((row: any) => [
      row.id || 'N/A',
      row.serviceSubType || 'N/A',
      row.panNumber || 'N/A',
      row.aadharNumber || 'N/A',
      row.email || 'N/A',
      row.landmark || 'N/A',
      row.yearsOfCity || 'N/A',
      row.motherName || 'N/A',
      row.alternateNo || 'N/A',
      row.status || 'N/A',
      row.comment || 'N/A'
    ]);

    autoTable(doc, {
      startY: 40,
      head: [headers],
      body: bodyData,
      headStyles: {
        fillColor: [165, 42, 42],
        textColor: 255,
        halign: 'center',
        fontStyle: 'bold',
        fontSize: 8
      },
      bodyStyles: {
        halign: 'center',
        fontSize: 7,
        cellPadding: 2,
        overflow: 'linebreak'
      },
      styles: {
        cellWidth: 'wrap',
        valign: 'middle'
      },
      margin: { top: 40 },
      tableWidth: 'auto',
      didDrawPage: function (data) {
        doc.setFontSize(10);
        doc.setTextColor(150);
        doc.text(
          `Page ${doc.getNumberOfPages()}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      },
      willDrawCell: function (data) {
        if (data.section === 'body') {
          const cellValue = data.cell.raw != null ? String(data.cell.raw) : '';
          const lines = doc.splitTextToSize(cellValue, data.cell.width - 4);
          if (lines.length > 1) {
            data.row.height = lines.length * 5;
          }
        }
      }
    });

    const fileName = `Loan_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
    const pdfBlob = doc.output('blob');
    const fileURL = URL.createObjectURL(pdfBlob);
    window.open(fileURL);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(loans || []);

    const headerKeys = Object.keys(loans || {});
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
    saveAs(blob, "Loans.xlsx");
  };

  const handleSelectChange = (event: any) => {
    setSelectedOption(event.target.value);
  };

  const getDocumentName = (key: any) => {
    const documentNames = {
      photoFileKey: 'View Photo ',
      aadharCardFileKey: 'View Aadhaar Card',
      panCardFileKey: 'View PAN Card',
      salarySlipsFileKey: 'View Salary Slip',
      bankStatementFileKey: 'View bank Statement',
    };
    return documentNames[key as keyof typeof documentNames] || 'View Document';
  };


  useEffect(() => {
    const saved = loadLayoutFromLocalStorage(pageName);
    if (saved) {
      setColumnsVisibilityModel(saved);
    }
  }, []);

  const handleSaveLayout = () => {
    saveLayoutToLocalStorage(pageName, columnsVisibilityModel);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedOption('');
    setEditData(null);
    setIsEdit(false);
  };

  return (
    <>
      <Box sx={{ pr: 1.5 }}>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Paper >
              <Box>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Grid sx={{ ml: 3 }} >
                    <Typography variant="h4"
                      sx={{
                        fontSize: { xs: "1.4rem", sm: "1.4rem", md: "1.4rem", }
                      }}
                    >Loan</Typography>
                  </Grid>

                  <Box display="flex" justifyContent="flex-end" alignItems="center" sx={{ p: 2 }}>
                    <Tooltip title="Add">
                      <IconButton
                        size="small"
                        sx={{ textTransform: "none", color: "#465fff", p: 0.2 }}
                        onClick={() => setOpenLoanFormDialog(true)}
                      >
                        <AddCircleOutlineIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Export Excel'>
                      <IconButton
                        size="small"
                        onClick={exportToExcel} sx={{ color: "#465fff", p: 0.2 }}>
                        <GridOnIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title='Export PDF'>
                      <IconButton
                        size="small"
                        onClick={exportToPDF} sx={{ color: "#465fff", p: 0.2 }}>
                        <PictureAsPdfIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Grid>
                <Box sx={{ flexGrow: 1, width: "100%", height: "auto", minHeight: "60vh", display: "flex" }}>
                  <DataGrid
                    rows={loans || []}
                    columns={columns.map((col: any) => {
                      if (col.field === "actions" || col.field === "activeSteps" || col.field === "status") {
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
                    autoHeight
                    density="compact"
                    sortModel={[{ field: "id", sort: "desc" }]}
                    slots={{
                      toolbar: () => <CustomToolbar onSave={handleSaveLayout} />
                    }}
                    slotProps={{
                      columnsPanel: {
                        sx: {
                          maxHeight: 400,
                          overflowY: "auto"
                        }
                      }
                    }}
                    columnVisibilityModel={columnsVisibilityModel}
                    onColumnVisibilityModelChange={(newModel) =>
                      setColumnsVisibilityModel(newModel)
                    }
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
              </Box>
            </Paper>
          </Grid>

        </Grid>
      </Box>
      {/* Delet button */}

      <Dialog
        open={openDeleteLoanDialog}
        onClose={() => setOpenDeleteLoanDialog(false)}
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
      <Dialog open={openViewDialog} onClose={handleCloseViewDialog} fullWidth maxWidth="md">
        <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Loan Details</Typography>
              <IconButton onClick={handleCloseViewDialog} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <DialogContent dividers>
          <Grid container spacing={1}>
            {selectedRow &&
              Object.entries(selectedRow).map(([key, value]) => {
                const isStatus = key.toLowerCase() === "status";
                const isDocumentKey = [
                  'photoFileKey',
                  'aadharCardFileKey',
                  'panCardFileKey',
                  'salarySlipsFileKey',
                  'bankStatementFileKey'
                ].includes(key);

                const statusColor = isStatus ? getStatusColor(String(value)) : undefined;
                const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                return (
                  <React.Fragment key={key}>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: 11 }}>
                        {displayKey}:
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      {isDocumentKey && value ? (
                        <Link
                          href={`${AWS_S3_BUCKET_URL}/${value}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            color: 'primary.main',
                            textDecoration: 'underline',
                            cursor: 'pointer',
                            wordBreak: 'break-all'
                          }}
                        >
                          {getDocumentName(key)}
                        </Link>
                      ) : (
                        <Typography
                          variant="body2"
                          sx={{ color: isStatus ? statusColor : 'inherit', fontSize: 11 }}
                        >
                          {key.toLowerCase() === "submit"
                            ? value === true
                              ? "Complete"
                              : "In Complete"
                            : key.toLowerCase() === "placeofbirth" && value && typeof value === "object"
                              ? `${(value as any).city}`
                              : String(value ?? "N/A")}
                        </Typography>
                      )}
                    </Grid>
                  </React.Fragment>
                );
              })}
          </Grid>
        </DialogContent>
      </Dialog >
      <Dialog
        open={openLoanFormDialog}
        onClose={() => {
          setSelectedOption("");
          setOpenLoanFormDialog(false)
        }}
        maxWidth="xs"
        fullWidth
        disableEscapeKeyDown
      >
        <DialogTitle>Select Loan Type</DialogTitle>
        <DialogContent>
          <FormControl
            fullWidth sx={{ mt: 2 }}
            className="customSelect">
            <InputLabel>Choose Option</InputLabel>
            <Select
              value={selectedOption}
              onChange={handleSelectChange}
              label="Choose Option"
            >
              <MenuItem value="personalLoan">Personal Loan</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSelectedOption("");
              setOpenLoanFormDialog(false);
            }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!selectedOption) return;
              setOpenLoanFormDialog(false);
              setOpenDialog(true);
            }}
            disabled={!selectedOption}
          >
            Next
          </Button>
        </DialogActions>
      </Dialog>
      <PersonalLoanFormDialog
        open={openDialog}
        onClose={handleDialogClose}
        initialData={editData}
        mode={isEdit ? "edit" : "create"}
        setOpenDialog={setOpenDialog}
        onSuccess={fetchLoansData}
      />
      <Snackbar
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

export default Loan;
