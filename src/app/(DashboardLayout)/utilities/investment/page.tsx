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
  Typography,
  MenuItem,
  CircularProgress,
  Select,
  InputLabel,
  FormControl,
  Container,
  Alert,
  Snackbar,
  Tooltip,
  Link,
  Stack,
  Paper
} from "@mui/material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import GridOnIcon from '@mui/icons-material/GridOn';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from '@mui/icons-material/Visibility';
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useRouter } from 'next/navigation';
dayjs.extend(customParseFormat);
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid } from "@mui/x-data-grid";
import DashboardCard from "../../components/shared/DashboardCard";
import { jwtDecode } from "jwt-decode";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { formatDateTime } from "@/utils/utils";
import MutualFundFormDialog from "../../components/serviceTypeForm/mutualFundFormDialog";
import React from "react";
import StepProgress from "../../components/StepProgress";
import { loadLayoutFromLocalStorage, saveLayoutToLocalStorage } from "@/app/utils/utils";
import CustomToolbar from "../../components/CustomToolbar";

const defaultColumnVisibility = {
  id: false,
  serviceSubTypeName: true,
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
const pageName = "investmentPage";
const Investment = () => {
  const [allInvestment, setAllInvestment] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [openDeleteInvestmentDialog, setOpenDeleteInvestmentDialog] = useState(false);
  const [openInvestmentFormDialog, setOpenInvestmentFormDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const router = useRouter();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [openDialog, setOpenDialog] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [columnsVisibilityModel, setColumnsVisibilityModel] = useState<any>(defaultColumnVisibility);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  const AWS_S3_BUCKET_URL = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL;
  const getToken = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem('accessToken');
    }
  }
  const token = getToken();

  const getRoleId = () => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem("roleId");
      return storedRole ? parseInt(storedRole, 10) : null;
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

  const getUser = () => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
  }
  const userObj = getUser();
  const userName = `${userObj?.firstName}  ${userObj?.lastName}`;
  //redict to profile page if user details are incomplete
  const fetchProfile = async () => {
    if (!token) {
      localStorage.clear();
      router.push('/authentication/login');
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
        router.push("/authentication/login");
        return;
      }

      const res = await axios.get(`${BASE_URL}/profile/getProfileById`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const firstName = res?.data?.result?.firstName?.trim();
      const lastName = res?.data?.result?.lastName?.trim();
      if (firstName && lastName) {
        setOpenInvestmentFormDialog(true);
      } else {
        router.push("/utilities/profile?showSnackbar=completeProfile");
      }

    } catch (error: any) {
      console.error("Error fetching profile:", error);

      if (axios.isAxiosError(error)) {
        alert(`Failed to fetch profile: ${error.response?.data?.message || error.message}`);
      } else {
        alert("Unexpected error occurred.");
      }
    }
  };
  const handleAddInvestment = () => {
    fetchProfile();
  };

  const fetchAllInvestmentData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/serviceType/getServiceTypeByServiceId/${1}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status) {
        const formattedData = response.data.data.map((item: any) => ({
          id: item.id,
          status: item.status,
          submit: item.submit === 1 ? true : false,
          serviceSubTypeName: item.serviceSubTypeName,
          activeSteps: item.activeSteps,
          aadharNumber: item.aadharNumber,
          panNumber: item.panNumber,
          mobile: item.mobile
            ?.toString()
            .replace(/\s+/g, "")
            .replace(/^\+91/, "")
            .slice(-10),
          email: item.personalEmail || item.email,
          firstName: item.firstName || "",
          lastName: item.lastName || "",
          income: item.income,
          occupation: item.occupation,
          placeOfBirth: item.placeOfBirth,
          nomineeIdType: item.nomineeIdType,
          nomineeId: item.nomineeId,
          nomineeMobile: item.nomineeMobile
            ?.toString()
            .replace(/\s+/g, "")
            .replace(/^\+91/, "")
            .slice(-10),
          nomineeRelation: item.nomineeRelation,
          aadharCardFileKey: item.aadharCardFileKey || null,
          panCardFileKey: item.panCardFileKey || null,
          bankProofFileKey: item.bankProofFileKey || null,
          salarySlipsFileKey: item.salarySlipsFileKey || null,
          itrDocumentsFileKey: item.itrDocumentsFileKey || null,

        }));

        setAllInvestment(formattedData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllInvestmentData();
  }, [token]);

  const deleteInvestment = async () => {
    if (!selectedId) {
      setSnackbarMessage("No investment selected for deletion.");
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    setDialogLoading(true);
    try {
      const response = await axios.delete(
        `${BASE_URL}/serviceType/deleteServiceTypeById/${selectedId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSnackbarMessage(response.data.message);
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      fetchAllInvestmentData();
    } catch (error: any) {
      setSnackbarMessage(
        error?.response?.data?.message || "Failed to delete investment. Please try again."
      );
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setDialogLoading(false);
      setOpenDeleteInvestmentDialog(false);
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

  const columns = [
    { field: "id", headerName: "ID", width: 100, flex: 0, maxWidth: 40 },
    { field: "aadharNumber", headerName: "Aadhar Number", flex: 0 },
    { field: "panNumber", headerName: "PAN Number", flex: 0 },
    { field: "email", headerName: "Email", flex: 0 },
    { field: "mobile", headerName: "Mobile", flex: 0 },
    { field: "income", headerName: "Income", flex: 0 },
    { field: "occupation", headerName: "Occupation", flex: 0 },
    { field: "serviceSubTypeName", headerName: "Type", flex: 0 },
    {
      field: 'placeOfBirth',
      headerName: 'Place of Birth',
      flex: 0,
      valueGetter: (params: any) => {
        const placeOfBirth = params?.city;
        let city = '';
        if (placeOfBirth) {
          try {
            const parsed = typeof placeOfBirth === 'string' ? placeOfBirth : placeOfBirth;
            city = parsed || '';
          } catch (e) {
            city = '';
          }
        }

        return city.trim() || '';
      },
    },
    { field: "nomineeId", headerName: "Nominee Pan or Aadhar", flex: 0 },
    { field: "nomineeMobile", headerName: "Nominee Mobile", flex: 0 },
    { field: "nomineeRelation", headerName: "Nominee Relation", flex: 0 },
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
          <StepProgress activeStep={params.value} />
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      minWidth: 80,
      flex: 0,
      renderCell: (params: any) => {
        const status = params.row.status;
        const isEditDeleteHidden = status === "Approved" || status === "Rejected" || status === "In Progress";

        return (
          <Box display="flex" width="100%" height="100%">
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "#8b8a3fff";
      case "In Progress": return "orange";
      case "Approved": return "#6ad392ff";
      case "Rejected": return "#ff8780";
      default: return "#8b8a3fff";
    }
  };

  const handleEditButton = (rowData: any) => {
    setEditData(rowData);
    setIsEdit(true);
    setSelectedOption("mutualFund");
    setOpenDialog(true);
  };

  const handleDeleteButton = (id: string) => {
    setSelectedId(id);
    setOpenDeleteInvestmentDialog(true);
  };

  const exportToPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm'
    });
    doc.setProperties({
      title: 'Investment List Report',
      subject: 'Investment Data Export',
      author: 'Your Application Name',
      keywords: 'investment, report, data'
    });
    doc.setFontSize(12);
    doc.text("INVESTMENT LIST", 14, 20);

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
      "Email",
      "Aadhar",
      "PAN",
      "Mobile",
      "Income",
      "Occupation",
      "Place of Birth",
      "Nominee ID",
      "Nominee Mobile",
      "Nominee Relation",
      "Status",
    ];

    const bodyData = (allInvestment || []).map((row: any) => [
      row.id,
      row.email,
      row.aadharNumber,
      row.panNumber,
      row.mobile,
      row.income,
      row.occupation,
      row.placeOfBirth,
      row.nomineeId,
      row.nomineeMobile,
      row.nomineeRelation,
      row.status,
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
        fontSize: 8,
        cellPadding: 3
      },
      bodyStyles: {
        halign: 'center',
        fontSize: 7,
        cellPadding: 2,
        overflow: 'linebreak'
      },
      columnStyles: {
        1: { cellWidth: 25 },
        2: { cellWidth: 20 },
        6: { cellWidth: 20 },
        7: { cellWidth: 20 },
        11: { cellWidth: 15 },
        12: { cellWidth: 10 },
        13: { cellWidth: 10 },
        14: { cellWidth: 10 },
        15: { cellWidth: 10 },
        16: { cellWidth: 10 }
      },
      styles: {
        cellPadding: 1,
        valign: 'middle'
      },
      margin: { top: 40 },
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

    const fileName = `Investment_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(allInvestment || []);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Investments");
    XLSX.writeFile(workbook, "investments.xlsx");
  };

  const handleSelectChange = (event: any) => {
    setSelectedOption(event.target.value);
  };


  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedOption('');
    setEditData(null);
    setIsEdit(false);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const getDocumentName = (key: any) => {
    const documentNames = {
      aadharCardFileKey: 'View Aadhaar Card',
      panCardFileKey: 'View PAN Card',
      bankProofFileKey: 'View Bank Proof',
      salarySlipsFileKey: 'View Salary Slips',
      itrDocumentsFileKey: 'View ITR Documents'
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

  return (
    <>
      <Box >
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
                    >Investment</Typography>
                  </Grid>

                  <Box display="flex" justifyContent="flex-end" alignItems="center" sx={{ p: 2 }}>
                    <Tooltip title="Add">
                      <IconButton
                        size="small"
                        sx={{ textTransform: "none", color: "#465fff", p: 0.2 }}
                        onClick={handleAddInvestment}
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
                <Box
                  sx={{
                    flexGrow: 1,
                    width: "100%",
                    height: "74vh", // 👈 fixed height
                    display: "block",
                  }}
                >
                  <DataGrid
                    rows={allInvestment || []}
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
                    initialState={{
                      density: "compact",
                    }}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteInvestmentDialog}
        onClose={() => setOpenDeleteInvestmentDialog(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete investment</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete?</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteInvestmentDialog(false)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={deleteInvestment}
            variant="contained"
            color="primary"
            disabled={dialogLoading}
          >
            {dialogLoading ? <CircularProgress size={24} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={openViewDialog} onClose={handleCloseViewDialog} fullWidth maxWidth="md">
        <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Investment Details</Typography>
              <IconButton onClick={handleCloseViewDialog} size="small">
                <CloseIcon />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {selectedRow &&
              Object.entries(selectedRow).map(([key, value]) => {
                const isStatus = key.toLowerCase() === "status";
                const isDocumentKey = [
                  'aadharCardFileKey',
                  'panCardFileKey',
                  'bankProofFileKey',
                  'salarySlipsFileKey',
                  'itrDocumentsFileKey'
                ].includes(key);

                const statusColor = isStatus ? getStatusColor(String(value)) : undefined;

                return (
                  <React.Fragment key={key}>
                    <Grid item xs={6}>
                      <Typography variant="body2">
                        <Box component="span" sx={{ fontWeight: 'bold', fontSize: 11 }}>
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
                        </Box>
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
      </Dialog>
      <Dialog
        open={openInvestmentFormDialog}
        onClose={() => {
          setSelectedOption("");
          setOpenInvestmentFormDialog(false)
        }}
        maxWidth="xs"
        fullWidth
        disableEscapeKeyDown
      >
        <DialogTitle>Select Investment Type</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }} className="customSelect">
            <InputLabel>Choose Option</InputLabel>
            <Select
              value={selectedOption}
              onChange={handleSelectChange}
              label="Choose Option"

            >
              <MenuItem value="mutualFund">Mutual Fund / SIP</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSelectedOption("");
              setOpenInvestmentFormDialog(false);
            }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!selectedOption) return;
              setOpenInvestmentFormDialog(false);
              setOpenDialog(true);
            }}
            disabled={!selectedOption}
          >
            Next
          </Button>
        </DialogActions>
      </Dialog>

      <MutualFundFormDialog
        open={openDialog}
        onClose={handleDialogClose}
        initialData={editData}
        mode={isEdit ? "edit" : "create"}
        setOpenDialog={setOpenDialog}
        onSuccess={fetchAllInvestmentData}
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

export default Investment;