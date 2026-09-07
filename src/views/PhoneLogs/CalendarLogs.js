import React, { useState } from "react";
import Box from "@mui/material/Box";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import {
  extractDate,
  formatDate,
  formatTimestampToTime,
} from "helper/GetDateTimeFormat";
import { Button, Typography, Grid, CardContent } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import LocationMap from "helper/LocationMap";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CustomDataGridTable from "helper/CustomDataGridTable";
import { useFetchData } from "helper/useFetchData";
import { GET_CALENDAR_DETAILS } from "config/ApiNameConstant";
import CustomDatePicker from "helper/CustomDatePicker";
import { getParamUrl } from "helper/UrlHelper";
const CalendarLogs = () => {
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
    currentPageNumber
  );
  const { totalCount, data, fetchData } = useFetchData(
    GET_CALENDAR_DETAILS,
    params,
    currentPageNumber
  );
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);

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

  const showLocationMap = (params) => {
    setCenter({
      lat: Number(params.row.latitude),
      lng: Number(params.row.longitude),
    });
    setOpen(true);
  };
  const columns = [
    {
      field: "title",
      headerName: "Event Name",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <CalendarMonthIcon sx={{ color: "#5e35b1", fontSize: "18px" }} />
          <Typography
            sx={{ fontSize: "0.875rem", color: "#616161" }}
            variant="subtitle2"
          >
            {params.row.title}
          </Typography>
        </Box>
      ),
    },
    { field: "time", headerName: "Time", flex: 1 },
    {
      field: "calenderLogTime",
      headerName: "Date",
      flex: 1,
      valueGetter: (params) => {
        return extractDate(params.row.calenderLogTime);
      },
    },

    // {
    //   field: "date",
    //   flex: 1,
    //   headerName: "Date",
    //   valueGetter: (params) => {
    //     return formatDate(params.row.logDateTime);
    //   },
    // },
    // {
    //   field: "actions",
    //   headerName: "View on Map",
    //   type: "actions",
    //   flex: 1,
    //   getActions: (params) => [
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
      currentPageNumber
    );

    fetchData(paramUrl);
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
      <MainCard content={false} title="Calendar Logs">
        <CardContent>
          <Grid container spacing={2}>
            <CustomDatePicker onSearch={handleSearch} data={data} />
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

export default CalendarLogs;
