import React, { useState } from "react";
import Box from "@mui/material/Box";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { extractDate, extractTime } from "helper/GetDateTimeFormat";
import { CardContent, Grid, Chip } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import CustomDatePicker from "helper/CustomDatePicker";
import CustomDataGridTable from "helper/CustomDataGridTable";
import { useFetchData } from "helper/useFetchData";
import { GET_LINKEDIN_LOGS } from "config/ApiNameConstant";
import { getParamUrl } from "helper/UrlHelper";

const LinkedInLogs = () => {
  const urlParam = useParams();
  const userDeviceIdAsNumber = urlParam.userDeviceId;
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [filterModel, setFilterModel] = useState({ fromDate: "", toDate: "" });
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  let params = getParamUrl(filterModel, userDeviceIdAsNumber, currentPageNumber);

  const { totalCount, data, fetchData } = useFetchData(
    GET_LINKEDIN_LOGS,
    params,
    currentPageNumber
  );

  const notificationTypeColor = (type) => {
    switch ((type || "").toLowerCase()) {
      case "like": return "primary";
      case "comment": return "secondary";
      case "connection": return "success";
      case "message": return "info";
      case "jobalert": return "warning";
      default: return "default";
    }
  };

  const columns = [
    { field: "senderName", headerName: "Sender", flex: 1 },
    {
      field: "notificationText",
      headerName: "Notification",
      flex: 2,
      renderCell: (params) => (
        <Box sx={{ whiteSpace: "normal", wordBreak: "break-word", py: 0.5 }}>
          {params.row.notificationText}
        </Box>
      ),
    },
    {
      field: "notificationType",
      headerName: "Type",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.row.notificationType || "—"}
          color={notificationTypeColor(params.row.notificationType)}
          size="small"
        />
      ),
    },
    {
      field: "time",
      flex: 0.8,
      headerName: "Time",
      valueGetter: (params) => extractTime(params.row.receivedAt),
    },
    {
      field: "date",
      flex: 0.8,
      headerName: "Date",
      valueGetter: (params) => extractDate(params.row.receivedAt),
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
    <MainCard content={false} title="LinkedIn Notifications">
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

export default LinkedInLogs;
