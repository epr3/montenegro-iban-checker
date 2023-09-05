import axios from "axios";

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const fetcher = (url: string) =>
  instance.get(url).then((res) => res.data);
