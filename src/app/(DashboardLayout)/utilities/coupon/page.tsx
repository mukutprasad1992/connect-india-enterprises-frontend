"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Button,
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  TextField,
  Divider,
  CircularProgress,
  Autocomplete,
  Alert,
  Snackbar,
  Paper,
} from "@mui/material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import GridOnIcon from '@mui/icons-material/GridOn';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Tooltip from '@mui/material/Tooltip';
import {
  DataGrid,
} from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import RedeemIcon from "@mui/icons-material/Redeem";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardCard from "../../components/shared/DashboardCard";
import PageContainer from "../../components/container/PageContainer";
import VoucherPdfView from "../../components/generatePdf/VoucherPdfView";
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { jwtDecode } from "jwt-decode";
import { formatDate, formatDateInd, formatToDDMMYYYY } from "../../../../utils/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { formatDateTime } from "@/utils/utils";
import { loadLayoutFromLocalStorage, saveLayoutToLocalStorage } from "@/app/utils/utils";
import CustomToolbar from "../../components/CustomToolbar";

const defaultColumnVisibility = {
  id: false,
  vendorBusinessName: true,
  vendorCode: false,
  vendorBusinessRepresentative: false,
  vendorAddress: false,
  vendorMobileNo: false,
  vendorEmail: false,
  vendorPincode: false,
  customerName: false,
  customerAddress: false,
  customerPhone: false,
  customerEmail: false,
  customerPincode: false,
  amount: true,
  voucherCode: true,
  validityFrom: true,
  validityTo: true,
  status: true,
  actions: true,
};

const pageName = "voucherPage";

const VoucherTable: React.FC = () => {
  const LOCAL_KEY = "couponPrefrence";
  const router = useRouter();
  const [rows, setRows] = useState<any>([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [openPdfPopUp, setopenPdfPopUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [customerOptions, setCustomerOptions] = useState([]);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [voucherErrorMessage, setVoucherErrorMessage] = useState(false);
  const [successVoucherMessage, setSuccessVoucherMessage] = useState(false);
  const [openVoucherSuccessSnackbar, setOpenVoucherSuccessSnackbar] = useState(false)
  const [voucherUpdated, setVoucherUpdated] = useState(false);
  const [viewSelectedVocher, setViewSelectedVocher] = useState<any>(null);
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const [columnsVisibilityModel, setColumnsVisibilityModel] = useState<any>(defaultColumnVisibility);
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [formData, setFormData] = useState<any>({
    id: "",
    vendorName: "",
    vendorRepresentative: "",
    vendorCode: "",
    vendorAddress: "",
    vendorPhone: "",
    vendorEmail: "",
    vendorPincode: "",
    customerName: "",
    customerAddress: "",
    customerPhone: "",
    customerEmail: "",
    customerPincode: "",
    amount: "",
    voucherCode: "",
    validityFrom: "",
    validityTo: "",
    status: "",
  });
  const [error, setError] = useState<any>({
    vendorName: "",
    vendorRepresentative: "",
    vendorCode: "",
    vendorAddress: "",
    vendorPhone: "",
    vendorEmail: "",
    vendorPincode: "",
    customerName: "",
    customerAddress: "",
    customerPhone: "",
    customerEmail: "",
    customerPincode: "",
    amount: "",
    voucherCode: "",
    validityFrom: "",
    validityTo: "",
    status: "",
  });
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
        if (roleId !== 1 && roleId !== 2) {
          localStorage.clear();
          router.push("/authentication/login");
        }
        localStorage.clear();
        router.push("/authentication/login");
      }
    } else {
      localStorage.clear();
      router.push("/authentication/login");
    }
  }, [router, token]);

  useEffect(() => {
    const saved = loadLayoutFromLocalStorage(pageName);
    if (saved) {
      setColumnsVisibilityModel(saved);
    }
  }, []);

  const handleSaveLayout = () => {
    saveLayoutToLocalStorage(pageName, columnsVisibilityModel);
  };

  const handleGenerateButton = () => {
    setSelectedRow(undefined);
    setIsEdit(false)
    setOpen(true);
    setFormData({
      id: "",
      vendorName: "",
      vendorRepresentative: "",
      vendorCode: "",
      vendorAddress: "",
      vendorPhone: "",
      vendorEmail: "",
      vendorPincode: "",
      customerName: "",
      customerAddress: "",
      customerPhone: "",
      customerEmail: "",
      customerPincode: "",
      amount: "",
      voucherCode: "",
      validityFrom: "",
      validityTo: "",
      status: "",
    });
    setError({
      vendorName: "",
      vendorRepresentative: "",
      vendorCode: "",
      vendorAddress: "",
      vendorPhone: "",
      vendorEmail: "",
      vendorPincode: "",
      customerName: "",
      customerAddress: "",
      customerPhone: "",
      customerEmail: "",
      customerPincode: "",
      amount: "",
      voucherCode: "",
      validityFrom: "",
      validityTo: "",
      status: "",
    });
  };
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevState: any) => ({ ...prevState, [name]: value }));
    if (value) {
      setError((prev: any) => ({
        ...prev,
        [name]: "",
      }));
    }
  };
  const handleEditButton = (rowToEdit: any) => {
    if (!rowToEdit) return;
    setIsEdit(true);
    setSelectedRow(rowToEdit);
    setOpen(true);

    setFormData({
      id: rowToEdit.id,
      vendorName: {
        label: rowToEdit.vendorBusinessName,
        value: rowToEdit.vendorId,
      },
      customerName: {
        label: rowToEdit.customerName,
        value: rowToEdit.customerId,
      },
      vendorRepresentative: rowToEdit.vendorBusinessRepresentative,
      vendorCode: rowToEdit.vendorCode,
      vendorAddress: rowToEdit.vendorAddress,
      vendorPhone: rowToEdit.vendorMobileNo,
      vendorEmail: rowToEdit.vendorEmail,
      vendorPincode: rowToEdit.vendorPincode || "",
      customerAddress: rowToEdit.customerAddress,
      customerPhone: rowToEdit.customerPhone,
      customerEmail: rowToEdit.customerEmail,
      customerPincode: rowToEdit.customerPincode || "",
      amount: rowToEdit.amount,
      satatus: rowToEdit.status,
      voucherCode: rowToEdit.voucherCode,
      validityFrom: rowToEdit.validityFrom?.split("T")[0] || "",
      validityTo: rowToEdit.validityTo?.split("T")[0] || "",
    });
  };

  const handleDeleteButton = (id: number) => {
    setSelectedId(id);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedId !== null) {
      if (token) {
        const decoded: any = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.clear();
          router.push("/authentication/login");
        }
      }
      setLoading(true);
      try {
        const response = await axios.delete(
          `${BASE_URL}/voucher/deleteVoucherById/${selectedId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setSuccessVoucherMessage(response.data.message)
          setOpenVoucherSuccessSnackbar(true);
          setVoucherUpdated(prev => !prev);
          const updatedRows = rows
            .filter((row: any) => row.id !== selectedId)
            .map((row: any, index: any) => ({
              ...row,
              id: index + 1,
            }));
          setRows(updatedRows);
        } else {
          console.error("Error deleting voucher:", response.data.message);
          setVoucherErrorMessage(response.data.message);
        }
      } catch (error: any) {
        setVoucherErrorMessage(error.response.data.message)
        console.error("Error during voucher deletion:", error);
        if (error.response) {
          setVoucherErrorMessage(error.response.data.message)
          console.error("API Error Response:", error.response.data.message);
        } else if (error.request) {
          setVoucherErrorMessage(error.response.data.message)
          console.error("No response from server.");
        } else {
          setVoucherErrorMessage(error.response.data.message)
          console.error("Unexpected error:", error.message);
        }
      }
      setLoading(false);
      setSelectedId(null);
    }
    setOpenDeleteDialog(false);
  };
  const handleUpdateStatusButton = (id: number) => {
    setSelectedId(id);
    setOpenStatusDialog(true);
  };


  const updateVoucherStatus = async () => {
    if (selectedId !== null) {
      setLoading(true);
      const payload = {

        status: "Disable",
      };
      if (token) {
        const decoded: any = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.clear();
          router.push("/authentication/login");
        }
      }
      try {
        const response = await axios.put(
          `${BASE_URL}/voucher/updateVoucherStatusById/${selectedId}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setOpenStatusDialog(false)
          setSuccessVoucherMessage(response.data.message)
          setOpenVoucherSuccessSnackbar(true);
          setVoucherUpdated(prev => !prev);
          const updatedRows = rows
            .filter((row: any) => row.id !== selectedId)
            .map((row: any, index: any) => ({
              ...row,
              id: index + 1,
            }));
          setRows(updatedRows);
        } else {
          console.error("Error deleting voucher:", response.data.message);
          setVoucherErrorMessage(response.data.message);
        }
      } catch (error: any) {
        setVoucherErrorMessage(error.response.data.message)
        console.error("Error during voucher deletion:", error);
        if (error.response) {
          setVoucherErrorMessage(error.response.data.message)
          console.error("API Error Response:", error.response.data.message);
        } else if (error.request) {
          setVoucherErrorMessage(error.response.data.message)
          console.error("No response from server.");
        } else {
          setVoucherErrorMessage(error.response.data.message)
          console.error("Unexpected error:", error.message);
        }
      }
      setLoading(false);
      setSelectedId(null);
    }
    setOpenDeleteDialog(false);
  };

  const validateForm = () => {
    let isValid = true;
    let error: any = {};
    if (typeof formData?.vendorName?.label === "string" && formData.vendorName.label.trim()) {
    } else {
      error.vendorName = "Vendor is required";
      isValid = false;
    }
    if (typeof formData?.customerName?.label === "string" && formData.customerName.label.trim()) {
    } else {
      error.customerName = "Customer name is required";
      isValid = false;
    }
    if (!formData.amount) {

      error.amount = "Amount is required";
      isValid = false;
    }
    if (!formData?.voucherCode?.trim()) {
      error.voucherCode = " Voucher code is required";
      isValid = false;
    }
    if (!formData?.validityFrom?.trim()) {
      error.validityFrom = "Validity from is required";
      isValid = false;
    }
    if (!formData?.validityTo?.trim()) {
      error.validityTo = "Validity to is required";
      isValid = false;
    }
    setError(error);
    return isValid;
  };
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    setVoucherErrorMessage(false);
    setLoading(true);
    if (token) {
      const decoded: any = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
        router.push("/authentication/login");
      }
    }
    try {
      const payload = {
        amount: parseFloat(formData.amount),
        voucherCode: formData.voucherCode,
        validityFrom: formData.validityFrom,
        validityTo: formData.validityTo,
        vendorId: formData.vendorName?.value,
        customerId: formData.customerName?.value,
        status: "Enable",
      };

      const response = await axios.post(
        `${BASE_URL}/voucher/createVoucher`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setSuccessVoucherMessage(response.data.message)
        setOpenVoucherSuccessSnackbar(true);
        setVoucherUpdated(prev => !prev);
        setFormData({
          id: "",
          vendorName: "",
          vendorRepresentative: "",
          vendorCode: "",
          vendorAddress: "",
          vendorPhone: "",
          vendorEmail: "",
          vendorPincode: "",
          customerName: "",
          customerAddress: "",
          customerPhone: "",
          customerEmail: "",
          customerPincode: "",
          amount: "",
          voucherCode: "",
          validityFrom: "",
          validityTo: "",
          status: ""
        });
        setLoading(false);
        setError({});
        setOpen(false);
      } else {
        setVoucherErrorMessage(response.data.status);
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Error during voucher creation:", error);
      setLoading(false);

      if (error.response) {

        console.error("API Error Response:", error.response.data.message);
        setVoucherErrorMessage(error.response.data.message);
        setLoading(false);
      } else if (error.request) {
        console.error("No response from server.");
        setLoading(false);
      } else {
        console.error("Unexpected error:", error.message);
        setVoucherErrorMessage(error.message);
        setLoading(false);
      }
    }
  };
  const handleUpdate = async () => {
    setVoucherErrorMessage(false);
    if (!validateForm()) {
      return;
    }
    setVoucherErrorMessage(false);
    setLoading(true);
    if (token) {
      const decoded: any = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
        router.push("/authentication/login");
      }
    }
    try {
      const payload = {
        amount: parseFloat(formData.amount),
        voucherCode: formData.voucherCode,
        validityFrom: formData.validityFrom,
        validityTo: formData.validityTo,
        vendorId: formData.vendorName?.value,
        customerId: formData.customerName?.value,
      };

      const response = await axios.put(
        `${BASE_URL}/voucher/updateVoucherById/${formData.id}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setSuccessVoucherMessage(response.data.message);
        setOpenVoucherSuccessSnackbar(true);
        setVoucherUpdated(prev => !prev);
        setFormData({
          id: "",
          vendorName: "",
          vendorRepresentative: "",
          vendorCode: "",
          vendorAddress: "",
          vendorPhone: "",
          vendorEmail: "",
          vendorPincode: "",
          customerName: "",
          customerAddress: "",
          customerPhone: "",
          customerEmail: "",
          customerPincode: "",
          amount: "",
          voucherCode: "",
          validityFrom: "",
          validityTo: "",
          status: "",
        });

        setLoading(false);
        setError({});
        setOpen(false);
      } else {
        console.error("Unexpected response status:", response.status);
        setVoucherErrorMessage(response.data.status);
      }
    } catch (error: any) {
      console.error("Error during voucher update:", error);
      setLoading(false);

      if (error.response) {
        console.error("API Error Response:", error.response.data.message);
        setVoucherErrorMessage(error.response.data.message || "An error occurred. Please try again.");
      } else if (error.request) {
        console.error("No response from server.");
      } else {
        console.error("Unexpected error:", error.message);
      }
    }
  };

  const handleClickOpenPdfPopUp = (rowToEdit: any) => {

    setViewSelectedVocher(rowToEdit);
    setopenPdfPopUp(true);
    setLoading(false)
  };

  const columns: any = [
    { field: "id", headerName: "ID", width: 100, flex: 0, maxWidth: 40 },
    { field: "vendorBusinessName", headerName: "Vendor Name", flex: 1, editable: true },
    { field: "vendorCode", headerName: "Vendor Code", flex: 1, editable: true },
    {
      field: "vendorBusinessRepresentative",
      headerName: "Vendor Representative",
      flex: 1,
      editable: true,
    },
    {
      field: "vendorAddress",
      headerName: "Vendor Address",
      flex: 1,
      editable: true,
    },
    {
      field: "vendorMobileNo",
      headerName: "Vendor Phone",
      flex: 1,
      editable: true,
    },
    {
      field: "vendorEmail",
      headerName: "Vendor Email",
      flex: 1,
      editable: true,
    },
    {
      field: "vendorPincode",
      headerName: "Vendor Pincode",
      flex: 1,
      editable: true,
    },
    {
      field: "customerName",
      headerName: "Customer Name",
      flex: 1,
      editable: true,
    },
    {
      field: "customerAddress",
      headerName: "Customer Address",
      flex: 1,
      editable: true,
    },
    {
      field: "customerPhone",
      headerName: "Customer Phone",
      flex: 1,
      editable: true,
    },
    {
      field: "customerEmail",
      headerName: "Customer Email",
      flex: 1,
      editable: true,
    },
    {
      field: "customerPincode",
      headerName: "Customer Pincode",
      flex: 1,
      editable: true,
    },
    {
      field: "amount",
      headerName: "Discount Amount",
      flex: .02,
      type: "number",
      editable: true,
    },
    {
      field: "voucherCode",
      headerName: "Voucher Code",
      flex: 1,
      editable: true,
    },
    {
      field: "validityFrom",
      headerName: "Validity From",
      flex: 1,
      editable: true,
      valueGetter: (params: any) => {
        return formatToDDMMYYYY(params);
      },
    },
    {
      field: "validityTo",
      headerName: "Validity To",
      flex: 1,
      editable: true,
      valueGetter: (params: any) => {
        return formatToDDMMYYYY(params);
      },
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      editable: true,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: .01,
      renderCell: (params: any) => (

        <Box display="flex" justifyContent="flex-start" width="100%" mt={1}>
          {/* <IconButton color="primary" onClick={() => {
            handleClickOpenPdfPopUp(params.row)
          }}>
            <VisibilityIcon style={{ fontSize: 20 }} />
          </IconButton> */}
          <Tooltip title="View">
            <IconButton
              sx={{ p: 0.2 }}
              color="primary"
              onClick={() => {
                const pdfURL = params.row?.pdfURL;
                if (pdfURL) {
                  window.open(pdfURL, '_blank');
                } else {
                  alert('PDF not available');
                }
              }}
            >
              <VisibilityIcon style={{ fontSize: 14 }} />
            </IconButton>
          </Tooltip>
          {roleId === 1 && (

            <>
              <Tooltip title={params.row.status === 'Disable' ? 'User has already redeemed' : 'Redeem'}>
                <span>
                  <IconButton
                    sx={{ p: 0.2 }}
                    color={params.row.status === 'Disable' ? 'error' : 'primary'}
                    size="small"
                    onClick={() => handleUpdateStatusButton(params.row.id)}
                    disabled={params.row.status === 'Disable'}
                  >
                    <RedeemIcon fontSize="small" style={{ fontSize: 14 }} />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton
                  sx={{ p: 0.2 }}
                  color="primary"
                  size="small"
                  onClick={() => handleEditButton(params.row)}>
                  <EditIcon fontSize="small" style={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  sx={{ p: 0.2 }}
                  color="primary"
                  size="small"
                  onClick={() => handleDeleteButton(params.row.id)}>
                  <DeleteIcon fontSize="small" style={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            </>
          )
          }
        </Box >
      ),
    }
  ];
  const onCloseDialog = () => {
    setOpen(false);
    setLoading(false)
    setError({
      vendorName: "",
      vendorRepresentative: "",
      vendorCode: "",
      vendorAddress: "",
      vendorPhone: "",
      vendorEmail: "",
      vendorPincode: "",
      customerName: "",
      customerAddress: "",
      customerPhone: "",
      customerEmail: "",
      customerPincode: "",
      amount: "",
      voucherCode: "",
      validityFrom: "",
      validityTo: "",
      status: "",
    });
    setFormData({
      id: "",
      vendorName: "",
      vendorRepresentative: "",
      vendorCode: "",
      vendorAddress: "",
      vendorPhone: "",
      vendorEmail: "",
      vendorPincode: "",
      customerName: "",
      customerAddress: "",
      customerPhone: "",
      customerEmail: "",
      customerPincode: "",
      amount: "",
      voucherCode: "",
      validityFrom: "",
      validityTo: "",
      status: "",
    });
    setVoucherErrorMessage(false);
  };

  const handleClosePdfPopUp = () => {
    setopenPdfPopUp(false);
    setLoading(false)
  }
  const getAllVouchers = async () => {
    if (roleId !== 1) {
      return;
    }
    if (!token) {
      return;
    }
    try {
      const response = await axios.get(`${BASE_URL}/voucher/getAllVouchers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.status && response.data.result) {
        setRows(response.data.result);
        setLoading(false);
      } else {
        setLoading(false);
        console.error("No result found in response data");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching vouchers:", error);
    }
  };
  useEffect(() => {
    getAllVouchers();
  }, [roleId, token, voucherUpdated]);

  const getAllVoucherByVendor = async () => {
    try {
      if (roleId !== 2) {
        return;
      }

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
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/voucher/getAllVoucherByVendor`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status && response.data.result) {
        setRows(response.data.result);
        setLoading(false);
      } else {
        setLoading(false);
        console.error("No result found in response data");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error fetching vouchers:", error);
    }
  };
  useEffect(() => {
    getAllVoucherByVendor();
  }, [roleId, token, voucherUpdated]);

  const getAllVendor = async () => {
    if (roleId !== 1) {
      return;
    }
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
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/user/getAllVendor`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data) {
        setVendorOptions(response.data.data);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching vendors:", error);
    }
  };
  useEffect(() => {
    getAllVendor();
  }, [roleId, token]);

  const getAllCustomerByVendorId = async () => {
    if (!formData.vendorName?.value) return;
    if (token) {
      const decoded: any = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.clear();
        router.push("/authentication/login");
      }
    }
    const selectedVendorId = formData.vendorName.value;
    try {
      const response = await axios.get(
        `${BASE_URL}/customer/getAllCustomerByVendorId/${selectedVendorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data && response.data.data) {
        const customers = response.data.data.map((customer: { id: any; name: any }) => ({
          id: customer.id,
          name: customer.name,
        }));
        setCustomerOptions(customers);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };
  useEffect(() => {
    getAllCustomerByVendorId();
  }, [formData.vendorName, token]);

  const handleCloseVoucherSuccessSnackbar = () => {
    setOpenVoucherSuccessSnackbar(false);
  }
  const exportToPDF = async (data: any[], userName: string) => {
    const doc = new jsPDF({ orientation: "landscape" });

    const logoWidth = 60;
    const logoHeight = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const dataTime = formatDateTime(new Date());

    const logoX = (pageWidth - logoWidth) / 2;
    doc.addImage("/images/logos/logo.png", "PNG", logoX, 7, logoWidth, logoHeight);

    doc.setFontSize(12);
    doc.text("COUPAN LIST", 14, 30);
    doc.text("Name: " + userName, 14, 40);
    doc.text(dataTime, pageWidth - 14, 30, { align: "right" });

    doc.setFontSize(14);
    doc.text("COUPAN LIST", 14, 50);

    const columns = [
      "ID", "Amount", "voucher Code", "validity From", "validity To", "customer Id", "vendor Id", "customer Name",
      "customer Phone", "customer Email", "customer Pincode", "vendor Email", "vendor Phone",
      "Business Name", "Representative", "vendor Code", "vendor Pincode",
      "status"
    ];

    const rows = data.map((row: any) => [
      row.id,
      row.amount,
      row.voucherCode,
      formatDateTime(row.validityFrom),
      formatDateTime(row.validityTo),
      row.customerId,
      row.vendorId,
      row.customerName,
      row.customerPhone,
      row.customerEmail,
      row.customerPincode,
      row.vendorEmail,
      row.vendorMobileNo,
      row.vendorBusinessName,
      row.vendorBusinessRepresentative,
      row.vendorCode,
      row.vendorPincode,
      row.status
    ]);

    autoTable(doc, {
      startY: 45,
      head: [columns],
      body: rows,
      styles: {
        fontSize: 7,
        overflow: 'linebreak',
        cellPadding: .2,
      },
      headStyles: {
        fillColor: [165, 42, 42],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
        fontSize: 7,
      },
      bodyStyles: {
        halign: "center",
      },
    });

    const pdfBlob = doc.output("blob");
    const fileURL = URL.createObjectURL(pdfBlob);
    window.open(fileURL);
    doc.save("AllCoupanData.pdf");
  };
  const exportToExcel = (data: any[]) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Coupan");
    const range = XLSX.utils.decode_range(worksheet["!ref"] || "");
    for (let col = range.s.c; col <= range.e.c; col++) {
      const cellAddress = XLSX.utils.encode_cell({ c: col, r: 0 });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = {
        fill: {
          fgColor: { rgb: "A52A2A" },
        },
        font: { color: { rgb: "FFFFFF" }, bold: true },
      };
    }

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });

    const blob = new Blob([excelBuffer], {
      type:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = URL.createObjectURL(blob);
    saveAs(blob, "CoupanData.xlsx");
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
      <Box>
        <Grid container >
          <Grid item xs={12}>
            <Paper >
              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              ><Grid sx={{ m: 2 }}>
                  <Typography variant="h4">Voucher</Typography>
                </Grid>
                <Grid item xs={6} sx={{ mr: 1 }}>
                  <Box display="flex" justifyContent="flex-end" >
                    {roleId === 1 && (
                      <IconButton
                        sx={{ color: "#465fff" }}
                        onClick={handleGenerateButton}
                      >
                        <LocalOfferIcon />
                      </IconButton>
                    )}
                    <IconButton onClick={() => exportToExcel(rows)}>
                      <GridOnIcon sx={{ color: "#465fff" }} />
                    </IconButton>
                    <IconButton onClick={() => exportToPDF(rows, userName)}>
                      <PictureAsPdfIcon sx={{ color: "#465fff" }} />
                    </IconButton>
                  </Box>
                </Grid>
                <Box
                  sx={{
                    flexGrow: 1,
                    width: "100%",
                    height: "74vh",
                    display: "flex",
                  }}
                >
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
                    initialState={{
                      density: "compact",
                    }}
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
                          maxHeight: 365,
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
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Delete Voucher</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} variant="contained" color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openStatusDialog}
        onClose={() => setOpenStatusDialog(false)}
      >
        <DialogTitle>Redeem Voucher</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to Redeem this voucher?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStatusDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={updateVoucherStatus} variant="contained" color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={open} onClose={onCloseDialog} maxWidth="sm" fullWidth>

        <DialogTitle> Voucher</DialogTitle>
        {voucherErrorMessage && (
          <Grid item>
            <Box sx={{
              border: 1,
              borderColor: '#ff9999',
              p: 0,
              m: 2,
              backgroundColor: '#f8bbd0'
            }}>
              <Alert severity="error">{voucherErrorMessage}</Alert>
            </Box>
          </Grid>
        )}
        <Divider></Divider>
        <DialogContent>
          <Grid container spacing={2} justifyContent="center" alignItems="center">
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
            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={vendorOptions}
                getOptionLabel={(option: any) => option?.businessName || ""}
                value={
                  vendorOptions.find(
                    (option: any) => option.id === formData.vendorName?.value
                  ) || null
                }
                onChange={(event, newValue) => {
                  setFormData((prev: any) => ({
                    ...prev,
                    vendorName: newValue
                      ? { label: newValue.businessName, value: newValue.id }
                      : null,
                    customerName: null,
                  }));
                  setCustomerOptions([]);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      <span>
                        Vendor <span style={{ color: "red" }}> *</span>
                      </span>
                    }
                    variant="outlined"
                    fullWidth
                    error={!!error.vendorName}
                    helperText={error.vendorName}
                  />
                )}
                onBlur={() => {
                  if (!formData?.vendorName?.label) {
                    setError((prev: any) => ({
                      ...prev,
                      vendorName: "Vendor is required",
                    }));
                  } else {
                    setError((prev: any) => ({ ...prev, vendorName: "" }));
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                options={customerOptions}
                getOptionLabel={(option: any) => option?.name || ""}
                value={
                  customerOptions.find(
                    (option: any) => option.id === formData.customerName?.value
                  ) || null
                }
                onChange={(event, newValue) => {
                  setFormData((prev: any) => ({
                    ...prev,
                    customerName: newValue
                      ? { label: newValue.name, value: newValue.id }
                      : null,
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={
                      <span>
                        Customer name <span style={{ color: "red" }}> *</span>
                      </span>
                    }
                    variant="outlined"
                    fullWidth
                    error={!!error.customerName}
                    helperText={error.customerName}
                  />
                )}
                onBlur={() => {
                  if (!formData?.customerName?.label) {
                    setError((prev: any) => ({
                      ...prev,
                      customerName: "Customer name is required",
                    }));
                  } else {
                    setError((prev: any) => ({ ...prev, customerName: "" }));
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                name="amount"
                label={
                  <span>
                    Amount <span style={{ color: "red" }}> *</span>
                  </span>
                }
                type="text"
                fullWidth
                variant="outlined"
                value={formData.amount}
                error={!!error.amount}
                helperText={error.amount}
                onChange={(e: any) => {
                  const value = e.target.value;
                  const isValid = value === "" || /^\d*\.?\d{0,2}$/.test(value);
                  const [integerPart] = value.split(".");

                  if (isValid && integerPart.length <= 8) {
                    setFormData((prev: any) => ({
                      ...prev,
                      amount: value,
                    }));

                    if (value.trim()) {
                      setError((prev: any) => ({
                        ...prev,
                        amount: "",
                      }));
                    }
                  }
                }}
                onBlur={() => {
                  const value = formData.amount;

                  if (!value || value.trim() === "") {
                    setError((prev: any) => ({
                      ...prev,
                      amount: "Amount is required",
                    }));
                  } else {
                    const formatted = parseFloat(value).toFixed(2);
                    setFormData((prev: any) => ({
                      ...prev,
                      amount: formatted,
                    }));
                  }
                }}
                inputProps={{
                  inputMode: "decimal",
                  pattern: "\\d*(\\.\\d{0,2})?",
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={
                  <span>
                    Voucher code<span style={{ color: "red" }}> *</span>
                  </span>
                }
                name="voucherCode"
                fullWidth
                disabled={isEdit}
                value={formData.voucherCode}
                onChange={handleChange}
                onBlur={() => {
                  if (!formData?.voucherCode?.trim()) {
                    setError((prev: any) => ({
                      ...prev,
                      voucherCode: " Voucher code is required",
                    }));
                  } else {
                    setError((prev: any) => ({ ...prev, voucherCode: "" }));
                  }
                }}
                error={!!error.voucherCode}
                helperText={error.voucherCode}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={
                  <span>
                    Validity from <span style={{ color: "red" }}> *</span>
                  </span>
                }
                name="validityFrom"
                type="date"
                value={formData.validityFrom}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
                onBlur={() => {
                  if (!formData?.validityFrom?.trim()) {
                    setError((prev: any) => ({
                      ...prev,
                      validityFrom: "Validity from is required",
                    }));
                  } else {
                    setError((prev: any) => ({ ...prev, validityFrom: "" }));
                  }
                }}
                error={!!error.validityFrom}
                helperText={error.validityFrom}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={
                  <span>
                    Validity to <span style={{ color: "red" }}> *</span>
                  </span>
                }
                name="validityTo"
                type="date"
                value={formData.validityTo}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
                onBlur={() => {
                  const validityTo = formData.validityTo?.trim();
                  const validityFrom = formData.validityFrom?.trim();

                  if (!formData?.validityTo?.trim()) {
                    setError((prev: any) => ({
                      ...prev,
                      validityTo: "Validity to is required",
                    }));
                  } else if (
                    validityFrom &&
                    new Date(validityTo).getTime() <
                    new Date(validityFrom).getTime()
                  ) {
                    setError((prev: any) => ({
                      ...prev,
                      validityTo:
                        "The 'Validity to' cannot be before the 'Validity from' time",
                    }));
                  } else {
                    setError((prev: any) => ({ ...prev, validityTo: "" }));
                  }
                }}
                error={!!error.validityTo}
                helperText={error.validityTo}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={isEdit ? handleUpdate : handleSubmit}
            variant="contained"
            color="primary"
          >
            {isEdit ? "Update" : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openPdfPopUp}
        onClose={handleClosePdfPopUp}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Voucher</DialogTitle>
        <DialogContent>
          {viewSelectedVocher?.pdfURL ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() => window.open(viewSelectedVocher.pdfURL, '_blank')}
            >
              Open PDF in New Tab
            </Button>
          ) : (
            <p>No PDF available</p>
          )}

          {/* PDF generator component commented */}
          {/* <VoucherPdfView viewSelectedVocher={viewSelectedVocher} /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePdfPopUp} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openVoucherSuccessSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseVoucherSuccessSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseVoucherSuccessSnackbar} variant="filled" severity="success" sx={{ width: '100%' }}>
          {successVoucherMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default VoucherTable;
