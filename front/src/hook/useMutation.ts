import type { AxiosResponse } from "axios";
import { useCallback, useState } from "react";
import { Axios } from "../config/http";
import { HttpMethod } from "../helper/constant";
import type { Post } from "..";
import { toast } from "react-toastify";

type MutationOptions = {
  url: string;
  method: (typeof HttpMethod)[keyof typeof HttpMethod];
  body?: Pick<Post, "title" | "content"> | null;
};

export default function useMutation<T>() {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (options: MutationOptions): Promise<T> => {
    let res: AxiosResponse<T>;

    switch (options.method) {
      case "get":
      case "delete":
        res = await Axios[options.method]<T>(options.url);
        break;
      case "post":
      case "put":
        res = await Axios[options.method]<T>(options.url, options.body);
        break;
    }

    setData(res.data);
    return res.data;
  };

  const handleError = (error: unknown) => {
    if (error instanceof Error) setError(error.message);
    toast.error("Something isn't right!");
  };

  const runMutation = useCallback(
    async (options: MutationOptions): Promise<T | undefined> => {
      setLoading(true);
      try {
        return await handleSuccess(options);
      } catch (e) {
        handleError(e);
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [],
  );
  return { data, loading, error, execute: runMutation };
}
