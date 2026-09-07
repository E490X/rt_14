import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { TextField } from "@mui/material";
import ApiUtils from "api/ApiUtils";
import { ToasterMessage } from "./ToasterHelper";

export default function AlertDialog({
  open,
  onClose,
  title,
  content,
  agreeText,
  disagreeText,
  isInputFieldReq,
  userDeviceIdAsNumber,
}) {
  console.log("🚀 ~ file: AlertModalRemote.js:22 ~ title:", title);
  const [inputValue, setInputValue] = useState("");
  const handleClick = () => {
    if (title === "Take Screenshot") {
      const body = {
        deviceUserId: Number(userDeviceIdAsNumber),
        key: "isScreenshot",
        value: "true",
      };
      ApiUtils.setRemoteRecording(body)
        .then((res) => {
          if (res.status === 200) {
            onClose();
            ToasterMessage("success", "Screenshot Take Successfully");
          }
        })
        .catch((err) => {
          ToasterMessage("error", "Something went wrong");
        });
    } else if (title === "Record Phone Surroundings") {
      if (inputValue) {
        const body = {
          deviceUserId: Number(userDeviceIdAsNumber),
          key: "minute",
          value: String(inputValue),
        };
        ApiUtils.setRemoteRecording(body)
          .then((res) => {
            if (res.status === 200) {
              onClose();
              ToasterMessage("success", "Send Notification Successfully");
              setInputValue("");
            }
          })
          .catch((err) => {
            ToasterMessage("error", "Something went wrong");
          });
      } else {
        setInputValue("");
        ToasterMessage("error", "Please fill the input");
      }
    } else if (title === "Wipe Data from Phone or Tablet") {
      const body = {
        deviceUserId: Number(userDeviceIdAsNumber),
        key: "isWipe",
        value: "true",
      };
      ApiUtils.setRemoteRecording(body)
        .then((res) => {
          if (res.status === 200) {
            onClose();
            ToasterMessage("success", "Send Notification Successfully");
            setInputValue("");
          }
        })
        .catch((err) => {
          ToasterMessage("error", "Something went wrong");
        });
    }
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle sx={{ fontSize: "16px" }} id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
          {isInputFieldReq && (
            <TextField
              sx={{ mt: 3 }}
              fullWidth
              type="number"
              value={inputValue}
              id="minute"
              onChange={(e) => setInputValue(e.target.value)}
            />
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>{disagreeText}</Button>
          <Button onClick={handleClick} autoFocus>
            {agreeText}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
