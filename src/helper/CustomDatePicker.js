import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";

function CustomDatePicker({
  onSearch,
  onOpenMapModal,
  onExportExcelFile,
  data,
  showExportExcel = false,
}) {
  const Location = useLocation().pathname.split("/").slice(0, 3).join("/");
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
const [errorText, setErrorText] = useState("");
  const onSearchWithDate = () => {
    // if (fromDate !== null && toDate !== null) {
    const fromDateISOString =
      fromDate !== null ? new Date(fromDate).toISOString() : "";
    const toDateISOString =
      toDate !== null ? new Date(toDate).toISOString() : "";
    onSearch(fromDateISOString, toDateISOString);
    // }
  };
  const showAllSearchedLocation = () => {
    if (fromDate != null && toDate != null) {
      const fromDateISOString =
        fromDate != null ? new Date(fromDate).toISOString() : "";
      const toDateISOString =
        toDate != null ? new Date(toDate).toISOString() : "";
      onOpenMapModal(fromDateISOString, toDateISOString);
    }
  };
  const ExportExcel = () => {

  const fromDateISOString =
    fromDate != null ? new Date(fromDate).toISOString() : "";
  const toDateISOString =
    toDate != null ? new Date(toDate).toISOString() : "";

  if (onExportExcelFile) {
    onExportExcelFile(fromDateISOString, toDateISOString);
  } else {
    console.error("❌ onExportExcelFile is NOT passed as prop");
  }
};

  const onExportExcel = () => {
    const fromDateISOString =
      fromDate != null ? new Date(fromDate).toISOString() : "";
    const toDateISOString =
      toDate != null ? new Date(toDate).toISOString() : "";
    onExportExcelFile(fromDateISOString, toDateISOString);
  };
  useEffect(() => {
    if (fromDate !== null) {
      onSearchWithDate();
    }
  }, [fromDate]);
const onReset = () => {
    setFromDate(null);
    setToDate(null);
   
    onSearch(null, null);
  };
  return (
    <>
      <Grid item className="date-picker-container">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          
          <DateTimePicker
            label="Select From Date & Time"
            value={fromDate}
            onChange={(newValue) => {
              if (newValue && newValue.isValid()) {

                setFromDate(newValue); // ✅ sets when valid
              }
            }}
            onError={(reason, value) => {
              // reason: 'invalidDate' | 'disablePast' | ...
              if (reason === "invalidDate") {
                // console.warn("Invalid manual input:", value);
                setFromDate(null); // reset or keep last valid value

               
              }
            }}
            format="MM/DD/YYYY HH:mm"
            ampm={false}
            slotProps={{
              textField: {

                placeholder: "MM/DD/YYYY HH:mm",

              },
            }}
          />

          <IconButton
            style={{ padding: 0 }}
            edge="end"
            size="small"
            disabled={!fromDate}
            onClick={() => setFromDate(null)}
          >
            <CloseIcon />
          </IconButton>
        </LocalizationProvider>
      </Grid>
      <Grid item className="date-picker-container1">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {/* <DateTimePicker
            label="Select To Date & Time"
            onChange={(date) => setToDate(date.$d)}
            value={toDate}
            minDate={dayjs(fromDate)}
          /> */}
          <DateTimePicker
            label="Select To Date & Time"
            value={toDate}
            minDateTime={fromDate ? dayjs(fromDate) : undefined} // ✅ correct prop
            onChange={(newValue) => {
              if (newValue && newValue.isValid()) {
                // Only set if it's >= fromDate
                if (!fromDate || newValue.isAfter(fromDate)) {
                  setToDate(newValue);
                  setErrorText("");
                } else {
                  setErrorText("To Date must be after From Date");
                  console.warn("Selected date is before From Date");
                  setToDate(null); // or keep last valid value
                }
              }
            }}
            onError={(reason, value) => {
              if (reason === "invalidDate") {
                console.warn("Invalid manual input:", value);
                setToDate(null);
              }
            }}
            format="MM/DD/YYYY HH:mm"
            ampm={false}
            slotProps={{
              textField: {
                placeholder: "MM/DD/YYYY HH:mm",
              },
            }}
          />
          <IconButton
            style={{ padding: 0 }}
            edge="end"
            size="small"
            disabled={!toDate}
            onClick={() => setToDate(null)}
          >
            <CloseIcon />
          </IconButton>
          <br></br>
          <p className="mt-1">{errorText}</p>
        </LocalizationProvider>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onSearchWithDate()}
          size="large"
          sx={{ mr: 2, borderRadius: "12px" }}
          disabled={fromDate === null || toDate === null}
        >
          Search
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => onReset()}
          size="large"
          sx={{ mr: 2, borderRadius: "12px" }}
          disabled={!fromDate || !toDate}
        >
          Reset
        </Button>
        {showExportExcel &&
          <Button
          variant="contained"
          color="primary"
          onClick={() => ExportExcel()}
          size="large"
          disabled={!(data?.length > 0)}
        >
          Export Excel
        </Button>}
        {(Location === "/user/sms-logs" || Location === "/user/call-logs") && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => onExportExcel()}
            size="large"
            disabled={!(data.length > 0)}
          >
            Export Excel
          </Button>
        )}
      </Grid>
      {Location === "/user/locations" && (
        <Grid item>
          <Button
            variant="contained"
            size="large"
            onClick={showAllSearchedLocation}
            disabled={!(fromDate != null && toDate != null)}
          >
            Open Map
          </Button>
        </Grid>
      )}
      {Location === "/user/locations" && (
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={() => onExportExcel()}
            size="large"
            disabled={!(data.length > 0)}
          >
            Export Excel
          </Button>
        </Grid>
      )}
    </>
  );
}

export default CustomDatePicker;
