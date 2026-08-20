import type { AxiosResponse } from "axios";
import { useCallback, useState } from "react";
import { Axios } from "../config/http";
import { HttpMethod } from "../helper/constant";

type MutationOptions={
    url:string;
    method: typeof HttpMethod;
}

export default function useMutation<T>() {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const handleSuccess = async () => {
    const res: AxiosResponse<T> = await Axios.get<T>(url);
    setData(res.data);
  };

  const handleError = (error: unknown) => {
    if (error instanceof Error) setError(error.message);
    alert("something isn't right!")
  };

  const runMutation= useCallback((options:MutationOptions)=>{

  },[])

}
