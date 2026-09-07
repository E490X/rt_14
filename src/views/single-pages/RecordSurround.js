import React, { useState } from "react";
import Box from "@mui/material/Box";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { formatDate, formatTimestampToTime } from "helper/GetDateTimeFormat";
import { Typography, Grid, CardContent } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import CustomDataGridTable from "helper/CustomDataGridTable";
import CustomDatePicker from "helper/CustomDatePicker";
import AndroidIcon from "@mui/icons-material/Android";
import { useFetchData } from "helper/useFetchData";
import { GET_RECORD_SURROUND_LOGS } from "config/ApiNameConstant";
import { getParamUrl } from "helper/UrlHelper";
const RecordSurround = () => {
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
    GET_RECORD_SURROUND_LOGS,
    params,
    currentPageNumber
  );

  const columns = [
    {
      field: "name",
      headerName: "File Name",
      flex: 1,
    },
    {
      field: "time",
      flex: 1,
      headerName: "Time",
      valueGetter: (params) => {
        return formatTimestampToTime(params.row.logDateTime);
      },
    },
    {
      field: "date",
      flex: 1,
      headerName: "Date",
      valueGetter: (params) => {
        return formatDate(params.row.logDateTime);
      },
    },
    {
      field: "actions",
      headerName: "Play Recording",
      type: "actions",
      width: 280,
      // flex: 1,
      getActions: (params) => [
        // <GridActionsCellItem
        //   icon={<MicIcon />}
        //   label="Delete"
        //   // onClick={deleteUser(params.id)}
        // />,
        <audio
          src={params.row.fileUrl}
          controls
        />,
      ],
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
      <MainCard content={false} title="Record Surrounding List">
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

export default RecordSurround;
