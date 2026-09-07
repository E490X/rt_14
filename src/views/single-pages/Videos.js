import React, { useState } from "react";
import Box from "@mui/material/Box";
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";
import {
  Button,
  CardContent,
  Checkbox,
  Grid,
  Stack,
  TablePagination,
  Typography,
} from "@mui/material";
import { Modal, Backdrop, Fade } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useParams } from "react-router-dom";
import { useFetchData } from "helper/useFetchData";
import { GET_GALLERY_LOGS } from "config/ApiNameConstant";
import useCommonCheckbox from "views/useCommonCheckbox";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useDownloadZip } from "helper/useDownloadZip";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    "&:hover": {
      backgroundcolor: "red",
    },
  },
  img: {
    outline: "none",
  },
}));
function Videos() {
  const classes = useStyles();
  const urlParam = useParams();
  const userDeviceIdAsNumber = urlParam.userDeviceId;
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [page, setPage] = useState(0);
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [video, setVideo] = useState("");
  const params = `DeviceUserId=${userDeviceIdAsNumber}&Page=${currentPageNumber}&PageSize=${12}&FileType=${2}`;

  const { totalCount, data, fetchData } = useFetchData(
    GET_GALLERY_LOGS,
    params,
    currentPageNumber
  );
  // checkbox logic
  const {
    childCheckedState,
    parentChecked,
    handleParentCheckboxChange,
    handleChildCheckboxChange,
    setParentChecked,
    setChildCheckedState,
  } = useCommonCheckbox(data, "galleryId");

  const handleChangePage = (e, page) => {
    setCurrentPageNumber(page + 1);
    setPage(page);
  };
  const handleClose = () => {
    setOpenVideoModal(false);
  };

  const handleVideo = (value) => {
    setVideo(value);
    setOpenVideoModal(true);
  };

  // Download selected videos
  const { isLoading, error, fetchDownloadZip } = useDownloadZip("downloadZip");

  const handleDownloadSelected = () => {
    if (childCheckedState.length === 0) {
      alert("Please select at least one video to download.");
      return;
    }
    fetchDownloadZip(childCheckedState, "videos.zip");
  };

  return (
    <>
      <MainCard content={false} title="Gallery Videos">
        <CardContent>
          <Grid item >
            {data?.length > 0 && (
              <>
                <Checkbox
                  className="parentCheckbox"
                  type="checkbox"
                  checked={parentChecked}
                  onChange={handleParentCheckboxChange}
                  
                />
                Check for selecting all videos
              </>
            )}
          
          {childCheckedState?.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownloadSelected}
              disabled={childCheckedState.length === 0}
              style={{ marginBottom: "16px", float: "right" }}
            >
              Download Selected Videos
            </Button>
          )}
</Grid>
          <Grid container spacing={gridSpacing}>
            {data.length > 0 ? (
              <>
                <Grid item xs={12}>
                  <Grid container justifyContent="start" gap="14px">
                    {data.map((item) => (
                      <>
                        <Grid>
                          <Box className="video-container">
                            <div>
                              <Checkbox
                                type="checkbox"
                                checked={childCheckedState?.includes(
                                  item?.galleryId
                                )}
                                onChange={(e) =>
                                  handleChildCheckboxChange(e, item?.galleryId)
                                }
                                sx={{ float: "right" }}
                              />
                            </div>
                            <Stack
                              className="video-container-stack"
                              onClick={() => handleVideo(item)}
                            >
                              <video
                                src={item.fileUrl}
                                width="100%"
                                height="300px"
                                controls
                              />
                            </Stack>
                          </Box>
                        </Grid>
                      </>
                    ))}
                  </Grid>
                </Grid>
                <TablePagination
                  component="div"
                  count={totalCount}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={12}
                  labelRowsPerPage=""
                  sx={{
                    "& .MuiSelect-select": {
                      display: "none !important",
                    },
                    "& > div.MuiToolbar-root > div.MuiInputBase-root > svg": {
                      display: "none !important",
                    },
                  }}
                />
              </>
            ) : (
              <Grid item>
                <Typography
                  variant="h4"
                  color="inherit"
                  sx={{ fontWeight: "500" }}
                >
                  No data to display
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </MainCard>
      <Modal
        className={classes.modal}
        open={openVideoModal}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openVideoModal} timeout={500} className={classes.img}>
          <video
            src={video.fileUrl}
            style={{ maxHeight: "90%", maxWidth: "90%" }}
            controls
          />
        </Fade>
      </Modal>
    </>
  );
}

export default Videos;
