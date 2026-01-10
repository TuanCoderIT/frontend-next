import axios from "axios";

export const axiosAPI = axios.create({
  baseURL: "http://localhost:8000/api",
});

axiosAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
