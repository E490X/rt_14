import React, { useState } from "react";
import Box from "@mui/material/Box";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { CardContent, Grid } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import CustomDataGridTable from "helper/CustomDataGridTable";
import CustomDatePicker from "helper/CustomDatePicker";
import { useFetchData } from "helper/useFetchData";
import { GET_APPLE_HEALTH_LOGS } from "config/ApiNameConstant";
import { extractDate, extractTime } from "helper/GetDateTimeFormat";
import { getParamUrl } from "helper/UrlHelper";

const AppleHealth = () => {
  const urlParam = useParams();
  const userDeviceIdAsNumber = urlParam.userDeviceId;
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [filterModel, setFilterModel] = useState({ fromDate: "", toDate: "" });
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  let params = getParamUrl(filterModel, userDeviceIdAsNumber, currentPageNumber);

  const { totalCount, data, fetchData } = useFetchData(
    GET_APPLE_HEALTH_LOGS,
    params,
    currentPageNumber
  );

  const columns = [
    { field: "heartRate", headerName: "Heart Rate (bpm)", flex: 1 },
    { field: "sleepStage", headerName: "Sleep Stage", flex: 1 },
    { field: "mobility", headerName: "Mobility", flex: 1 },
    {
      field: "bloodOxygen",
      headerName: "Blood Oxygen (%)",
      flex: 1,
      valueGetter: (params) =>
        params.row.bloodOxygen != null ? `${params.row.bloodOxygen}%` : "-",
    },
    {
      field: "time",
      flex: 1,
      headerName: "Time",
      valueGetter: (params) => extractTime(params.row.logDateTime),
    },
    {
      field: "date",
      flex: 1,
      headerName: "Date",
      valueGetter: (params) => extractDate(params.row.logDateTime),
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
    <MainCard content={false} title="Apple Health Data">
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
  );
};

export default AppleHealth;
