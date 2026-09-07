import React, { useState } from "react";
import Box from "@mui/material/Box";
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";
import {
  Button,
  CardContent,
  Checkbox,
  Grid,
  IconButton,
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
import { useDownloadZip } from "helper/useDownloadZip";
import DownloadIcon from "@mui/icons-material/Download";

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

function Photos() {
  const urlParam = useParams();
  const classes = useStyles();
  const userDeviceIdAsNumber = urlParam.userDeviceId;
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [page, setPage] = useState(0);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [image, setImage] = useState("");
  const params = `DeviceUserId=${userDeviceIdAsNumber}&Page=${currentPageNumber}&PageSize=${12}&FileType=${1}`;
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
    setOpenImageModal(false);
  };

  const handleImage = (value) => {
    setImage(value);
    setOpenImageModal(true);
  }; // Download selected videos
  const { isLoading, error, fetchDownloadZip } = useDownloadZip("downloadZip");

  const handleDownloadSelected = () => {
    if (childCheckedState.length === 0) {
      alert("Please select at least one video to download.");
      return;
    }
    fetchDownloadZip(childCheckedState,"images.zip");
  };
const handleDownload = async (url, name) => {
  try {
    const response = await fetch(url, { mode: "cors" });
    const blob = await response.blob();

    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.setAttribute("download", name || "download");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  } catch (err) {
    console.error("Download failed", err);
  }
};


  return (
    <>
      <MainCard content={false} title="Gallery Photos">
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
                          Check for selecting all Photos
                        </>
                      )}
          {childCheckedState.length > 0 && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleDownloadSelected}
              disabled={childCheckedState.length === 0}
              style={{ marginBottom: "16px" ,float:"right"}}
            >
              Download Selected Photos
            </Button>
          )}
          </Grid>
          <Grid container spacing={gridSpacing}>
            {data.length > 0 ? (
              <>
                <Grid item xs={12}>
                  <Grid container justifyContent="start" gap="14px">
                    {data?.map((item) => (
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
                              onClick={() => handleImage(item)}
                            >
                              <img
                                loading="lazy"
                                src={item.fileUrl}
                                width="100%"
                                height="300px"
                                alt={item.name}
                              />
                              {/* Download Button */}
                            <IconButton
                                onClick={(e) => {
                                  e.stopPropagation(); // prevent triggering handleImage
                                  handleDownload(item.fileUrl, item.name);
                                }}
                                sx={{
                                  position: "absolute",
                                  top: 8,
                                  right: 8,
                                  backgroundColor: "rgba(0,0,0,0.5)",
                                  color: "#fff",
                                  "&:hover": {
                                    backgroundColor: "rgba(0,0,0,0.7)",
                                  },
                                }}
                              >
                                <DownloadIcon />
                              </IconButton> 
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
        open={openImageModal}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openImageModal} timeout={500} className={classes.img}>
          <img
            src={image.fileUrl}
            alt={image.name}
            style={{ maxHeight: "90%", maxWidth: "90%" }}
          />
        </Fade>
      </Modal>
    </>
  );
}

export default Photos;
