import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import ApiUtils from "api/ApiUtils";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import { formatDate, formatTimestampToTime } from "helper/GetDateTimeFormat";
import { Typography, Grid, CardContent } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import LocationMap from "helper/LocationMap";
import CustomDataGridTable from "helper/CustomDataGridTable";
import CustomDatePicker from "helper/CustomDatePicker";
import AndroidIcon from "@mui/icons-material/Android";
import { getParamUrl } from "helper/UrlHelper";
const KeyLogger = () => {
  const urlParam = useParams();
  const userDeviceIdAsNumber = urlParam.userDeviceId;
  const [callLogData, setCallLogData] = useState([
    {
      id: 1,
      name: "Whatsapp",
      key: "Imaging Imaging Imaging Imaging Imaging Imaging",
      time: "17:19",
      date: "29-09-2023",
    },
    {
      id: 2,
      name: "Amazon",
      key: "Imaging Imaging Imaging Imaging Imaging Imaging",
      time: "17:19",
      date: "29-09-2023",
    },
    {
      id: 3,
      name: "Instagram",
      key: "Imaging Imaging Imaging Imaging Imaging Imaging",
      time: "17:19",
      date: "29-09-2023",
    },
  ]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [filterModel, setFilterModel] = useState({
    fromDate: '',
    toDate: '',
  });
  let params = getParamUrl(filterModel,
    userDeviceIdAsNumber,
    currentPageNumber
  );
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    fetchData(params);
  }, [currentPageNumber]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  function fetchData(params) {
    ApiUtils.getCallLogs(params)
      .then((res) => {
        setTotalCount(res.data.data.totalCount);
        const dataTable = res.data.data.listResponse.map((data, index) => ({
          ...data,
          id: index + 1,
        }));
        // setCallLogData(dataTable);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const showLocationMap = (params) => {
    setCenter({
      lat: Number(params.row.latitude),
      lng: Number(params.row.longitude),
    });
    setOpen(true);
  };
  const columns = [
    {
      field: "name",
      headerName: "Application Name",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* <AndroidIcon sx={{ color: "#1E88E5", fontSize: "18px" }} /> */}
          <Typography
            sx={{ fontSize: "0.875rem", color: "#616161" }}
            variant="subtitle2"
          >
            {params.row.name}
          </Typography>
        </Box>
      ),
    },
    { field: "key", headerName: "Key", flex: 1 },
    {
      field: "time",
      flex: 1,
      headerName: "Time",
      // valueGetter: (params) => {
      //   return formatTimestampToTime(params.row.logDateTime);
      // },
    },

    {
      field: "date",
      flex: 1,
      headerName: "Date",
      // valueGetter: (params) => {
      //   return formatDate(params.row.logDateTime);
      // },
    },
  ];

  const handlePaginationModelChange = (page) => {
    setCurrentPageNumber(page.page + 1);
    setPaginationModel({
      ...paginationModel,
      page: page.page,
    });
  }
  const handleSearch = (fromDateISOString, toDateISOString) => {
    let filterData = {
      fromDate: fromDateISOString,
      toDate: toDateISOString
    }
    setFilterModel({
      fromDate: fromDateISOString,
      toDate: toDateISOString
    });
    let paramUrl = getParamUrl(filterData,
      userDeviceIdAsNumber,
      currentPageNumber
    );

    fetchData(paramUrl);
  };

  return (
    <>
      <MainCard content={false} title="Key Logger">
        <CardContent>
          <Grid container spacing={2}>
            <CustomDatePicker onSearch={handleSearch} />
          </Grid>
          <Box
            sx={{
              py: 2,
              width: "100%",
              overflowX: "hidden",
              borderBottom: "none",
              height: "500px",
            }}
          >
            <CustomDataGridTable
              columns={columns}
              rows={callLogData}
              pagination={true}
              hideFooter={false}
              rowCount={totalCount}
              onPaginationModelChange={handlePaginationModelChange}
              paginationModel={paginationModel}
            />
          </Box>
        </CardContent>
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
              Location
            </Typography>
            <CloseIcon className="close-icon-modal" onClick={handleClose} />
          </Box>

          <Grid item xs={12}>
            <LocationMap center={center} />
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default KeyLogger;
