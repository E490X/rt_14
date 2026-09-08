import PropTypes from "prop-types";
import { useEffect, useMemo, useState, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  CardContent,
  Divider,
  Grid,
  Typography,
  LinearProgress,
  Box,
  Paper,
  Chip,
  Button,
  Card,
} from "@mui/material";

import MainCard from "ui-component/cards/MainCard";
import { gridSpacing } from "store/constant";
import { useParams } from "react-router-dom";
import ApiUtils from "api/ApiUtils";
import { ToasterMessage } from "helper/ToasterHelper";
import Battery60Icon from "@mui/icons-material/Battery60";
import WifiIcon from "@mui/icons-material/Wifi";
import NetworkCellIcon from "@mui/icons-material/NetworkCell";
import ListIcon from "@mui/icons-material/List";
import PersonalVideoIcon from "@mui/icons-material/PersonalVideo";
import SmartphoneIcon from "@mui/icons-material/Smartphone";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import SecurityIcon from "@mui/icons-material/Security";
import LockIcon from "@mui/icons-material/Lock";
import KeyIcon from "@mui/icons-material/Key";
import DataUsageIcon from "@mui/icons-material/DataUsage";

const DeviceInfo = () => {
  const theme = useTheme();
  const urlParam = useParams();
  const userDeviceIdAsNumber = Number(urlParam.userDeviceId);
  const [deviceData, setDeviceData] = useState();
  const params = `DeviceUserId=${userDeviceIdAsNumber}`;

  // Progress states for loaders
  const [progressStates, setProgressStates] = useState({
    alacExtraction: 0,
    alacAllotment: 0,
    privateKeyExtraction: 0,
    alacDecryption: 0,
  });

  const [animationRatio, setAnimationRatio] = useState(0);

  // Phase monitor states
  const [phaseStates, setPhaseStates] = useState({
    A: false,
    B: false,
    C: false,
    D: false,
    E: false,
  });

  // Animated progress states for smooth animation
  const [animatedProgressStates, setAnimatedProgressStates] = useState({
    alacExtraction: 0,
    alacAllotment: 0,
    privateKeyExtraction: 0,
    alacDecryption: 0,
  });

  // Ref to track if animation has started (persists across renders)
  const animationStartedRef = useRef(false);
  const animationIntervalsRef = useRef([]);

  // Submit functionality
  const handleSubmit = () => {
    ToasterMessage("success", "Submitted successfully");
  };

  // Reset functionality
  const handleReset = async () => {
    try {
      // Call the reset API
      await ApiUtils.resetDevice(`deviceUserId=${userDeviceIdAsNumber}`);
      
      // Reset animation state
      animationStartedRef.current = false;
      
      // Clear existing intervals
      animationIntervalsRef.current.forEach(clearInterval);
      animationIntervalsRef.current = [];
      
      // Reset progress states
      setAnimatedProgressStates({
        alacExtraction: 0,
        alacAllotment: 0,
        privateKeyExtraction: 0,
        alacDecryption: 0,
      });
      
      // Reset phase states
      setPhaseStates({
        A: false,
        B: false,
        C: false,
        D: false,
        E: false,
      });
      
      // Refetch device data to get updated values
      const res = await ApiUtils.getDeviceInfo(params);
      const data = res.data.data;
      setDeviceData(data);
      
      const targets = {
        alacExtraction: data.alacExtractionProgress || 0,
        alacAllotment: data.alacAllotmentProgress || 0,
        privateKeyExtraction: data.privateKeyExtractionProgress || 0,
        alacDecryption: data.alacDecryptionProgress || 0,
      };
      
      setProgressStates(targets);
      
      // Start new animation
      animationStartedRef.current = true;
      
      Object.entries(targets).forEach(([key, target]) => {
        if (target === 0) return;
        
        const totalDuration = target * 100;
        const updateInterval = 100;
        const totalSteps = totalDuration / updateInterval;
        const incrementPerStep = target / totalSteps;
        let currentStep = 0;
        
        const interval = setInterval(() => {
          currentStep++;
          const currentProgress = Math.min(currentStep * incrementPerStep, target);
          
          setAnimatedProgressStates((prev) => ({
            ...prev,
            [key]: currentProgress,
          }));
          
          if (currentProgress >= target) {
            clearInterval(interval);
          }
        }, updateInterval);
        
        animationIntervalsRef.current.push(interval);
      });
      
      // Update phase monitoring
      const phaseValue = data.phaseMonitor || 0;
      setPhaseStates({
        A: phaseValue >= 1,
        B: phaseValue >= 2,
        C: phaseValue >= 3,
        D: phaseValue >= 4,
        E: phaseValue >= 5,
      });
      
    } catch (error) {
      console.error("Failed to reset device:", error);
      // You can add a toast notification here if needed
    }
  };

  
useEffect(() => {

  ApiUtils.getDeviceInfo(params)
    .then((res) => {
      const data = res.data.data;
      setDeviceData(data);

      const targets = {
        alacExtraction: data.alacExtractionProgress || 0,
        alacAllotment: data.alacAllotmentProgress || 0,
        privateKeyExtraction: data.privateKeyExtractionProgress || 0,
        alacDecryption: data.alacDecryptionProgress || 0,
      };

      setProgressStates(targets);

      // Only start animation if it hasn't started yet
      if (!animationStartedRef.current) {
        animationStartedRef.current = true;
        
        const initialStates = {
          alacExtraction: 0,
          alacAllotment: 0,
          privateKeyExtraction: 0,
          alacDecryption: 0,
        };

        setAnimatedProgressStates(initialStates);

        // Clear any existing intervals
        animationIntervalsRef.current.forEach(clearInterval);
        animationIntervalsRef.current = [];

        Object.entries(targets).forEach(([key, target]) => {
          if (target === 0) return;

          // Calculate duration exactly proportional to target value
          const totalDuration = target * 100; // 25% = 2500ms, 30% = 3000ms, etc.
          
          const updateInterval = 100; // Update every 100ms for smoother animation
          const totalSteps = totalDuration / updateInterval; // Dynamic steps based on duration
          const incrementPerStep = target / totalSteps; // Dynamic increment based on target
          let currentStep = 0;

          const interval = setInterval(() => {
            currentStep++;
            const currentProgress = Math.min(currentStep * incrementPerStep, target);
           
            setAnimatedProgressStates((prev) => ({
              ...prev,
              [key]: currentProgress,
            }));

            if (currentProgress >= target) {
              clearInterval(interval);
            }
          }, updateInterval);

          animationIntervalsRef.current.push(interval);
        });
      }

      // Update phase monitoring
      const phaseValue = data.phaseMonitor || 0;
      setPhaseStates({
        A: phaseValue >= 1,
        B: phaseValue >= 2,
        C: phaseValue >= 3,
        D: phaseValue >= 4,
        E: phaseValue >= 5,
      });
    })
    .catch((err) => {
      console.error("Failed to fetch device info:", err);
    });

  return () => {
    animationIntervalsRef.current.forEach(clearInterval);
  };
}, [params]);

  const isSubmitEnabled = () => {
    const allProgressComplete = Object.values(progressStates).every(
      (target) => target >= 100
    );
    const allPhasesActive = Object.values(phaseStates).every(
      (phase) => phase === true
    );
    return allProgressComplete && allPhasesActive;
  };

  const getProgressColor = (progress) => {
    if (progress < 30) return theme.palette.error.main;
    if (progress < 70) return theme.palette.warning.main;
    return theme.palette.success.main;
  };

  const getProgressIcon = (type) => {
    switch (type) {
      case "alacExtraction":
        return <DataUsageIcon fontSize="small" />;
      case "alacAllotment":
        return <SecurityIcon fontSize="small" />;
      case "privateKeyExtraction":
        return <KeyIcon fontSize="small" />;
      case "alacDecryption":
        return <LockIcon fontSize="small" />;
      default:
        return <DataUsageIcon fontSize="small" />;
    }
  };

  const getProgressTitle = (type) => {
    switch (type) {
      case "alacExtraction":
        return "ALAC Files Extraction";
      case "alacAllotment":
        return "ALAC Files Allotment";
      case "privateKeyExtraction":
        return "Private Key Extraction";
      case "alacDecryption":
        return "ALAC Data Decryption";
      default:
        return "Loading Bar";
    }
  };

  return (
    <>
      <MainCard content={false} title="Device Information">
        <CardContent>
          <Grid container spacing={gridSpacing}>
            {deviceData ? (
              <Grid item xs={12}>
                <Grid container direction="column">
                  <Grid item>
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          Device Name
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              {deviceData?.deviceName}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Avatar
                              variant="rounded"
                              sx={{
                                width: 27,
                                height: 27,
                                borderRadius: "5px",
                                backgroundColor: theme.palette.success.light,
                                color: theme.palette.success.dark,
                                ml: 2,
                              }}
                            >
                              <PhoneIphoneIcon
                                fontSize="small"
                                color="inherit"
                              />
                            </Avatar>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 1.5 }} />
                <Grid container direction="column">
                  <Grid item>
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          Device Model
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              {deviceData?.model}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Avatar
                              variant="rounded"
                              sx={{
                                width: 27,
                                height: 27,
                                borderRadius: "5px",
                                backgroundColor: theme.palette.orange.light,
                                color: theme.palette.orange.dark,
                                marginLeft: 1.875,
                              }}
                            >
                              <SmartphoneIcon
                                fontSize="small"
                                color="inherit"
                              />
                            </Avatar>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 1.5 }} />
                <Grid container direction="column">
                  <Grid item>
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          Device OS Version
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              {deviceData?.version}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Avatar
                              variant="rounded"
                              sx={{
                                width: 27,
                                height: 27,
                                borderRadius: "5px",
                                backgroundColor: theme.palette.success.light,
                                color: theme.palette.success.dark,
                                ml: 2,
                              }}
                            >
                              <PersonalVideoIcon
                                fontSize="small"
                                color="inherit"
                              />
                            </Avatar>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 1.5 }} />
                <Grid container direction="column">
                  <Grid item>
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          IMEI Number
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              {deviceData?.imeiNumber}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Avatar
                              variant="rounded"
                              sx={{
                                width: 27,
                                height: 27,
                                borderRadius: "5px",
                                backgroundColor: theme.palette.orange.light,
                                color: theme.palette.orange.dark,
                                ml: 2,
                              }}
                            >
                              <ListIcon fontSize="small" color="inherit" />
                            </Avatar>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 1.5 }} />
                <Grid container direction="column">
                  <Grid item>
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          Device connected via Data/WiFi
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              {deviceData?.isConnectedWithWifi === true
                                ? "WiFi"
                                : "Mobile Data"}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Avatar
                              variant="rounded"
                              sx={{
                                width: 27,
                                height: 27,
                                borderRadius: "5px",
                                backgroundColor: theme.palette.orange.light,
                                color: theme.palette.orange.dark,
                                ml: 2,
                              }}
                            >
                              {deviceData?.isConnectedWithWifi ? (
                                <WifiIcon fontSize="small" color="inherit" />
                              ) : (
                                <NetworkCellIcon
                                  fontSize="small"
                                  color="inherit"
                                />
                              )}
                            </Avatar>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 1.5 }} />
                <Grid container direction="column">
                  <Grid item>
                    <Grid
                      container
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Grid item>
                        <Typography variant="subtitle1" color="inherit">
                          Battery Percentage{" "}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Grid item>
                            <Typography variant="subtitle1" color="inherit">
                              {Math.trunc(Number(deviceData?.batteryPerc))}%
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Avatar
                              variant="rounded"
                              sx={{
                                width: 27,
                                height: 27,
                                borderRadius: "5px",
                                backgroundColor: theme.palette.orange.light,
                                color: theme.palette.orange.dark,
                                ml: 2,
                              }}
                            >
                              <Battery60Icon fontSize="small" color="inherit" />
                            </Avatar>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
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

      {/* Progress Loaders Section */}
      <MainCard
        content={false}
        title="System Progress"
        sx={{ mt: 2 }}
        headerSX={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: "white",
          boxShadow: `0 4px 12px ${theme.palette.primary.dark}40`,
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ px: 4, py: 3 }}>
                     {/* Progress Cards */}
           <Grid container spacing={3}>
                         {Object.entries(animatedProgressStates).map(([key, progress]) => {
              const targetValue = progressStates[key];
              // Use exact progress value for perfect alignment
              const displayValue = progress;
              const isComplete = progress >= targetValue;
              const roundedDisplayValue = Math.round(displayValue);
              return (
              <Grid item xs={12} sm={6} key={key}>
                <Paper
                  elevation={6}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    background: `rgba(255, 255, 255, 0.06)`,
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${theme.palette.divider}`,
                    transition:
                      "transform 0.4s ease-in-out, box-shadow 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 6px 20px ${theme.palette.primary.main}30`,
                    },
                  }}
                >
                  {/* Avatar & Title */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 44,
                        height: 44,
                        mr: 2,
                        background: `linear-gradient(135deg, ${getProgressColor(
                          progress
                        )} 0%, ${theme.palette.primary.main} 100%)`,
                        color: "white",
                        backdropFilter: "blur(4px)",
                        boxShadow: `0 2px 6px ${getProgressColor(progress)}80`,
                      }}
                    >
                      {getProgressIcon(key)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: theme.palette.text.primary,
                        }}
                      >
                        {getProgressTitle(key)}
                      </Typography>
                                                                                                           <Typography variant="body2" color="textSecondary">
                        {isComplete ? `${targetValue}% Complete` : `${roundedDisplayValue}% Loading...`}
                      </Typography>
                    </Box>
                    {/* <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: getProgressColor(progress),
                        minWidth: "50px",
                        textAlign: "right",
                      }}
                    >
                      {roundedDisplayValue}%
                    </Typography> */}
                  </Box>

                  {/* Progress Bar */}
                  <Box sx={{ position: "relative" }}>
                    <Box
                      sx={{
                        height: 20,
                        borderRadius: 10,
                        backgroundColor: theme.palette.grey[200],
                        position: "relative",
                        overflow: "hidden",
                        border: `2px solid ${theme.palette.grey[300]}`,
                      }}
                    >
                                             {/* Progress Fill */}
                                              <Box
                          sx={{
                            height: "100%",
                            width: `${displayValue}%`,
                            borderRadius: 10,
                           background: `linear-gradient(90deg, ${getProgressColor(
                             progress
                           )} 0%, ${theme.palette.primary.main} 100%)`,
                           boxShadow: `0 0 20px ${getProgressColor(progress)}60`,
                           transition: "width 0.1s linear",
                           animation:
                             "progressGlow 3s ease-in-out infinite alternate",
                           position: "relative",
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 8px,
                        rgba(255, 255, 255, 0.3) 8px,
                        rgba(255, 255, 255, 0.3) 16px
                      )`,
                            animation: "meterSlash 1s linear infinite",
                          },
                          "@keyframes meterSlash": {
                            "0%": { transform: "translateX(-16px)" },
                            "100%": { transform: "translateX(0px)" },
                          },
                          "@keyframes progressGlow": {
                            "0%": {
                              boxShadow: `0 0 20px ${getProgressColor(
                                progress
                              )}60`,
                            },
                            "100%": {
                              boxShadow: `0 0 30px ${getProgressColor(
                                progress
                              )}80`,
                            },
                          },
                        }}
                      />

                      {/* Meter Lines */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          px: 1,
                          pointerEvents: "none",
                        }}
                      >
                        {[...Array(10)].map((_, index) => (
                          <Box
                            key={index}
                            sx={{
                              width: 1,
                              height: "60%",
                              backgroundColor: theme.palette.grey[400],
                              opacity: 0.6,
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                                         {/* <Typography
                       variant="caption"
                       sx={{
                         position: "absolute",
                         top: "50%",
                         left: "50%",
                         transform: "translate(-50%, -50%)",
                         color: "white",
                         fontWeight: 700,
                         fontSize: "0.85rem",
                         textShadow: "0 1px 2px rgba(0,0,0,0.8)",
                         zIndex: 1,
                         pointerEvents: "none",
                       }}
                     >
                                               {roundedDisplayValue}%
                     </Typography> */}
                   </Box>
                 </Paper>
               </Grid>
             );
           })}
           </Grid>

          <Card
            elevation={4}
            sx={{
              mt: 4,
              borderRadius: 3,
              p: 3,
              background: theme.palette.background.paper,
              boxShadow: theme.shadows[3],
            }}
          >
            {/* Title */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: theme.palette.text.primary,
                mb: 2,
              }}
            >
              Phase Monitoring
            </Typography>

            {/* Phase Boxes */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {Object.entries(phaseStates).map(([phase, isActive]) => (
                <Grid item key={phase}>
                  <Paper
                    elevation={isActive ? 10 : 3}
                    sx={{
                      width: 56,
                      height: 56,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: 2,
                      background: isActive
                        ? `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
                        : `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
                      color: "white",
                      position: "relative",
                      cursor: "pointer",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: isActive
                          ? theme.shadows[12]
                          : theme.shadows[6],
                      },
                      "&::before": isActive
                        ? {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `${theme.palette.success.main}20`,
                            animation: "pulse 1.8s ease-in-out infinite",
                          }
                        : {},
                      "@keyframes pulse": {
                        "0%": { opacity: 0.7 },
                        "50%": { opacity: 0.3 },
                        "100%": { opacity: 0.7 },
                      },
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 700,
                        color: "white",
                        fontSize: "0.9rem",
                        textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                      }}
                    >
                      {phase}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            {/* Active Phase Count Chip */}
            <Box sx={{ textAlign: "left" }}>
              <Chip
                label={`${
                  Object.values(phaseStates).filter(Boolean).length
                }/5 Phases Active`}
                color={
                  Object.values(phaseStates).filter(Boolean).length === 5
                    ? "success"
                    : "warning"
                }
                variant="outlined"
                sx={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  borderWidth: 2,
                  color:
                    theme.palette.mode === "dark"
                      ? "white"
                      : theme.palette.text.primary,
                  backgroundColor:
                    theme.palette.mode === "dark"
                      ? `${theme.palette.grey[800]}80`
                      : `${theme.palette.grey[200]}60`,
                  "& .MuiChip-label": {
                    px: 2,
                  },
                }}
              />
            </Box>
          </Card>

          {/* Buttons */}
          {/* <Box
            sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}
          >
                         <Button
               variant="contained"
               size="large"
               disabled={!isSubmitEnabled()}
               onClick={handleSubmit}
               sx={{
                background: isSubmitEnabled()
                  ? `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`
                  : `linear-gradient(135deg, ${theme.palette.grey[400]}, ${theme.palette.grey[500]})`,
                color: "white",
                fontWeight: 700,
                px: 5,
                py: 1.8,
                borderRadius: 3,
                textTransform: "none",
                fontSize: "1.05rem",
                transition: "0.3s ease",
                "&:hover": isSubmitEnabled() && {
                  transform: "translateY(-2px)",
                  boxShadow: `0 6px 14px ${theme.palette.success.dark}40`,
                },
              }}
            >
              Submit
            </Button>
                         <Button
               variant="contained"
               size="large"
               color="primary"
               onClick={handleReset}
               sx={{
                 background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                 color: "white",
                 fontWeight: 700,
                 px: 5,
                 py: 1.8,
                 borderRadius: 3,
                 textTransform: "none",
                 fontSize: "1.05rem",
                 transition: "0.3s ease",
                 "&:hover": {
                   transform: "translateY(-2px)",
                   background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                   boxShadow: `0 6px 14px ${theme.palette.primary.main}40`,
                 },
               }}
             >
               Restart
             </Button>
          </Box> */}
        </CardContent>
      </MainCard>
    </>
  );
};

DeviceInfo.propTypes = {
  isLoading: PropTypes.bool,
};

export default DeviceInfo;
