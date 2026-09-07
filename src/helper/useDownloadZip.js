import { useState } from "react";
import ApiUtils from "api/ApiUtils";

export function useDownloadZip(apiName) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDownloadZip = async (ids,fileName) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await ApiUtils[apiName](ids);

      const blob = new Blob([res.data], { type: "application/zip" });
      const url = window.URL.createObjectURL(blob);

      // get filename from headers
      const contentDisposition = res.headers["content-disposition"];
    //   let fileName = fileType === "image" ? "images.zip" : "videos.zip";
      if (contentDisposition && contentDisposition.includes("filename=")) {
        fileName = contentDisposition
          .split("filename=")[1]
          .split(";")[0]
          .replace(/['"]/g, "");
      }

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, fetchDownloadZip };
}
