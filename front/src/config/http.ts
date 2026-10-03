import axios from "axios";

// Set VITE_API_URL on Vercel (e.g. https://your-api.vercel.app/api/).
// Falls back to the local backend during development.
const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api/";

export const Axios = axios.create({
  baseURL: baseURL.endsWith("/") ? baseURL : `${baseURL}/`,
});

export type { AxiosResponse } from "axios";
