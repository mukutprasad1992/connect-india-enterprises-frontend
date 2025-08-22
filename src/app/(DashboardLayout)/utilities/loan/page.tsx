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
  Link
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
import { DataGrid, GridToolbarColumnsButton, GridToolbarContainer, GridToolbar } from "@mui/x-data-grid";

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
  const [editData, setEditData] = useState<any>(null);
  const [openLoanFormDialog, setOpenLoanFormDialog] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const AWS_S3_BUCKET_URL = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL || 'https://connect-india-enterprises-bucket.s3.ap-south-1.amazonaws.com';
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
      const response = await axios.get(`${BASE_URL}/serviceType/getServiceTypeByServiceId/${4}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status) {
        const formattedData = response.data.data.map((item: any) => ({
          id: item.id,
          motherName: item.motherName,
          landmark: item.landmark,
          email: item.email,
          currentAddress: item.currentAddress,
          cityYears: item.cityYears,
          alternateNo: item.alternateNo,
          maritalStatus: item.maritalStatus,
          designation: item.designation,
          companyExp: item.companyExp,
          totalWorkExp: item.totalWorkExp,
          officeAddress: item.officeAddress,
          officeMobile: item.officeMobile,
          ref1Name: item.ref1Name,
          ref1Mobile: item.ref1Mobile,
          ref1Address: item.ref1Address,
          ref2Name: item.ref2Name,
          ref2Mobile: item.ref2Mobile,
          ref2Address: item.ref2Address,
          panNumber: item.panNumber,
          aadharNumber: item.aadharNumber,
          photoFileKey: item.photoFileKey,
          panCardFileKey: item.panCardFileKey,
          aadhaarCardFileKey: item.aadhaarCardFileKey,
          salarySlipsFileKey: item.salarySlipsFileKey,
          bankStatementFileKey: item.bankStatementFileKey,
          serviceId: item.serviceId,
          serviceSubType: item.serviceSubType,
          status: item.status,
        }));
        setLoans(formattedData);
        console.log("Fetched loans data:", response.data);
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
    { field: "id", headerName: "ID", flex: 0.12 },
    { field: "serviceSubType", headerName: "Type", flex: 0.12 },
    { field: "email", headerName: "Email", flex: 0.12 },
    { field: "landmark", headerName: "Landmark", flex: 0.12 },
    { field: "motherName", headerName: "Mother Name", flex: 0.12 },
    { field: "cityYears", headerName: "City Years", flex: 0.12 },
    { field: "alternateNo", headerName: "Alternate No", flex: 0.12 },
    { field: "maritalStatus", headerName: "Marital Status", flex: 0.12 },
    { field: "panNumber", headerName: "PAN Number", flex: 0.12 },
    { field: "aadharNumber", headerName: "Aadhar Number", flex: 0.12 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.12,
      renderCell: (params: any) => {
        const status = params.row.status;
        let color = "#fbf774";

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
      row.cityYears || 'N/A',
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
        fillColor: [165, 42, 42], // Brown color
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
  const handleFormSubmit = async (formData: any, isEditMode: boolean) => {
    setDialogLoading(true);
    try {
      const url = isEditMode
        ? `${BASE_URL}/serviceType/updateServiceTypeById/${formData.id}`
        : `${BASE_URL}/serviceType/createServiceType`;

      const method = isEditMode ? 'put' : 'post';
      const payload = JSON.stringify({
        ...formData,
        serviceId: 4,
        ServiceSubType: selectedOption,
        status: "Pending",
      });
      console.log("Payload:", payload);
      const response = await axios[method](url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setSnackbarMessage(response.data.message);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      fetchLoansData();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.errors?.body ||
        (isEditMode ? "Failed to update service type" : "Failed to create service type");

      setSnackbarMessage(errorMessage);
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      console.error('API Error:', error.response?.data || error.message);
    } finally {
      setDialogLoading(false);
      setOpenDialog(false);
      setEditData(null);
      setIsEdit(false);
    }
  };
  const getDocumentName = (key: any) => {
    const documentNames = {
      aadhaarCardFileKey: 'View Aadhaar Card',
      panCardFileKey: 'View PAN Card',
      salarySlipsFileKey: 'View Salary Slip',
      bankStatementFileKey: 'View bank Statement',
    };
    return documentNames[key as keyof typeof documentNames] || 'View Document';
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
                <Tooltip title="Add">
                  <IconButton
                    sx={{ textTransform: "none", color: "#44a7a2" }}
                    onClick={() => setOpenLoanFormDialog(true)}
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
                    <Typography variant="h4">Loan</Typography>
                  </Grid>
                  <Box sx={{ flexGrow: 1, width: "100%", height: "auto", minHeight: "60vh", display: "flex" }}>
                    <DataGrid
                      rows={loans || []}
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
      </PageContainer>
      <Dialog open={openViewDialog} onClose={handleCloseViewDialog} fullWidth maxWidth="sm">
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
                  'aadhaarCardFileKey',
                  'panCardFileKey',
                  'salarySlipsFileKey',
                  'bankStatementFileKey'
                ].includes(key);

                const statusColor = isStatus ? getStatusColor(String(value)) : undefined;
                const displayKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());

                return (
                  <React.Fragment key={key}>
                    <Grid item xs={6}>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
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
                        <Typography variant="body2" sx={{ color: isStatus ? statusColor : 'inherit' }}>
                          {String(value || 'N/A')}
                        </Typography>
                      )}
                    </Grid>
                  </React.Fragment>
                );
              })}
          </Grid>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openLoanFormDialog}
        onClose={handleCloseAddLoanDialog}
        maxWidth="xs"
        fullWidth
        disableEscapeKeyDown
      >
        <DialogTitle>Select Loan Type</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
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
          <Button onClick={handleCloseAddLoanDialog} variant="outlined">
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
        onClose={() => {
          setOpenDialog(false);
          setEditData(null);
          setIsEdit(false);
        }}
        onSubmit={handleFormSubmit}
        initialData={editData}
        mode={isEdit ? 'edit' : 'create'}
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
