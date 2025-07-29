import { axiosAPI } from '@/api/axios';
import { QuizHistoryItem } from '@/types/public/exams';

// Exam quiz API
export const getQuizzes = async (categoryId?: number | string) => {
  let url = "/exams";
  if (categoryId && categoryId !== "All") {
    url += `?category_id=${categoryId}`;
  }
  const res = await axiosAPI.get(url);
  return res.data;
};

// CREATE
export const createQuiz = async (formData: any) => {
  const formPayload = new FormData();
  formPayload.append('title', formData.title);
  formPayload.append('description', formData.description || '');
  formPayload.append('category_id', String(formData.category?.id)); // ✅ fix
  formPayload.append('difficulty', formData.difficulty);
  formPayload.append('duration', String(formData.duration));
  formPayload.append('color', formData.color || '');
  formPayload.append('passing_score', String(formData.passingScore)); // ✅ fix
  formPayload.append('max_attempts', String(formData.maxAttempts));   // ✅ fix
  // ✅ ensure mảng JSON.stringify được an toàn
  if (Array.isArray(formData.learning_objectives)) {
    formData.learning_objectives.forEach((item: string | Blob) => {
      formPayload.append('learning_objectives[]', item);
    });
  }
  if (Array.isArray(formData.prerequisites)) {
    formData.prerequisites.forEach((item: string | Blob) => {
      formPayload.append('prerequisites[]', item);
    });
  }
  if (Array.isArray(formData.tags)) {
    formData.tags.forEach((item: string | Blob) => {
      formPayload.append('tags[]', item);
    });
  }
  formPayload.append('status', formData.status);

  return await axiosAPI.post('admin/exams', formPayload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

// UPDATE
export const updateQuiz = async (id: number, formData: any) => {
  const formPayload = new FormData();
  formPayload.append('title', formData.title);
  formPayload.append('description', formData.description || '');
  formPayload.append('category_id', String(formData.category?.id)); // ✅ fix
  formPayload.append('difficulty', formData.difficulty);
  formPayload.append('duration', String(formData.duration));
  formPayload.append('color', formData.color || '');
  formPayload.append('passing_score', String(formData.passingScore)); // ✅ fix
  formPayload.append('max_attempts', String(formData.maxAttempts));   // ✅ fix
  // ✅ ensure mảng JSON.stringify được an toàn
  if (Array.isArray(formData.learning_objectives)) {
    formData.learning_objectives.forEach((item: string | Blob) => {
      formPayload.append('learning_objectives[]', item);
    });
  }
  if (Array.isArray(formData.prerequisites)) {
    formData.prerequisites.forEach((item: string | Blob) => {
      formPayload.append('prerequisites[]', item);
    });
  }
  if (Array.isArray(formData.tags)) {
    formData.tags.forEach((item: string | Blob) => {
      formPayload.append('tags[]', item);
    });
  }
  formPayload.append('status', formData.status);
  formPayload.append('_method', 'PUT'); // Laravel expects this for updates
  return await axiosAPI.post(`admin/exams/${id}`, formPayload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

// DELETE
export const deleteQuiz = async (id: number) => {
  return await axiosAPI.delete(`admin/exams/${id}`);
}

export const getQuizById = async (id: number) => {
  const res = await axiosAPI.get(`/exams/${id}`);
  return res.data;
};

// Category API
export const getCategories = async () => {
  const res = await axiosAPI.get("/categories");
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
  const res = await axiosAPI.post("/results", payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const getUserQuizHistory = async (userId: number) => {
  const res = await axiosAPI.get(`/results?user_id=${userId}`);
  return res.data as QuizHistoryItem[];
};

