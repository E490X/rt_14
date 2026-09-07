import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { CardContent, Divider, Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import MainCard from "ui-component/cards/MainCard";
import { useParams } from "react-router-dom";
import { gridSpacing } from "store/constant";
import CustomDataGridTable from "helper/CustomDataGridTable";
// import { formatTimestampToTime } from "helper/GetDateTimeFormat";
import AndroidIcon from "@mui/icons-material/Android";
import { useFetchData } from "helper/useFetchData";
import { GET_SCREEN_TIME_DETAILS } from "config/ApiNameConstant";
import ApiUtils from "api/ApiUtils";
import CustomDatePicker from "helper/CustomDatePicker";
ChartJS.register(ArcElement, Tooltip, Legend);

const ScreenTime = () => {
  const urlParam = useParams();
  const userDeviceIdAsNumber = Number(urlParam.userDeviceId);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const paramsForList = `DeviceUserId=${userDeviceIdAsNumber}&Page=${currentPageNumber}&PageSize=${10}`;
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [topFiveApp, setTopFiveApp] = useState([]);
  const [totalTime, setTotalTime] = useState(null);
  const [totalScreenTime, setTotalScreenTime] = useState(null);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });
  const { totalCount, data, fetchData } = useFetchData(
    GET_SCREEN_TIME_DETAILS,
    paramsForList,
    currentPageNumber
  );
  useEffect(() => {
    if (toDate === fromDate) {
      const yesterday = new Date(fromDate);
      yesterday.setDate(yesterday.getDate() - 1);
      setToDate(new Date(toDate).toISOString());
      const paramsForTop = `DeviceUserId=${userDeviceIdAsNumber}&Page=${currentPageNumber}&PageSize=${10}&FromDate=${new Date(
        yesterday
      ).toISOString()}&ToDate=${toDate}`;
      fetchTopFiveApp(paramsForTop);
    } else {
      setFromDate(new Date(fromDate).toISOString());
      setToDate(new Date(toDate).toISOString());
      const paramsForTop = `DeviceUserId=${userDeviceIdAsNumber}&Page=${currentPageNumber}&PageSize=${10}&FromDate=${fromDate}&ToDate=${toDate}`;
      fetchTopFiveApp(paramsForTop);
    }
  }, [fromDate, toDate]);
  const fetchTopFiveApp = (params) => {
    ApiUtils.getTopAppScreenTime(params)
      .then((res) => {
        if (res.status === 200) {
          setTopFiveApp(res.data.data.appName);
          setTotalTime(res.data.data.totalTime);
          setTotalScreenTime(res.data.data.totalScreenTime);
        }
      })
      .catch((err) => console.log(err));
  };

  const chartData = {
    labels: ["Total Minutes", "Screen Time"],
    datasets: [
      {
        label: "Total",
        data: [totalTime, totalScreenTime],
        backgroundColor: ["#2196F3", "#E3F2FD"],
        borderColor: ["#2196F3", "#a6d4f9"],
        borderWidth: 1,
      },
    ],
  };

  const timeFormat = (time) => {
    const totalSeconds = parseInt(time) * 60; // Convert minutes to seconds
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let formattedTime = "";

    if (hours > 0) {
      formattedTime += `${hours} ${hours === 1 ? "hour" : "hours"}`;
    }

    if (minutes > 0 || hours > 0) {
      formattedTime += ` ${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
    }

    if (seconds > 0 || (hours === 0 && minutes === 0)) {
      formattedTime += ` ${seconds} ${seconds === 1 ? "second" : "seconds"}`;
    }

    return formattedTime.trim();
  };

  const columns = [
    {
      field: "appName",
      headerName: "Application Name",
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* <AndroidIcon sx={{ color: "#1E88E5", fontSize: "18px" }} /> */}
          <Typography
            sx={{ fontSize: "0.875rem", color: "#616161" }}
            variant="subtitle2"
          >
            {params.row.appName}
          </Typography>
        </Box>
      ),
    },
    {
      field: "screenTimeDuration",
      flex: 1,
      headerName: "Time",
      valueGetter: (params) => {
        return timeFormat(params.row.screenTimeDuration);
      },
    },
  ];
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Number of Downloads",
      },
    },
  };
  const handlePaginationModelChange = (page) => {
    setCurrentPageNumber(page.page + 1);
    setPaginationModel({
      ...paginationModel,
      page: page.page,
    });
  };
  const handleSearch = (fromDateISOString, toDateISOString) => {
    const paramsFilterData = `DeviceUserId=${userDeviceIdAsNumber}&Page=${currentPageNumber}&PageSize=${10}&FromDate=${fromDateISOString}&ToDate=${toDateISOString}`;
    if (fromDateISOString && toDateISOString) {
      fetchTopFiveApp(paramsFilterData);
    }
  };
  return (
    <>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <CustomDatePicker onSearch={handleSearch} data={data} />
      </Grid>
      {/* <CustomDatePicker onSearch={handleSearch} data={data} /> */}
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} md={6}>
          <MainCard content={false} title="Top 5 Launched Apps (frequency)">
            <CardContent className="top-five-app">
              {topFiveApp?.map((userinfo, i) => {
                return (
                  <>
                    <Grid item className="single-contact" key={i}>
                      <Typography variant="subtitle1" color="inherit">
                        {userinfo}
                      </Typography>
                    </Grid>
                    <Divider sx={{ my: 1.5 }} />
                  </>
                );
              })}
            </CardContent>
          </MainCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <MainCard content={false} title="Total Screen Time">
            <CardContent className="contacts-list">
              <Box sx={{ width: "280px", height: "280px", margin: "0 auto" }}>
                <Pie data={chartData} options={options} />
              </Box>
            </CardContent>
          </MainCard>
        </Grid>

        <Grid item xs={12}>
          <MainCard content={false} title="Most Used Apps (duration)">
            <CardContent>
              <Grid container spacing={2}>
                {/* <Custom onSearch={handleSearch} /> */}
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
        </Grid>
      </Grid>
    </>
  );
};

ScreenTime.propTypes = {
  isLoading: PropTypes.bool,
};

export default ScreenTime;
