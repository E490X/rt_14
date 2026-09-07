export function formatTimestampToTime(timestamp) {
  const dateObj = new Date(timestamp);
  const options = {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return dateObj.toLocaleTimeString(undefined, options);
}

export function formatDate(timestamp) {
  const dateObj = new Date(timestamp);
  const formattedDate = `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${dateObj.getDate().toString().padStart(2, "0")}`;
  return formattedDate;
}

export function formatCallDurationToTime(timestamp) {
  const dateObj = new Date(timestamp);
  const options = {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return dateObj.toLocaleTimeString(undefined, options);
}

export function extractDate(timestampStr) {
  const date = new Date(timestampStr);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function extractTime(timestampStr) {
  const date = new Date(timestampStr);

  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, 
  });
}
