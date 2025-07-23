import { API } from '@/api/axios';
import { QuizHistoryItem } from '@/types/exams';

// Exam quiz API
export const getQuizzes = async (categoryId?: number | string) => {
    let url = "/exams";
    if (categoryId && categoryId !== "All") {
        url += `?category_id=${categoryId}`;
    }
    const res = await API.get(url);
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

// Quiz results API
export const submitQuizResult = async (
  payload: {
    exam_id: number;
    score: number;
    total: number;
    percentage: number;
    time_spent: number;
    completed_at: string;
  },
  token: string
) => {
  const res = await API.post("/results", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getUserQuizHistory = async (userId: number) => {
  const res = await API.get(`/results?user_id=${userId}`);
  return res.data as QuizHistoryItem[];
};

