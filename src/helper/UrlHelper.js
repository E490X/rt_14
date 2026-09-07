export function getParamUrl(filterData,
    userDeviceIdAsNumber,
    currentPageNumber
) {
    const baseUrl = `DeviceUserId=${userDeviceIdAsNumber}&Page=${currentPageNumber}&PageSize=10`;

    if (filterData?.fromDate && filterData?.toDate) {
        return `${baseUrl}&FromDate=${filterData.fromDate}&ToDate=${filterData.toDate}`;
    }

    return baseUrl;
}