import React, { useState } from "react";
import Box from "@mui/material/Box";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { extractDate, extractTime } from "helper/GetDateTimeFormat";
import {
  Grid,
  CardContent,
  Chip,
} from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import CustomDatePicker from "helper/CustomDatePicker";
import CustomDataGridTable from "helper/CustomDataGridTable";
import { useFetchData } from "helper/useFetchData";
import { GET_DISCREET_APP_LOGS } from "config/ApiNameConstant";
import { getParamUrl } from "helper/UrlHelper";

const DiscreetAppLogs = () => {
  const urlParam = useParams();
  const userDeviceIdAsNumber = urlParam.userDeviceId;

  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [filterModel, setFilterModel] = useState({ fromDate: "", toDate: "" });
  let params = getParamUrl(filterModel, userDeviceIdAsNumber, currentPageNumber);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });

  const { totalCount, data, fetchData } = useFetchData(
    GET_DISCREET_APP_LOGS,
    params,
    currentPageNumber,
  );

  const columns = [
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.row.action}
          color={params.row.action === "Opened" ? "success" : "error"}
          size="small"
        />
      ),
    },
    { field: "activity", headerName: "Activity", flex: 2 },
    {
      field: "time",
      flex: 1,
      headerName: "Time",
      valueGetter: (params) => extractTime(params.row.messageLogTime),
    },
    {
      field: "date",
      flex: 1,
      headerName: "Date",
      valueGetter: (params) => extractDate(params.row.messageLogTime),
    },
  ];

  const handleSearch = (fromDateISOString, toDateISOString) => {
    const filterData = { fromDate: fromDateISOString, toDate: toDateISOString };
    setFilterModel(filterData);
    fetchData(getParamUrl(filterData, userDeviceIdAsNumber, currentPageNumber));
  };

  const handlePaginationModelChange = (page) => {
    setCurrentPageNumber(page.page + 1);
    setPaginationModel({ ...paginationModel, page: page.page });
  };

  return (
    <MainCard content={false} title="Discreet App Logs">
      <CardContent>
        <Grid container spacing={2}>
          <CustomDatePicker
            onSearch={handleSearch}
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
  );
};

export default DiscreetAppLogs;
