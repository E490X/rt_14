import React, { useState } from "react";
import Box from "@mui/material/Box";
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";
import { CardContent, Grid, Stack, TablePagination,Typography } from "@mui/material";
import { Modal, Backdrop, Fade } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useParams } from "react-router-dom";
import { useFetchData } from "helper/useFetchData";
import { GET_GALLERY_LOGS } from "config/ApiNameConstant";

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
function Screenshots() {
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
  };
  return (
    <>
      <MainCard content={false} title="Screenshots">
        <CardContent>
          <Grid container spacing={gridSpacing}>
            {data.length > 0 ? (
              <>
                <Grid item xs={12}>
                  <Grid container justifyContent="start" gap="14px">
                    {data?.map((item) => (
                      <>
                        <Grid>
                          <Box className="video-container">
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

export default Screenshots;
