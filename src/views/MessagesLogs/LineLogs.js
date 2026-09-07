import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import ApiUtils from "api/ApiUtils";
import Modal from "@mui/material/Modal";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { extractDate, extractTime, formatDate, formatTimestampToTime } from "helper/GetDateTimeFormat";
import { Typography, Grid, Divider, CardContent, Checkbox } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import CustomDatePicker from "helper/CustomDatePicker";
import CustomDataGridTable from "helper/CustomDataGridTable";
import { useFetchData } from "helper/useFetchData";
import { GET_LINE_LOGS } from "config/ApiNameConstant";
import { getParamUrl } from "helper/UrlHelper";
import useCommonCheckbox from "views/useCommonCheckbox";

const LineLogs = () => {
  const urlParam = useParams();
  const userDeviceIdAsNumber = urlParam.userDeviceId;
  const [chatData, setChatData] = useState([]);
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
  const [open, setOpen] = React.useState(false);
  const handleClose = () => setOpen(false);
  const { totalCount, data, fetchData } = useFetchData(
    GET_LINE_LOGS,
    params,
    currentPageNumber
  );
  
  const {
          childCheckedState,
          parentChecked,
          handleParentCheckboxChange,
          handleChildCheckboxChange,
        } = useCommonCheckbox(data, "contactNumber");
    const handleExportExcel = async (fromDate, toDate) => {
            try {
              const idsToSend =
                childCheckedState.length > 0
                  ? childCheckedState
                  : [];
                  
              // data.map(item => item.lineId);
              // if (!idsToSend.length) {
              //   alert("No data available to export");
              //   return;
              // }
          
              const response = await ApiUtils.getMessagesByExcel(
                6, 
                userDeviceIdAsNumber,        
                fromDate,
                toDate,
                idsToSend  
              );
          
              const url = window.URL.createObjectURL(
                new Blob([response.data])
              );
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", "line-messages.xlsx");
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
          
            } catch (err) {
              console.error("Export failed", err);
            }
          };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    height: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    border: "none",
    p: 4,
  };
  function fetchDataofChats(params) {
    ApiUtils.getLineByContactPersonName(params)
      .then((res) => {
        const dataTable = res.data.data.listResponse.map((data, index) => ({
          ...data,
          id: index + 1,
          time: extractTime(data.messageLogTime),
          date: extractDate(data.messageLogTime),
        }));
        setChatData(dataTable);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  const showChatModal = (name) => {
    setChatData([]);
    let paramsForChat = `DeviceUserId=${userDeviceIdAsNumber}&contactPersonName=${name}`;
    fetchDataofChats(paramsForChat);
    setOpen(true);
  };
  const columns = [
    {
                      field: "parentBox", // Give the column a unique ID
                      headerName: (
                        <Checkbox
                          className="parentCheckbox"
                          type="checkbox"
                          checked={parentChecked}
                          onChange={handleParentCheckboxChange}
                        />
                      ),
                      flex: 1,
                      type: "actions",
                      renderCell: (params) => (
                        <div>
                          <Checkbox
                            type="checkbox"
                            checked={childCheckedState?.includes(params?.row?.contactNumber)}
                            onChange={(e) =>
                              handleChildCheckboxChange(e, params?.row?.contactNumber)
                            }
                          />
                        </div>
                      ),
                    },
    { field: "contactPersonName", headerName: "Contact Person", flex: 1 },
    { field: "message", headerName: "Message", flex: 1 },
    {
      field: "time",
      flex: 1,
      headerName: "Time",
      valueGetter: (params) => {
        return extractTime(params.row.messageLogTime);
      },
    },
    {
      field: "date",
      flex: 1,
      headerName: "Date",
      valueGetter: (params) => {
        return extractDate(params.row.messageLogTime);
      },
    },
    {
      field: "actions",
      headerName: "View Chat",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<RemoveRedEyeIcon />}
          label="map"
          onClick={() => showChatModal(params.row.contactPersonName)}
        />,
      ],
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
      <MainCard content={false} title="Line Messages Logs">
        <CardContent>
          <Grid container spacing={2}>
            <CustomDatePicker onSearch={handleSearch} onExportExcelFile={handleExportExcel}
  data={data} showExportExcel={true}/>
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
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: "15px",
            }}
          >
            <Typography id="modal-modal-title" variant="h2" component="h2">
              Chats
            </Typography>
            <CloseIcon className="close-icon-modal" onClick={handleClose} />
          </Box>
          <Divider sx={{ my: 1.5 }} />

          <CardContent
            sx={{ maxHeight: "500px", overflowY: "auto", overflowX: "hidden" }}
          >
            <section className="msger">
              <main className="msger-chat">
                {chatData.length > 0 &&
                  chatData.map((chat) => {
                    return (
                      <>
                        <div
                          className={
                            chat.messageType === "Incoming"
                              ? "msg left-msg"
                              : "msg right-msg"
                          }
                        >
                          <div className="msg-bubble">
                            <div className="msg-info">
                              <div className="msg-info-name">{chat.name}</div>
                              <div className="msg-info-time">
                                {chat.time} {chat.date}
                              </div>
                            </div>
                            <div className="msg-text">{chat.message}</div>
                          </div>
                        </div>
                      </>
                    );
                  })}
              </main>
            </section>
          </CardContent>
        </Box>
      </Modal>
    </>
  );
};

export default LineLogs;
