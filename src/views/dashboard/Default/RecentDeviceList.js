import React, { useState } from "react";
import MainCard from "ui-component/cards/MainCard";
import Box from "@mui/material/Box";
import CustomDataGridTable from "helper/CustomDataGridTable";
import Modal from "@mui/material/Modal";
import { Typography, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ApiUtils from "api/ApiUtils";
import { Link } from "react-router-dom";
import { GridActionsCellItem } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useFetchData } from "helper/useFetchData";
import { GET_ALL_DEVICE_USER } from "config/ApiNameConstant";
function RecentDeviceList() {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "60%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [cardDetailsData, setCardDetailsData] = useState([]);
  const params = `Page=${currentPageNumber}&PageSize=${10}`;
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const { totalCount, data, fetchData } = useFetchData(
    GET_ALL_DEVICE_USER,
    params,
    currentPageNumber
  );
  const showCardsListModal = (param) => {
    const paramsForCardDetails = `DeviceUserId=${
      param.row.deviceUserId
    }&Page=${1}&PageSize=${10}`;
    ApiUtils.getUserCardDetails(paramsForCardDetails)
      .then((res) => {
        const dataTable = res.data.data.listResponse.map((data, index) => ({
          ...data,
          id: index + 1,
        }));
        setCardDetailsData(dataTable);
      })
      .catch((err) => {
        console.log("🚀 ~ file: Dashboard.tsx:39 ~ ).then ~ err:", err);
      });
    setOpen(true);
  };
  const columns = [
    {
      field: "phoneId",
      headerName: "PhoneId",
      flex: 1,
      renderCell: (params) => (
        <Link
          to={`/user/device-info/${params?.row?.deviceUserId}`}
          className="link-redirect"
        >
          {params?.row?.phoneId}
        </Link>
      ),
    },
    { field: "userName", headerName: "Name", flex: 1 },
    // { field: "cnic", headerName: "CNIC", flex: 1 },
    // { field: "number", headerName: "Number", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "createdDate", headerName: "Created At", flex: 1 },
    { field: "password", headerName: "Password", flex: 1 },
    // {
    //   field: "actions",
    //   headerName: "Open Card",
    //   type: "actions",
    //   flex: 1,
    //   getActions: (params) => [
    //     <GridActionsCellItem
    //       icon={<VisibilityIcon />}
    //       label="map"
    //       onClick={() => showCardsListModal(params)}
    //     />,
    //   ],
    // },
    {
      field: "isActive",
      headerName: "Active",
      flex: 1,
      valueGetter: (params) => {
        return params.row.status === "Active"
          ? "Active"
          : params.row.status === "ParitalActive"
          ? "Paritally Active"
          : "Inactive";
      },
    },
  ];
  const columnsOfCardsList = [
    {
      field: "nameOnCard",
      headerName: "Name on Card",
      flex: 1,
      sortable: false,
    },
    {
      field: "cardNumber",
      headerName: "Card Number",
      flex: 1,
      sortable: false,
    },
    {
      field: "expiryDate",
      headerName: "Expiry Date",
      flex: 1,
      sortable: false,
    },
    { field: "cvv", headerName: "CVV", flex: 1, sortable: false },
  ];
  const handlePaginationModelChange = (page) => {
    setCurrentPageNumber(page.page + 1);
    setPaginationModel({
      ...paginationModel,
      page: page.page,
    });
  };
  return (
    <>
      <MainCard title="Last 5 Devices">
        <Box
          sx={{
            py: 2,
            width: "100%",
            overflowX: "hidden",
            borderBottom: "none",
            // height: "500px",
          }}
        >
          <CustomDataGridTable
            columns={columns}
            rows={data}
            pagination={true}
            hideFooter={true}
            rowCount={totalCount}
            paginationModel={paginationModel}
          />
        </Box>
      </MainCard>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: "15px",
            }}
          >
            <Typography id="modal-modal-title" variant="h2" component="h2">
              Cards List
            </Typography>
            <CloseIcon className="close-icon-modal" onClick={handleClose} />
          </Box>

          <Grid item xs={12}>
            {/* <LocationMap center={center} /> */}
            <Box
              sx={{
                py: 2,
                width: "100%",
                overflowX: "hidden",
                borderBottom: "none",
                height: "450px",
                overflowY: "auto",
              }}
            >
              <CustomDataGridTable
                columns={columnsOfCardsList}
                rows={cardDetailsData}
                hideFooter={true}
                rowCount={0}
              />
            </Box>
          </Grid>
        </Box>
      </Modal>
    </>
  );
}

export default RecentDeviceList;
