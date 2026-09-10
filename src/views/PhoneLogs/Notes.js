import React, { useEffect, useState } from "react";
import { CardContent, Divider, Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { GridActionsCellItem } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";
import { useParams } from "react-router-dom";
import ApiUtils from "api/ApiUtils";
import CustomDataGridTable from "helper/CustomDataGridTable";
import { extractDate, extractTime } from "helper/GetDateTimeFormat";

const Notes = () => {
  const urlParam = useParams();
  const userDeviceIdAsNumber = Number(urlParam.userDeviceId);
  const [totalCount, setTotalCount] = useState(0);
  const [notesData, setNotesData] = useState([]);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 10,
  });
  const [open, setOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const handleClose = () => setOpen(false);
  const showNoteModal = (params) => {
    setSelectedNote(params.row);
    setOpen(true);
  };

  useEffect(() => {
    fetchData(`DeviceUserId=${userDeviceIdAsNumber}&Page=${currentPageNumber}&PageSize=10`);
  }, [currentPageNumber]);

  function fetchData(params) {
    ApiUtils.getNotes(params)
      .then((res) => {
        setTotalCount(res.data.data.totalCount);
        const dataTable = res.data.data.listResponse.map((data, index) => ({
          ...data,
          id: index + 1,
        }));
        setNotesData(dataTable);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handlePaginationModelChange = (page) => {
    setCurrentPageNumber(page.page + 1);
    setPaginationModel({
      ...paginationModel,
      page: page.page,
    });
  };

  const columns = [
    { field: "title", headerName: "Title", flex: 1 },
    { field: "content", headerName: "Content", flex: 2 },
    {
      field: "time",
      headerName: "Time",
      flex: 1,
      valueGetter: (params) => extractTime(params.row.logDateTime),
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
      valueGetter: (params) => extractDate(params.row.logDateTime),
    },
    {
      field: "actions",
      headerName: "View",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<RemoveRedEyeIcon />}
          label="view"
          onClick={() => showNoteModal(params)}
        />,
      ],
    },
  ];

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: "12px",
    p: 4,
  };

  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <MainCard content={false} title="Notes">
            <CardContent>
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
                  rows={notesData}
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
              {selectedNote?.title}
            </Typography>
            <CloseIcon className="close-icon-modal" onClick={handleClose} />
          </Box>
          <Divider sx={{ my: 1.5 }} />
          <Typography sx={{ whiteSpace: "pre-wrap", mt: 2 }}>
            {selectedNote?.content}
          </Typography>
          <Divider sx={{ my: 1.5 }} />
          <Typography variant="caption" color="textSecondary">
            {extractDate(selectedNote?.logDateTime)} {extractTime(selectedNote?.logDateTime)}
          </Typography>
        </Box>
      </Modal>
    </>
  );
};

export default Notes;
