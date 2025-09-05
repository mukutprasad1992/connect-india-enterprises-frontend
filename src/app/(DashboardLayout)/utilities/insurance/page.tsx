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
  CircularProgress,
  InputLabel,
  MenuItem,
  Select,
  Link
} from "@mui/material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import GridOnIcon from '@mui/icons-material/GridOn';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import { SetStateAction, useEffect, useState } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridToolbar, GridToolbarColumnsButton, GridToolbarContainer } from "@mui/x-data-grid";
import DashboardCard from "../../components/shared/DashboardCard";
import { useRouter } from 'next/navigation';
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { formatDateTime } from "@/utils/utils";
import LifeInsuranceFormDialog from "../../components/serviceTypeForm/lifeInsuranceFormDialog";

const Insurance = () => {
  const [insurances, setInsurances] = useState<any>(null);
  const [selectedId, setSelectedId] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [openDeleteInsuranceDialog, setOpenDeleteInsuranceDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const router = useRouter();
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const [loading, setLoading] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [insuranceUpdated, setInsuranceUpdated] = useState(false);
  const [insuranceOptions, setInsuranceOptions] = useState([]);
  const [insuranceErrorMessage, setInsuranceErrorMessage] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openInsuranceFormDialog, setOpenInsuranceFormDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [editData, setEditData] = useState<any>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
  const AWS_S3_BUCKET_URL = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_URL || 'https://connect-india-enterprises-bucket.s3.ap-south-1.amazonaws.com';
  const handleCloseAddInsuranceDialog = () => {
    setSelectedOption('');
    setOpenInsuranceFormDialog(false);
    setOpenDialog(false);
    setIsEdit(false);
    setSelectedRow(null);
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
          email: item.email,
          aadharNumber: item.aadharNumber,
          panNumber: item.panNumber,
          alcohol: item.alcohol,
          annualIncome: item.annualIncome,
          mobile: item.mobile,
          heightCM: item.heightCM,
          motherName: item.motherName,
          nomineeDOB: item.nomineeDOB,
          nomineeName: item.nomineeName,
          nomineeRelation: item.nomineeRelation,
          occupation: item.occupation,
          placeOfBirth: item.placeOfBirth,
          smoker: item.smoker,
          weightKG: item.weightKG,
          status: item.status,
          comment: item.comment,
          serviceSubType: item.serviceSubType,
          panCardFileKey: item.panCardFileKey,
          aadhaarCardFileKey: item.aadhaarCardFileKey,
          bankProofFileKey: item.bankProofFileKey,
          itrDcumentsFileKey: item.itrDcumentsFileKey,
          salarySlipsFileKey: item.salarySlipsFileKey,
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
        console.error("Failed to fetch insurance options:", response.data);
      }
    } catch (error) {
      setLoading(false)
      console.error("Error fetching insurance options:", error);
    }
  };

  useEffect(() => {
    fetchInsuranceOptions();
  }, [insuranceUpdated, token]);

  const deleteInsurance = async () => {
    if (!token || !selectedId) {
      console.error("No insurance selected for deletion.");
      return;
    }

    setInsuranceErrorMessage(false)
    setDialogLoading(true)
    try {
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
      setDialogLoading(false)
      console.log(`Insurance with ID ${selectedId} deleted successfully.`);
    } catch (error: any) {
      setDialogLoading(false)
      setInsuranceErrorMessage(error.response?.data?.message || "Error deleting insurance")
      console.error("Error during insurance deletion:", error);
    }

    setOpenDeleteInsuranceDialog(false);
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
    { field: "email", headerName: "email", flex: 0.12 },
    { field: "mobile", headerName: "Mobile", flex: 0.12 },
    { field: "aadharNumber", headerName: "Aadhar Number", flex: 0.12 },
    { field: "panNumber", headerName: "PAN Number", flex: 0.12 },
    { field: "alcohol", headerName: "Alcohol", flex: 0.12 },
    { field: "annualIncome", headerName: "Annual Income", flex: 0.12 },
    { field: "motherName", headerName: "Mother Name", flex: 0.12 },
    // { field: "heightCM", headerName: "Height CM", flex: 0.12 },
    // { field: "weightKG", headerName: "Weight KG", flex: 0.12 },
    // { field: "smoker", headerName: "Smoker", flex: 0.12 },
    { field: "occupation", headerName: "Occupation", flex: 0.12 },
    { field: "nomineeName", headerName: "Nominee Name", flex: 0.12 },
    { field: "nomineeDOB", headerName: "Nominee DOB", flex: 0.12 },
    { field: "nomineeRelation", headerName: "Nominee Relation", flex: 0.12 },
    { field: "placeOfBirth", headerName: "Place Of Birth", flex: 0.12 },
    { field: "nomineeRelation", headerName: "Nominee Relation", flex: 0.12 },
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
        console.log("  params ", params.row)
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

  const handleEditButton = (rowData: any) => {
    setEditData(rowData);
    setIsEdit(true);
    setSelectedOption("lifeInsurance");
    setOpenDialog(true);
  };

  const handleAddButton = () => {
    setIsEdit(false);
    setSelectedRow(null);
    setSelectedOption('');
    setOpenInsuranceFormDialog(true);
  };

  const handleDeleteButton = (id: any) => {
    setSelectedId(id);
    setOpenDeleteInsuranceDialog(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  }

  const handleConfirmYes = () => {
    setIsEdit(false);
    setOpenInsuranceFormDialog(true)
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
      orientation: 'landscape',  // Changed to landscape for better fit
      unit: 'mm'
    });

    // Set document properties
    doc.setProperties({
      title: 'Insurance List Report',
      subject: 'Insurance Data Export',
      author: 'Your Application Name',
      keywords: 'insurance, report, data',
      creator: 'Your Application Name'
    });

    // Add header with logo and timestamp
    doc.setFontSize(12);
    doc.text("INSURANCE LIST", 14, 20);

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
      "Aadhar Number",
      "PAN Number",
      "Alcohol",
      "Income",
      "Mobile",
      "Height (CM)",
      "Mother's Name",
      "Nominee DOB",
      "Nominee Name",
      "Nominee Relation",
      "Occupation",
    ];

    const bodyData = (insurances || []).map((row: any) => [
      row.id || 'N/A',
      row.email || 'N/A',
      row.aadharNumber || 'N/A',
      row.panNumber || 'N/A',
      row.alcohol === 1 ? 'Yes' : 'No',
      row.annualIncome || 'N/A',
      row.mobile || 'N/A',
      row.heightCM || 'N/A',
      row.motherName || 'N/A',
      row.nomineeDOB || 'N/A',
      row.nomineeName || 'N/A',
      row.nomineeRelation || 'N/A',
      row.occupation || 'N/A'
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

    const fileName = `Insurance_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
    const pdfBlob = doc.output('blob');
    const fileURL = URL.createObjectURL(pdfBlob);
    window.open(fileURL);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(insurances || []);

    const headerKeys = Object.keys((insurances && insurances[0]) || {});
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Insurances");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileURL = URL.createObjectURL(blob);
    saveAs(blob, "insurances.xlsx");
  };

  const handleSelectChange = (event: any) => {
    setSelectedOption(event.target.value);
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditData(null);
    setIsEdit(false);
  };
  const handleFormSubmit = async (data: any, isEdit: boolean) => {
    try {
      setLoading(true);

      // Prepare the payload with correct field names
      const payload = {
        aadhaarCardFileKey: data.aadhaarCardFileKey,
        panCardFileKey: data.panCardFileKey,
        aadharNumber: data.aadharNumber,
        panNumber: data.panNumber,
        alcohol: data.alcohol,
        annualIncome: data.annualIncome,
        bankProofFileKey: data.bankProofFileKey,
        mobile: data.mobile,
        email: data.email,
        heightCM: data.heightCM,
        itrDocumentsFileKey: data.itrDocumentsFileKey, // Fixed typo from itrDcumentsFileKey
        motherName: data.motherName,
        nomineeDOB: data.nomineeDOB,
        nomineeName: data.nomineeName,
        nomineeRelation: data.nomineeRelation,
        occupation: data.occupation,
        placeOfBirth: data.placeOfBirth,
        salarySlipsFileKey: data.salarySlipsFileKey,
        smoker: data.smoker,
        weightKG: data.weightKG,
        serviceId: 3,
        serviceSubType: isEdit ? data.serviceSubType : selectedOption,
        status: 'Pending',
        comment: data.comment || '',
      };

      console.log("Submitting payload:", payload);

      let response;
      const url = isEdit
        ? `${BASE_URL}/serviceType/updateServiceTypeById/${data.id}`
        : `${BASE_URL}/serviceType/createServiceType`;

      const method = isEdit ? 'put' : 'post';

      response = await axios[method](url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status) {
        setSnackbarOpen(true);
        setSnackbarSeverity('success');
        setSnackbarMessage(isEdit
          ? 'Insurance updated successfully'
          : 'Insurance created successfully');
        setInsuranceUpdated(prev => !prev);
        handleDialogClose();
        return true;
      } else {
        throw new Error(response.data.message || 'Operation failed');
      }
    } catch (error: any) {
      console.error("Error during insurance operation:", error);
      const errorMessage = error.response?.data?.message
        || error.message
        || 'An error occurred';

      setSnackbarOpen(true);
      setSnackbarSeverity('error');
      setSnackbarMessage(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getDocumentName = (key: any) => {
    const documentNames = {
      aadhaarCardFileKey: 'View Aadhaar Card',
      panCardFileKey: 'View PAN Card',
      bankProofFileKey: 'View Bank Proof',
      salarySlipsFileKey: 'View Salary Slips',
      itrDcumentsFileKey: 'View ITR Documents'
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
      <PageContainer title="Insurance" description="this is insurance page">
        <Box>
          <Grid container spacing={1}>
            <Grid item xs={12} sx={{ mb: 2 }}>
              <Box display="flex" justifyContent="flex-end" >
                <Tooltip title='Add'>
                  <IconButton
                    sx={{ textTransform: "none", color: "#44a7a2" }}
                    onClick={handleAddButton}
                  >
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Export to excel'>
                  <IconButton onClick={exportToExcel}>
                    <GridOnIcon sx={{ color: "#44a7a2" }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title='Export to PDF'>
                  <IconButton onClick={exportToPDF}>
                    <PictureAsPdfIcon sx={{ color: "#44a7a2" }} />
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
                    <Typography variant="h4">Insurance</Typography>
                  </Grid>
                  <Box sx={{ flexGrow: 1, width: "100%", height: "auto", minHeight: "60vh", display: "flex" }}>
                    <DataGrid
                      rows={insurances || []}
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
          open={openDeleteInsuranceDialog}
          onClose={() => setOpenDeleteInsuranceDialog(false)}
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
      </PageContainer >
      {/* View Dialog */}
      <Dialog open={openViewDialog} onClose={handleCloseViewDialog} fullWidth maxWidth="sm">
        <Grid container spacing={2} sx={{ padding: 2 }}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6">Insurance Details</Typography>
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
                  'aadhaarCardFileKey',
                  'panCardFileKey',
                  'bankProofFileKey',
                  'salarySlipsFileKey',
                  'itrDcumentsFileKey'
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
        open={openInsuranceFormDialog}
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') handleCloseAddInsuranceDialog();
        }}
        maxWidth="xs"
        fullWidth
        disableEscapeKeyDown
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

        <DialogTitle>Select Insurance Type</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Choose Option</InputLabel>
            <Select
              value={selectedOption}
              onChange={handleSelectChange}
              label="Choose Option"
            >
              <MenuItem value="lifeInsurance">Life Insurance</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddInsuranceDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (!selectedOption) {
                setSnackbarOpen(true);
                setSnackbarSeverity('error');
                setSnackbarMessage("Please select an insurance type");
                return;
              }
              setOpenInsuranceFormDialog(false);
              setOpenDialog(true);
            }}
            disabled={!selectedOption}
          >
            Next
          </Button>
        </DialogActions>
      </Dialog>
      <LifeInsuranceFormDialog
        open={openDialog}
        onClose={handleDialogClose}
        onSubmit={handleFormSubmit}
        initialData={editData}
        mode={isEdit ? 'edit' : 'create'}
        setOpenDialog={setOpenDialog}
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
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Insurance;