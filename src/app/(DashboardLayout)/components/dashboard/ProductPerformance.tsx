import {
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { DataGrid } from "@mui/x-data-grid";
import dayjs, { Dayjs } from 'dayjs';
import { alignProperty } from "@mui/material/styles/cssUtils";


const ProductPerformance = ({
  title,
  products,
  setOpenAddInvestmentDialog,
  setOpenDeleteInvestmentDialog,
  setAmount,
  setInvestmentType,
  setOpenAddPolicyDialog,
  setOpenDeletePolicyDialog,
  setPolicyType,
  setIsEdit,
  setSelectedId,
  setOpenAddInsuranceDialog,
  setOpenDeleteInsuranceDialog,
  setInsuranceType,
  setOpenAddLoanDialog,
  setOpenDeleteLoanDialog,
  setLoanType,
  setFromTime,
  setToTime,
  fromTime,
  toTime,
  setOthers,
  setComment
}: any) => {

  const handleEditButton = (id: any) => {
    setIsEdit(true);
    setSelectedId(id);
    const selectedProduct = products.find((product: any) => product.id === id);
    setAmount(selectedProduct.amount);
    setComment(selectedProduct.comment);

    setFromTime(selectedProduct.fromTime ? dayjs(selectedProduct.fromTime, "hh:mm A") : null);
    setToTime(selectedProduct.toTime ? dayjs(selectedProduct.toTime, "hh:mm A") : null);
    setOthers(selectedProduct.duration);

    if (title === "Investment") {
      setOpenAddInvestmentDialog(true);
      setInvestmentType(selectedProduct.type);

    } else if (title === "Policy") {
      setOpenAddPolicyDialog(true);
      setPolicyType(selectedProduct.type);
    } else if (title === "Insurance") {
      setOpenAddInsuranceDialog(true);
      setInsuranceType(selectedProduct.type);
    } else if (title === "Loan") {
      setOpenAddLoanDialog(true);
      setLoanType(selectedProduct.type);
    }
  };

  const handleDeleteButton = (id: any) => {
    setSelectedId(id);
    if (title === "Investment") setOpenDeleteInvestmentDialog(true);
    else if (title === "Policy") setOpenDeletePolicyDialog(true);
    else if (title === "Insurance") setOpenDeleteInsuranceDialog(true);
    else if (title === "Loan") setOpenDeleteLoanDialog(true);
  };

  const columns = [
    { field: "id", headerName: "Id", width: 70 },
    // { field: "date", headerName: "Date", width: 130 },
    { field: "type", headerName: "Type", width: 150 },
    { field: "amount", headerName: "Amount", width: 120 },
    {
      field: "duration", headerName: "Duration", width: 120,
      renderCell: (params: any) => {
        const months = params.value;
        return `${months} Months `;
      },
    },
    {
      field: "",
      headerName: "Contact timing",
      width: 180,
      flex: 1,
      minWidth: 180,
      renderCell: (params: any) => {
        return `${params.row.fromTime} - ${params.row.toTime}`;
      },

    },
    { field: "status", headerName: "Status", width: 120 },
    {
      field: "actions",
      headerName: "Action",
      width: 100,

      renderCell: (params: any) => (
        <Box display="flex" justifyContent="flex-end" width="40%" mt={1.5}>
          <IconButton color="primary" size="small" onClick={() => handleEditButton(params.row.id)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton color="primary" size="small" onClick={() => handleDeleteButton(params.row.id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <DashboardCard title={title}>
      <Box sx={{ flexGrow: 1, width: "100%", height: "100vh", display: "flex" }}>
        <DataGrid
          rows={products}
          columns={columns.map((col) => ({ ...col, flex: 1 }))}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          autoHeight
          sx={{ flexGrow: 1 }}
        />
      </Box>
    </DashboardCard>
  );
};

export default ProductPerformance;
