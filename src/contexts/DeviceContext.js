import React, { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiUtils from "api/ApiUtils";

const DeviceContext = createContext({ deviceData: null, isIOS: false });

export const DeviceProvider = ({ children }) => {
  const { userDeviceId } = useParams();
  const [deviceData, setDeviceData] = useState(null);

  useEffect(() => {
    if (!userDeviceId) {
      setDeviceData(null);
      return;
    }
    let active = true;
    ApiUtils.getDeviceInfo(`DeviceUserId=${userDeviceId}`)
      .then((res) => {
        if (active) setDeviceData(res.data.data);
      })
      .catch(() => {
        if (active) setDeviceData(null);
      });
    return () => {
      active = false;
    };
  }, [userDeviceId]);

  const isIOS = Boolean(deviceData?.os?.toLowerCase().includes("ios"));

  return (
    <DeviceContext.Provider value={{ deviceData, isIOS }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => useContext(DeviceContext);
