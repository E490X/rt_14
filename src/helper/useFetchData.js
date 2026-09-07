import ApiUtils from 'api/ApiUtils';
import { useEffect, useState } from 'react';

export function useFetchData(apiName, params, currentPageNumber) {
  const [totalCount, setTotalCount] = useState(0);
  const [data, setData] = useState([]);

  const fetchData = async (paramsSearch) => {
    try {
      const res = await ApiUtils[apiName](paramsSearch || params);
      const totalCount = res.data.data.totalCount;
      const dataTable = res?.data?.data?.listResponse?.map((data, index) => ({
        ...data,
        id: index + 1,
      }));
      setTotalCount(totalCount);
      setData(dataTable);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const res = await ApiUtils[apiName](params);
        if (!active) return;
        setTotalCount(res.data.data.totalCount);
        setData(
          res?.data?.data?.listResponse?.map((data, index) => ({
            ...data,
            id: index + 1,
          }))
        );
      } catch (err) {
        if (active) console.log(err);
      }
    };

    load();

    return () => { active = false; };
  }, [apiName, params]);

  return { totalCount, data, fetchData };
}
