import { useCallback, useEffect, useState } from "react";
import { Axios } from "../config/http";
import type { AxiosResponse } from "axios";

export default function useQuery<T>(url: string, lazy = false) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const runQuery = useCallback(async () => {
    setLoading(true);
    setError(undefined);

    try {
      const res: AxiosResponse<T> = await Axios.get(url);
      setData(res.data);
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (!lazy) {
      runQuery();
    }
  }, [runQuery, lazy]);

  return { data, error, loading, refetch: runQuery };
}
