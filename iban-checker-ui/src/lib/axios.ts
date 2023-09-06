import axios from "axios";
import { API_URL } from "../config";

export const instance = axios.create({
  baseURL: API_URL,
});

instance.interceptors.request.use(
  (config) => {
    const sessionId = sessionStorage.getItem("montenegro-iban:session");

    if (sessionId) {
      config.headers["X-Session-Id"] = sessionId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
