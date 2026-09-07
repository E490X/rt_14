import React, { useState } from "react";
import Box from "@mui/material/Box";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { formatDate, formatTimestampToTime } from "helper/GetDateTimeFormat";
import { Typography, Grid, CardContent } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import CustomDatePicker from "helper/CustomDatePicker";
import LanguageIcon from "@mui/icons-material/Language";
import LinkIcon from "@mui/icons-material/Link";
import CustomDataGridTable from "helper/CustomDataGridTable";
import { useFetchData } from "helper/useFetchData";
import { GET_INTERNET_HISTORY_LOGS } from "config/ApiNameConstant";
import { getParamUrl } from "helper/UrlHelper";
const InternetHistory = () => {
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
    GET_INTERNET_HISTORY_LOGS,
    params,
    currentPageNumber
  );
  const columns = [
    {
      field: "number",
      headerName: "Site Name",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <LanguageIcon sx={{ color: "#5e35b1", fontSize: "18px" }} />
          <Typography
            sx={{ fontSize: "0.875rem", color: "#616161" }}
            variant="subtitle2"
          >
            {params.row.number}
          </Typography>
        </Box>
      ),
    },
    {
      field: "message",
      headerName: "Website URL",
      flex: 1,

      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <LinkIcon sx={{ color: "#5e35b1", fontSize: "18px" }} />
          <Typography
            sx={{ fontSize: "0.875rem", color: "#616161" }}
            variant="subtitle2"
          >
            {params.row.webUrl}
          </Typography>
        </Box>
      ),
    },
    { field: "visit", headerName: "Visit Count", flex: 1 },
    {
      field: "time",
      flex: 1,
      headerName: "Time",
      valueGetter: (params) => {
        return formatTimestampToTime(params.row.webLogTime);
      },
    },
    {
      field: "date",
      flex: 1,
      headerName: "Date",
      valueGetter: (params) => {
        return formatDate(params.row.webLogTime);
      },
    },
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
      <MainCard content={false} title="Internet Browsing History">
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
    </>
  );
};

export default InternetHistory;
