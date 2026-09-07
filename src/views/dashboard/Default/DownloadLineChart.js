import ApiUtils from "api/ApiUtils";
import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import MainCard from "ui-component/cards/MainCard";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
const initialChartData = {
  labels: [],
  datasets: [
    {
      label: "Downloads",
      data: [],
      fill: true,
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
    },
  ],
};
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
function DownloadLineChart() {
  const [chartData, setChartData] = useState(initialChartData);
  const [selectedYear, setSelectedYear] = useState(2023);

  useEffect(() => {
    ApiUtils.getDownloadYearChart(selectedYear)
      .then((res) => {
        const newChartData = {
          labels: res.data.data.map((d) => d.month),
          datasets: [
            {
              ...chartData.datasets[0],
              data: res.data.data.map((d) => d.androidCount + d.iphoneCount),
            },
          ],
        };
        setChartData(newChartData);
      })
      .catch((err) => {
        console.log("🚀 ~ file: Dashboard.tsx:39 ~ ).then ~ err:", err);
      });
  }, [selectedYear]);
  const handleSelectYear = (e) => {
    setSelectedYear(e.target.value);
  };

  return (
    <MainCard title="Download App By Year">
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth sx={{mb:3}}>
          <InputLabel id="demo-simple-select-label">Select Year</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedYear}
            label="Select Year"
            onChange={handleSelectYear}
            defaultValue={selectedYear}
          >
            <MenuItem value={2023}>2023</MenuItem>
            <MenuItem value={2024}>2024</MenuItem>
            <MenuItem value={2025}>2025</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Line data={chartData} options={options} />
    </MainCard>
  );
}
export default DownloadLineChart;
