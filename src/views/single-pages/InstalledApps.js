import React, { useState } from "react";
import Box from "@mui/material/Box";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { extractDate, extractTime, formatDate, formatTimestampToTime } from "helper/GetDateTimeFormat";
import { Typography, Grid, CardContent } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import CustomDataGridTable from "helper/CustomDataGridTable";
import CustomDatePicker from "helper/CustomDatePicker";
// import AndroidIcon from "@mui/icons-material/Android";
// import AppleIcon from "@mui/icons-material/Apple";
import { useFetchData } from "helper/useFetchData";
import { GET_INSTALLED_APPS_LOGS } from "config/ApiNameConstant";
import { getParamUrl } from "helper/UrlHelper";
const InstalledApps = () => {
  const urlParam = useParams();
  const userDeviceIdAsNumber = urlParam.userDeviceId;
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
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

  const { totalCount, data, fetchData } = useFetchData(
    GET_INSTALLED_APPS_LOGS,
    params,
    currentPageNumber
  );

  const columns = [
    {
      field: "installedAppName",
      headerName: "Application Name",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* <AppleIcon sx={{ color: "#1E88E5", fontSize: "18px" }} /> */}
          <Typography
            sx={{ fontSize: "0.875rem", color: "#616161" }}
            variant="subtitle2"
          >
            {params.row.installedAppName}
          </Typography>
        </Box>
      ),
    },
    { field: "appSize", headerName: "App Size", flex: 1 },
    // { field: "version", headerName: "Version", flex: 1 },
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
    <MainCard content={false} title="Installed Apps List">
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
  );
};

export default InstalledApps;
