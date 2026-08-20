import { useCallback, useEffect, useState } from "react";
import { Axios } from "../config/http";
import type { AxiosResponse } from "axios";

export default function useQuery<T>(url: string, lazy = false) {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleError = (error: unknown) => {
    if (error instanceof Error) setError(error.message);
  };

  const handleSuccess = async () => {
    const res: AxiosResponse<T> = await Axios.get<T>(url);
    setData(res.data);
  };

  // this function is calling useCallback to stop an infinite loop since it is in the dependency array of useEffect
  const runQuery = useCallback(() => {
    setLoading(true);
    try {
      handleSuccess();
    } catch (e) {
      handleError(e);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (!lazy) runQuery();

  }, [runQuery]);

  return { data, loading, error, refetch: runQuery };
}