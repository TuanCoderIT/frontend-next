import { axiosAPI } from "./axios";
import type { Question } from "@/types/admin/admin";

// Helper: Chuyển answer về string trước khi gửi
function normalizeAnswer(data: Partial<Question>) {
  const answerArray = Array.isArray(data.answer) ? data.answer : [data.answer];
  const cleanedAnswer = answerArray.find((a) => typeof a === "string" && a.trim() !== "") || "";
  return {
    ...data,
    answer: cleanedAnswer,
  };
}

// Lấy tất cả câu hỏi
export const fetchQuestions = async () => {
  const response = await axiosAPI.get("/admin/questions");
  return response.data;
};

// Lấy chi tiết 1 câu hỏi
export const getQuestionById = async (id: number | string) => {
  const response = await axiosAPI.get(`/admin/questions/${id}`);
  return response.data;
};

// Tạo câu hỏi
export const createQuestion = async (data: Partial<Question>) => {
  const payload = normalizeAnswer(data);
  const response = await axiosAPI.post("/admin/questions", payload);
  return response.data;
};

// Cập nhật câu hỏi
export const updateQuestion = async (id: number | string, data: Partial<Question>) => {
  const payload = normalizeAnswer(data);
  const response = await axiosAPI.put(`/admin/questions/${id}`, payload);
  return response.data;
};

// Xoá câu hỏi
export const deleteQuestion = async (id: number | string) => {
  const response = await axiosAPI.delete(`/admin/questions/${id}`);
  return response.data;
};
