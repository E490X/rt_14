import React, { useState } from "react";
import Box from "@mui/material/Box";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { Typography, Grid, CardContent } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import CustomDataGridTable from "helper/CustomDataGridTable";
import CustomDatePicker from "helper/CustomDatePicker";
import Wifi1BarIcon from "@mui/icons-material/Wifi1Bar";
import Wifi2BarIcon from "@mui/icons-material/Wifi2Bar";
import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import { useFetchData } from "helper/useFetchData";
import { GET_WIFI_NETWROK_LOGS } from "config/ApiNameConstant";
import { getParamUrl } from "helper/UrlHelper";
const WifiNetwork = () => {
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
    GET_WIFI_NETWROK_LOGS,
    params,
    currentPageNumber
  );
  console.log("🚀 ~ file: WifiNetwork.js:25 ~ WifiNetwork ~ data:", data);

  const columns = [
    {
      field: "wiFINetworkName",
      headerName: "Network Name",
      flex: 1,
      // renderCell: (params) => (
      //   <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
      //     <WifiPasswordIcon sx={{ color: "#1E88E5", fontSize: "18px" }} />
      //     <Typography
      //       sx={{ fontSize: "0.875rem", color: "#616161" }}
      //       variant="subtitle2"
      //     >
      //       {params.row.wiFINetworkName}
      //     </Typography>
      //   </Box>
      // ),
    },
    {
      field: "strength",
      headerName: "Signal Strength",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {!params.row.strength ? (
            <WifiOffIcon sx={{ color: "#1E88E5", fontSize: "18px" }} />
          ) : params.row.strength <= -71 && params.row.strength >= -90 ? (
            <Wifi1BarIcon sx={{ color: "#1E88E5", fontSize: "18px" }} />
          ) : params.row.strength <= -51 && params.row.strength >= -70 ? (
            <Wifi2BarIcon sx={{ color: "#1E88E5", fontSize: "18px" }} />
          ) : params.row.strength <= -30 && params.row.strength >= -50 ? (
            <WifiIcon sx={{ color: "#1E88E5", fontSize: "18px" }} />
          ) : params.row.strength <= -90 ? (
            <Wifi1BarIcon sx={{ color: "#1E88E5", fontSize: "18px" }} />
          ) : (
            ""
          )}

          <Typography
            sx={{ fontSize: "0.875rem", color: "#616161" }}
            variant="subtitle2"
          >
            {params.row.strength}
          </Typography>
        </Box>
      ),
    },
  ];
  const handlePaginationModelChange = (page) => {
    setCurrentPageNumber(page.page + 1);
    setPaginationModel({
      ...paginationModel,
      page: page.page,
    });
  };
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
      <MainCard content={false} title="Wifi Networks List">
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

export default WifiNetwork;
