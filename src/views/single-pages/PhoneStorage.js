import React, { useState } from "react";
import Box from "@mui/material/Box";
import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";
import {
  Breadcrumbs,
  Button,
  CardContent,
  Checkbox,
  Grid,
  IconButton,
  Stack,
  TablePagination,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { Modal, Backdrop, Fade } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useParams } from "react-router-dom";
import { useFetchData } from "helper/useFetchData";
import {
  GET_UPLOADDOCUMENT_FOLDERS,
  GET_GALLERY_LOGS,
} from "config/ApiNameConstant";
import useCommonCheckbox from "views/useCommonCheckbox";
// import CommonDeleteModal from "views/CommonDeleteModal";
import ApiUtils from "api/ApiUtils";
// import CommonImageModal from "views/CommonImageModal";
// import CommonFolderUploadModal from "views/CommonFolderUploadModal";
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
import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { FaDownload } from "react-icons/fa6";
import { useDownloadZip } from "views/useDownloadZip";
// import { IconTrash } from "@tabler/icons";
// import Swal from "sweetalert2";

function Phonestorage() {
  const classes = useStyles();
  const urlParam = useParams();
  const userDeviceIdAsNumber = urlParam.userDeviceId;
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [page, setPage] = useState(0);
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [video, setVideo] = useState("");
  const params = `DeviceUserId=${userDeviceIdAsNumber}&Page=${currentPageNumber}&PageSize=${10}`;
  const [openFolderModal, setOpenFolderModal] = useState(false);
  const [filesDetail, setFilesDetail] = useState();
  const [currentFolderId, setCurrentFolderId] = useState();
  const [pathStack, setPathStack] = useState([]);
  const { totalCount, data, fetchData } = useFetchData(
    GET_UPLOADDOCUMENT_FOLDERS,
    params,
    currentPageNumber
  );

  const {
    childCheckedState,
    parentChecked,
    handleParentCheckboxChange,
    handleChildCheckboxChange,
    setParentChecked,
    setChildCheckedState,
  } = useCommonCheckbox(data, "folderId");
//   const handleDelete = async (data, setParentChecked, setChildCheckedState) => {
//     // Call the CommonDeleteModal
//     await CommonDeleteModal({
//       data,
//       fetchData, // Refresh data after deletion
//       onError: (error) => {
//         console.error("Delete error:", error); // Handle errors
//       },
//       deleteFuntion: ApiUtils.DeleteRange,
//       Url: "UploadDocumentsFolder/DeleteRange",
//       setParentChecked,
//       setChildCheckedState,
//     });
//   };
  const handleChangePage = (e, page) => {
    setCurrentPageNumber(page + 1);
    setPage(page);
  };
  const handleClose = () => {
    setOpenVideoModal(false);
  };

  const handleFolderClick = async (value) => {
    if (checkFile(value?.rootName) == "file") return;
    const payload = {
      folderId: value?.folderId,
      deviceUserId: userDeviceIdAsNumber,
      currentPath: value?.rootName,
    };
    const response = await ApiUtils.FolderDetailed(
      "UploadDocumentsFolder/ExploreFolder",
      payload,
      userDeviceIdAsNumber
    );
    setCurrentFolderId(value?.folderId);
    setPathStack([value?.rootName]); // <-- important
    setFilesDetail(response?.data?.data?.result);
  };

  const handleSubFolderClick = async (path) => {
    const payload = {
      folderId: currentFolderId,
      deviceUserId: userDeviceIdAsNumber,
      currentPath: path,
    };
    const response = await ApiUtils.FolderDetailed(
      "UploadDocumentsFolder/ExploreFolder",
      payload,
      userDeviceIdAsNumber
    );

    setFilesDetail(response?.data?.data?.result);
    // ðŸ‘‡ PUSH PATH INTO STACK
    setPathStack((prev) => {
      if (prev[prev.length - 1] === path) return prev;
      return [...prev, path];
    });
  };

  const handleBackClick = () => {
    setPathStack((prev) => {
      if (prev.length <= 1) {
        setFilesDetail(null);
        fetchData();

        return prev;
      }

      const newStack = [...prev];
      newStack.pop(); // remove current path

      const previousPath = newStack[newStack.length - 1];
      handleSubFolderClick(previousPath);

      return newStack;
    });
  };
//   const handleSubDirectoryDelete = async (path, type) => {
//     try {
//       const result = await Swal.fire({
//         title: "Are you sure?",
//         text: `This ${type} and its contents will be permanently deleted.`,
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonColor: "#d33",
//         cancelButtonColor: "#3085d6",
//         confirmButtonText: "Yes, delete it!",
//         cancelButtonText: "Cancel",
//       });

//       if (!result.isConfirmed) return;
//       const payload = {
//         folderId: currentFolderId,
//         deviceUserId: userDeviceIdAsNumber,
//         currentPath: path,
//       };

//       const response = await ApiUtils.FolderFiledelete(
//         "UploadDocumentsFolder/DeleteExplorerItem",
//         payload
//       );
//       if (response?.data?.isSuccess) {
//         Swal.fire({
//           icon: "success",
//           title: "Deleted!",
//           text: response?.message || "Deleted successfully",
//           timer: 1500,
//           showConfirmButton: false,
//         });

//         const parentPath = path?.split("/").slice(0, -1).join("/");

//         if (parentPath) {
//           handleSubFolderClick(parentPath);
//         }

//         // fetchFolders();
//       } else {
//         throw new Error(response?.message || "Delete failed");
//       }
//     } catch (error) {
//       Swal.fire({
//         icon: "error",
//         title: "Error",
//         text:
//           error.message || "Something went wrong while deleting the folder.",
//       });
//     }
//   };
  
const { isLoading, error, fetchDownloadZip } = useDownloadZip();
  const downloadData = async (id, path) => {
    const payload = {
      folderId: id ?? currentFolderId,
      deviceUserId: Number(userDeviceIdAsNumber),
      currentPath: path,
    };
    fetchDownloadZip(payload);
  };

const checkFile = (name) => {
    if (!name) return null; // no name
    // if it has a dot anywhere except maybe the last character, treat as file
    return name.includes(".") ? "file" : null;
  };
  return (
    <>
      <MainCard content={false} title="Phone Storage">
        <Grid
          container
          spacing={2}
          display="flex"
          justifyContent="space-between"
          mt={1}
        >
          <Grid item ml={2}>
            {/* {!filesDetail && data?.length > 0 && (
              <>
                <Checkbox
                  className="parentCheckbox"
                  type="checkbox"
                  checked={parentChecked}
                  onChange={handleParentCheckboxChange}
                />
                Check for selecting all Files/Folders
              </>
            )} */}
          </Grid>
          <Grid item mr={2} ml={2}>
            {/* {!filesDetail && (
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => setOpenFolderModal(true)}
              >
                Upload Files/Folders
              </Button>
            )} */}
            {filesDetail && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  px: 2,
                  mx: 0.5,
                  width: "100%",
                }}
              >
                {/* LEFT: Back Button */}
                <IconButton
                  onClick={handleBackClick}
                  sx={{
                    color: "#fff",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    backgroundColor: "#2196f3", 
                    "&:hover": {
                      backgroundColor: "#1e88e5",
                    },
                    fontSize: "10px",
                  }}
                >
                  <ArrowBackIcon sx={{ fontSize: "10px" }} /> Go Back
                </IconButton>

                {/* RIGHT: Breadcrumb */}
                <Box sx={{ ml: "auto" }}>
                  <Breadcrumbs
                    separator="/"
                    sx={{
                      color: "text.secondary",
                      fontSize: "14px",
                    }}
                  >
                    {filesDetail.currentPath
                      .split("/")
                      .map((segment, index, arr) => (
                        <Typography
                          key={index}
                          sx={{
                            fontWeight: index === arr.length - 1 ? 600 : 400,
                            color:
                              index === arr.length - 1
                                ? "text.primary"
                                : "text.secondary",
                          }}
                        >
                          {segment}
                        </Typography>
                      ))}
                  </Breadcrumbs>
                </Box>
              </Box>
            )}
            {/* {childCheckedState?.length > 0 && (
              <Button
                variant="contained"
                size="large"
                sx={{
                  background: "red",
                  borderRadius: "10px",
                  marginLeft: "10px",
                }}
                onClick={() =>
                  handleDelete(
                    childCheckedState,
                    setParentChecked,

                    setChildCheckedState
                  )
                }
              >
                Delete Data
              </Button>
            )} */}
          </Grid>
        </Grid>
        <CardContent>
          <Grid container spacing={gridSpacing}>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                gap: "8px",
                padding: "0 16px",
              }}
            >
              <Typography
                variant="h4"
                color="inherit"
                sx={{ fontWeight: "500" }}
              >
                Syncing....
                {/* iPhone 426.30 GB used out of 512 GB */}
              </Typography>
              {/* <Typography
                variant="h4"
                color="inherit"
                sx={{ fontWeight: "500" }}
              >
                iCloud Drive: 387 items 
                <br />
                On My iPhone: 68 items
                <br />
                Recently Deleted: 94 items
                <br />
              </Typography> */}
            </div>
            {!filesDetail && data.length > 0 ? (
              <>
                <Grid item xs={12}>
                  <Grid container justifyContent="start" gap="14px">
                    {data.map((item) => {
                      const isFile = checkFile(item?.rootName) === "file";
                      return (
                        <>
                          <Grid>
                            <Box className="video-container">
                              <div style={{userSelect:"none"}}>
                                <span title={`Download ${isFile ? "File" : "Folder"}`}> 
                                <FaDownload
                          color="blue"
                          stroke={2}
                          onClick={() => {
                            // downloadData(currentFolderId,`${filesDetail?.currentPath}/${Fileitem}`);
                            downloadData(item.folderId, item.rootName);
                          }}
                          style={{
                            float: "inline-end",
                            margin: "7px",
                            cursor: "pointer",
                          }}
                        /></span>
                                {/* <Checkbox
                                  type="checkbox"
                                //   checked={childCheckedState?.includes(
                                //     item?.folderId
                                //   )}
                                  onChange={(e) =>
                                    handleChildCheckboxChange(e, item?.folderId)
                                  }
                                  sx={{ float: "right" }}
                                /> */}
                              </div>

                              <Stack
                                className="folder-container-stack"
                                alignItems="center"
                                onClick={() => handleFolderClick(item)}
                                style={{
                                  cursor: isFile ? "default" : "pointer",
                                }}
                              >
                                {isFile ? (
                                  <InsertDriveFileIcon
                                    sx={{ fontSize: 48, color: "#1976d2" }}
                                  />
                                ) : (
                                  <FolderIcon
                                    sx={{ fontSize: 48, color: "#fbc02d" }}
                                  />
                                )}
                                <Typography className="file-name">
                                  {item?.rootName || "Folder"}
                                </Typography>
                              </Stack>
                            </Box>
                          </Grid>
                        </>
                      );
                    })}
                  </Grid>
                </Grid>
                <TablePagination
                  component="div"
                  count={totalCount}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={10}
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
              <>
                {!filesDetail && (
                  <Grid item>
                    <Typography
                      variant="h4"
                      color="inherit"
                      sx={{ fontWeight: "500" }}
                    >
                    </Typography>
                  </Grid>
                )}
              </>
            )}

            {filesDetail && (
              <Grid container spacing={2} sx={{ px: 2, mt: 3 }}>
                {/* ===== FOLDERS ===== */}
                {filesDetail?.folders?.length > 0 &&
                  filesDetail.folders.map((Folderitem) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      key={Folderitem.folderId}
                    >
                      <Box className="file-card">
                        <div>
                          <span title={`Download Folder`}>
                            <FaDownload
                                  color="blue"
                                  stroke={2}
                                  onClick={() => {
                                    
                                    downloadData(
  currentFolderId,
  `${filesDetail.currentPath}/${Folderitem}`
);
                                  }}
                                  style={{
                                    float: "inline-end",
                                    margin: "7px",
                                    cursor: "pointer",
                                  }}
                                /></span>
                        </div>
                        {/* <Button
                          className="link-redirect"
                          sx={{ position: "absolute", top: 8, right: 8 }}
                        >
                          <IconTrash
                            color="red"
                            stroke={2}
                            onClick={() => {
                              handleSubDirectoryDelete(
                                `${filesDetail?.currentPath}/${Folderitem}`,
                                "folder"
                              );
                            }}
                          />
                        </Button> */}

                        <Stack
                          alignItems="center"
                          spacing={1}
                          onClick={() =>
                            handleSubFolderClick(
                              `${filesDetail?.currentPath}/${Folderitem}`
                            )
                          }
                          sx={{ cursor: "pointer" }}
                        >
                          <FolderIcon sx={{ fontSize: 48, color: "#fbc02d" }} />
                          <Typography className="file-name">
                            {Folderitem || "Folder"}
                          </Typography>
                        </Stack>
                      </Box>
                    </Grid>
                  ))}

                {/* ===== FILES ===== */}
                {filesDetail?.files?.length > 0 &&
                  filesDetail.files.map((Fileitem) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      key={Fileitem.fileId}
                    >
                      <Box className="file-card">
                        <div>
                          <span title={`Download File`}>
                            <FaDownload
                          color="blue"
                          stroke={2}
                          onClick={() => {
                            downloadData(currentFolderId,`${filesDetail?.currentPath}/${Fileitem}`);
                          }}
                          style={{
                            float: "inline-end",
                            margin: "7px",
                            cursor: "pointer",
                          }}
                        /></span>
                        </div>
                        {/* <Button
                          className="link-redirect"
                          sx={{ position: "absolute", top: 8, right: 8 }}
                        >
                          <IconTrash
                            color="red"
                            stroke={2}
                            onClick={() => {
                              handleSubDirectoryDelete(
                                `${filesDetail?.currentPath}/${Fileitem}`,
                                "file"
                              );
                            }}
                          />
                        </Button> */}

                        <Stack alignItems="center" spacing={1}>
                          <InsertDriveFileIcon
                            sx={{ fontSize: 42, color: "#1976d2" }}
                          />
                          <Typography className="file-name">
                            {Fileitem || "File"}
                          </Typography>
                        </Stack>
                      </Box>
                    </Grid>
                  ))}
              </Grid>
            )}
          </Grid>
        </CardContent>
      </MainCard>

      {/* <CommonFolderUploadModal
        userDeviceId={userDeviceIdAsNumber}
        open={openFolderModal}
        setOpenModal={setOpenFolderModal}
        title="Files/Folders"
        fetchData={fetchData}
        Url={`UploadDocumentsFolder/AddFolder?deviceUserId=${userDeviceIdAsNumber}`}
        type="video"
      /> */}
    </>
  );
}

export default Phonestorage;
