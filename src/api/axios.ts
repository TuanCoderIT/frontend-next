import axios from "axios";

export const axiosAPI = axios.create({
  baseURL: "http://localhost:8000/api",
});

// Gắn token tự động nếu có
axiosAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
