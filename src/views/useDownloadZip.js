import { useState } from "react";
import ApiUtils from "api/ApiUtils";

export function useDownloadZip() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDownloadZip = async (payload) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await ApiUtils.DownloadFolderZip(
        "UploadDocumentsFolder/DownloadFolderZip",
        payload
      );

      // 🔹 Extract filename from headers
      const contentDisposition = response.headers["content-disposition"];
      let fileName = "download.zip";

      if (contentDisposition) {
        const match = contentDisposition.match(
          /filename\*?=(?:UTF-8'')?"?([^";]+)/i
        );
        if (match?.[1]) {
          fileName = decodeURIComponent(match[1]);
        }
      }

      // 🔹 Create blob and download
      const blob = new Blob([response.data], {
        type: "application/zip",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, fetchDownloadZip };
}
