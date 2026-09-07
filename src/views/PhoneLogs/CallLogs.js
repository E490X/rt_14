import React, { useState } from "react";
import Box from "@mui/material/Box";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import Modal from "@mui/material/Modal";
import { GridActionsCellItem } from "@mui/x-data-grid";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";
import {
  extractDate,
  extractTime,
  formatCallDurationToTime,
  formatDate,
  formatTimestampToTime,
} from "helper/GetDateTimeFormat";
import { Typography, Grid, CardContent } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import LocationMap from "helper/LocationMap";
import CustomDataGridTable from "helper/CustomDataGridTable";
import CustomDatePicker from "helper/CustomDatePicker";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import Chip from "@mui/material/Chip";
import CallMadeIcon from "@mui/icons-material/CallMade";
import { useFetchData } from "helper/useFetchData";
import { GET_CALLS_LOGS } from "config/ApiNameConstant";
import ApiUtils from "api/ApiUtils";
import PhoneMissedIcon from "@mui/icons-material/PhoneMissed";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import { getParamUrl } from "helper/UrlHelper";

const CallLogs = () => {
  const urlParam = useParams();
  const userDeviceIdAsNumber = urlParam.userDeviceId;
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });

  const [filterModel, setFilterModel] = useState({
    fromDate: '',
    toDate: '',
  });
  let params = getParamUrl(filterModel,
    userDeviceIdAsNumber,
    currentPageNumber);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });
  const [open, setOpen] = React.useState(false);

  const handleClose = () => setOpen(false);
  const { totalCount, data, fetchData } = useFetchData(
    GET_CALLS_LOGS,
    params,
    currentPageNumber
  );

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };

  const showLocationMap = (params) => {
    setCenter({
      lat: Number(params.row.latitude),
      lng: Number(params.row.longitude),
    });
    setOpen(true);
  };
  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "number", headerName: "Number", flex: 1 },
    {
      field: "callTypes",
      headerName: "Call Type",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: "6px" }}>
          {params.row.callTypes === "Incoming" ? (
            <Chip
              icon={
                <CallReceivedIcon sx={{ color: "red", fontSize: "16px" }} />
              }
              color="primary"
              label={params.row.callTypes}
            />
          ) : params.row.callTypes === "FaceTimeAudio" ? (
            <Chip color="secondary" label="FaceTime Audio" />
          ) : (
            <Chip
              icon={
                params.row.callTypes === "MissedCalls" ? (
                  <PhoneMissedIcon sx={{ color: "white", fontSize: "16px" }} />
                ) : (
                  <CallMadeIcon sx={{ color: "white", fontSize: "16px" }} />
                )
              }
              color={
                params.row.callTypes === "MissedCalls" ? "error" : "success"
              }
              label={params.row.callTypes}
            />
          )}
        </Box>
      ),
    },
    {
      field: "callDuration",
      flex: 1,
      headerName: "Call Duration",
    },
    {
      field: "time",
      flex: 1,
      headerName: "Time",
      valueGetter: (params) => {
        return extractTime(params.row.logDateTime);
      },
    },
    {
      field: "date",
      flex: 1,
      headerName: "Date",
      valueGetter: (params) => {
        return extractDate(params.row.logDateTime);
      },
    },
    {
      field: "faceTimeBadge",
      headerName: "",
      flex: 0.6,
      sortable: false,
      renderCell: (params) =>
        params.row.isFaceTimeAudio ? (
          <Chip
            label="FaceTime"
            size="small"
            sx={{ backgroundColor: "#34DA4F", color: "white", fontWeight: 600 }}
          />
        ) : null,
    },
    // {
    //   field: "actions",
    //   headerName: "Actions",
    //   type: "actions",
    //   width: 280,
    //   getActions: (params) => [
    //     <audio
    //       src="https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3"
    //       controls
    //     />,
    //     <GridActionsCellItem
    //       icon={<LocationOnIcon />}
    //       label="map"
    //       onClick={() => showLocationMap(params)}
    //     />,
    //   ],
    // },
  ];

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
      currentPageNumber);

    fetchData(paramUrl);
  };

  const handleExportFile = (fromDateISOString, toDateISOString) => {
    const paramsForExcel = `DeviceUserId=${userDeviceIdAsNumber}&Page=${currentPageNumber}&PageSize=${10}&FromDate=${fromDateISOString}&ToDate=${toDateISOString}`;
    ApiUtils.getCallLogDetailsByExcel(paramsForExcel)
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "calllog-details.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  };
  const handlePaginationModelChange = (page) => {
    setCurrentPageNumber(page.page + 1);
    setPaginationModel({
      ...paginationModel,
      page: page.page,
    });
  };

  return (
    <>
      <MainCard content={false} title="Call History Logs">
        <CardContent>
          <Grid container spacing={2}>
            <CustomDatePicker
              onSearch={handleSearch}
              onExportExcelFile={handleExportFile}
              data={data}
            />
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
              rows={data}
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

export default CallLogs;
