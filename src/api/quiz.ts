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

const buildQuizFormData = (formData: any, isUpdate = false) => {
  const formPayload = new FormData();

  const appendField = (key: string, value: any) => {
    if (value !== undefined && value !== null) {
      formPayload.append(key, String(value));
    }
  };
  appendField("title", formData.title);
  appendField("description", formData.description || "");
  appendField("category_id", formData.category?.id);
  appendField("difficulty", formData.difficulty);
  appendField("duration", formData.duration);
  appendField("color", formData.color || "");
  appendField("passing_score", formData.passingScore);
  appendField("max_attempts", formData.maxAttempts);
  appendField("price_token", formData.price_token ?? 0); // ✅ thêm token

  if (Array.isArray(formData.learning_objectives)) {
    formData.learning_objectives.forEach((item: string | Blob) => {
      formPayload.append("learning_objectives[]", item);
    });
  }
  if (Array.isArray(formData.prerequisites)) {
    formData.prerequisites.forEach((item: string | Blob) => {
      formPayload.append("prerequisites[]", item);
    });
  }
  if (Array.isArray(formData.tags)) {
    formData.tags.forEach((item: string | Blob) => {
      formPayload.append("tags[]", item);
    });
  }

  appendField("status", formData.status);

  if (isUpdate) {
    formPayload.append("_method", "PUT"); // Laravel update
  }

  return formPayload;
};

// CREATE
export const createQuiz = async (formData: any) => {
  const formPayload = buildQuizFormData(formData);
  return await axiosAPI.post("admin/exams", formPayload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// UPDATE
export const updateQuiz = async (id: number, formData: any) => {
  const formPayload = buildQuizFormData(formData, true);
  return await axiosAPI.post(`admin/exams/${id}`, formPayload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// DELETE
export const deleteQuiz = async (id: number) => {
  return await axiosAPI.delete(`admin/exams/${id}`);
};

// 
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

// AI Quiz Generation APIs - Admin
export const generateQuizFromText = async (payload: {
  prompt: string;
  number_of_questions?: number;
}) => {
  const res = await axiosAPI.post("/user/exams/ai-generate-from-prompt", payload);
  return res.data;
};

export const generateQuizFromFile = async (payload: {
  file: File;
  number_of_questions?: number;
}) => {
  const formData = new FormData();
  formData.append("file", payload.file);
  if (payload.number_of_questions) {
    formData.append("number_of_questions", String(payload.number_of_questions));
  }
  
  const res = await axiosAPI.post("/user/exams/ai-generate-from-file", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// AI Quiz Generation APIs - User (pending approval)
export const submitUserQuizFromText = async (payload: {
  prompt: string;
  number_of_questions?: number;
  // Quiz metadata
  title?: string;
  description?: string;
  category_id?: number;
  difficulty?: string;
  duration?: number;
  passing_score?: number;
  max_attempts?: number;
  learning_objectives?: string[];
  prerequisites?: string[];
  tags?: string[];
  color?: string;
  price_token?: number;
}) => {
  const requestData: any = {
    prompt: payload.prompt,
    number_of_questions: payload.number_of_questions,
  };

  // Add quiz metadata if provided
  if (payload.title) requestData.title = payload.title;
  if (payload.description) requestData.description = payload.description;
  if (payload.category_id) requestData.category_id = payload.category_id;
  if (payload.difficulty) requestData.difficulty = payload.difficulty;
  if (payload.duration) requestData.duration = payload.duration;
  if (payload.passing_score) requestData.passing_score = payload.passing_score;
  if (payload.max_attempts) requestData.max_attempts = payload.max_attempts;
  if (payload.learning_objectives) requestData.learning_objectives = payload.learning_objectives;
  if (payload.prerequisites) requestData.prerequisites = payload.prerequisites;
  if (payload.tags) requestData.tags = payload.tags;
  if (payload.color) requestData.color = payload.color;
  if (payload.price_token !== undefined) requestData.price_token = payload.price_token;

  const res = await axiosAPI.post("/user/exams/ai-generate-from-prompt", requestData);
  return res.data;
};

export const submitUserQuizFromFile = async (payload: {
  file: File;
  number_of_questions?: number;
  // Quiz metadata
  title?: string;
  description?: string;
  category_id?: number;
  difficulty?: string;
  duration?: number;
  passing_score?: number;
  max_attempts?: number;
  learning_objectives?: string[];
  prerequisites?: string[];
  tags?: string[];
  color?: string;
  price_token?: number;
}) => {
  const formData = new FormData();
  formData.append("file", payload.file);
  if (payload.number_of_questions) {
    formData.append("number_of_questions", String(payload.number_of_questions));
  }

  // Add quiz metadata if provided
  if (payload.title) formData.append("title", payload.title);
  if (payload.description) formData.append("description", payload.description);
  if (payload.category_id) formData.append("category_id", String(payload.category_id));
  if (payload.difficulty) formData.append("difficulty", payload.difficulty);
  if (payload.duration) formData.append("duration", String(payload.duration));
  if (payload.passing_score) formData.append("passing_score", String(payload.passing_score));
  if (payload.max_attempts) formData.append("max_attempts", String(payload.max_attempts));
  if (payload.learning_objectives) {
    payload.learning_objectives.forEach(item => {
      formData.append("learning_objectives[]", item);
    });
  }
  if (payload.prerequisites) {
    payload.prerequisites.forEach(item => {
      formData.append("prerequisites[]", item);
    });
  }
  if (payload.tags) {
    payload.tags.forEach(item => {
      formData.append("tags[]", item);
    });
  }
  if (payload.color) formData.append("color", payload.color);
  if (payload.price_token !== undefined) formData.append("price_token", String(payload.price_token));
  
  const res = await axiosAPI.post("/user/exams/ai-generate-from-file", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Get user's submitted quizzes (pending approval)
export const getUserSubmittedQuizzes = async () => {
  const res = await axiosAPI.get("/user/exams/submitted");
  return res.data;
};
