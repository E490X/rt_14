import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
// project imports
import InactiveUsersCard from "./InactiveUsersCard";
import NewMemberCard from "./NewMemberCard";
import { gridSpacing } from "store/constant";
import ApiUtils from "api/ApiUtils";
import TotalDownloads from "./TotalDownloads";
import ActiveUserCard from "./ActiveUserCard";
import DownloadLineChart from "./DownloadLineChart";
import RecentDeviceList from "./RecentDeviceList";
import Charts from "./Charts";

const Dashboard = () => {
  const [isLoading, setLoading] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({});
  // useEffect(() => {
  //     setLoading(false);
  // }, []);

  useEffect(() => {
    ApiUtils.getAnalyticsDetails()
      .then((res) => {
        setAnalyticsData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={3} md={6} sm={6} xs={12}>
            <TotalDownloads
              isLoading={isLoading}
              analyticsData={analyticsData}
            />
          </Grid>

          <Grid item lg={3} md={6} sm={6} xs={12}>
            <NewMemberCard
              isLoading={isLoading}
              analyticsData={analyticsData}
            />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={12}>
            <ActiveUserCard
              isLoading={isLoading}
              analyticsData={analyticsData}
            />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={12}>
            <InactiveUsersCard
              isLoading={isLoading}
              analyticsData={analyticsData}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} md={6}>
            <DownloadLineChart />
          </Grid>
          <Grid item xs={12} md={6}>
            <Charts title='New Members' />
          </Grid>
          <Grid item xs={12} md={6}>
            <Charts title='Active Users' />
          </Grid>
          <Grid item xs={12} md={6}>
            <Charts title='Inactive Users' />
          </Grid>
          <Grid item xs={12} md={12}>
            <RecentDeviceList />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
