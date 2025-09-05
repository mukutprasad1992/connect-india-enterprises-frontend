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
  Link
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
import { DataGrid, GridToolbar, GridToolbarColumnsButton, GridToolbarContainer } from "@mui/x-data-grid";
import DashboardCard from "../../components/shared/DashboardCard";
import { jwtDecode } from "jwt-decode";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { formatDateTime } from "@/utils/utils";
import MutualFundFormDialog from "../../components/serviceTypeForm/mutualFundFormDialog";
import React from "react";
import { stat } from "fs";

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

  const fetchAllInvestmentData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/serviceType/getServiceTypeByServiceId/${1}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("<---response.data---->", response.data)
      if (response.data.status) {
        const formattedData = response.data.data.map((item: any) => ({
          id: item.id,
          email: item.email,
          aadharNumber: item.aadharNumber,
          aadharCardFileKey: item.aadharCardFileKey || null,
          panCardFileKey: item.panCardFileKey || null,
          bankProofFileKey: item.bankProofFileKey || null,
          salarySlipsFileKey: item.salarySlipsFileKey || null,
          itrDocumentsFileKey: item.itrDocumentsFileKey || null,
          panNumber: item.panNumber,

          mobile: item.mobile
            ?.replace(/^\+91/, "")
            .slice(-10),
          income: item.income,
          occupation: item.occupation,
          placeOfBirth: item.placeOfBirth,
          nomineeIdType: item.nomineeIdType,
          nomineeId: item.nomineeId,
          nomineeMobile: item.nomineeMobile
            ?.replace(/^\+91/, "")
            .slice(-10),

          nomineeRelation: item.nomineeRelation,
          status: item.status,
          stepStatus: item.activeSteps,
          isDetailsConfirmed: item.submit || false,
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
    { field: "id", headerName: "ID", flex: 0.12 },
    { field: "email", headerName: "Email", flex: 0.12 },
    { field: "aadharNumber", headerName: "Aadhar Number", flex: 0.12 },
    { field: "panNumber", headerName: "PAN Number", flex: 0.12 },
    { field: "mobile", headerName: "Mobile", flex: 0.12 },
    { field: "income", headerName: "Income", flex: 0.12 },
    { field: "occupation", headerName: "Occupation", flex: 0.12 },
    {
      field: "placeOfBirth",
      headerName: "Place Of Birth",
      flex: 0.12,
      valueGetter: (params: any) => {
        return params?.city;
      },
    },
    { field: "nomineeId", headerName: "Nominee Pan or Aadhar", flex: 0.12 },
    { field: "nomineeMobile", headerName: "Nominee Mobile", flex: 0.12 },
    { field: "nomineeRelation", headerName: "Nominee Relation", flex: 0.12 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.12,
      renderCell: (params: any) => {
        const status = params.row.status;
        const color = getStatusColor(status);
        return (
          <Box sx={{ display: "flex", alignItems: "center", width: "100%", height: "100%" }}>
            <Typography variant="body1" sx={{ color, textAlign: "center" }}>
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
          <Box display="flex" width="100%" height="100%">
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending": return "#fbf774";
      case "In Progress": return "#fbe06f";
      case "Approved": return "#8df1b4";
      case "Rejected": return "#ff8780";
      default: return "#fbf774";
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

  const handleCloseAddInvestmentDialog = () => {
    setSelectedOption('');
    setOpenInvestmentFormDialog(false);
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


  return (
    <>
      <PageContainer title="Investment" description="This is investment page">
        <Box>
          <Grid container spacing={1}>
            <Grid item xs={12} sx={{ mb: 2 }}>
              <Box display="flex" justifyContent="flex-end" alignItems="center">
                <Tooltip title="Add">
                  <IconButton
                    sx={{ textTransform: "none", color: "#44a7a2" }}
                    onClick={() => setOpenInvestmentFormDialog(true)}
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
              <DashboardCard>
                <Container>
                  <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h4">Investment</Typography>
                  </Grid>
                  <Box sx={{ flexGrow: 1, width: "100%", height: "auto", minHeight: "60vh", display: "flex" }}>
                    <DataGrid
                      rows={allInvestment || []}
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
        <Dialog open={openViewDialog} onClose={handleCloseViewDialog} fullWidth maxWidth="xs">
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
                          <Box component="span" sx={{ fontWeight: 'bold' }}>
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
                className="customSelect"
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
          autoHideDuration={6000}
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
      </PageContainer>
    </>
  );
};

export default Investment;