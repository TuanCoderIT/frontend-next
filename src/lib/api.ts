// src/lib/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

// Exam quiz API
export const getQuizzes = async (categoryId?: number | string) => {
  let url = "http://127.0.0.1:8000/api/exams";
  if (categoryId && categoryId !== "All") {
    url += `?category_id=${categoryId}`;
  }
  const res = await axios.get(url);
  return res.data;
};

export const getQuizById = async (id: number) => {
  const res = await API.get(`/exams/${id}`);
  return res.data;
};

// Category API
export const getCategories = async () => {
  const res = await API.get("/categories");
  return res.data;
};

