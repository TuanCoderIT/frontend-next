// Admin Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'teacher';
  gender: 'male' | 'female' | 'other';
  phone_number?: string;
  date_of_birth?: string;
  avatar?: string;
  bio?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  last_login?: string;
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: number; // in minutes
  total_questions: number;
  learning_objectives: string[];
  prerequisites: string[];
  tags: string[];
  passing_score: number;
  max_attempts: number;
  estimated_time: string;
  color: string;
  status: 'draft' | 'published' | 'archived';
  created_at: string;
  updated_at: string;
  published_at?: string;
  created_by: number;
  creator_id: number;
  creator_name: string;
  enrollment_count: number;
  completion_rate: number;
  average_score: number;
  last_attempt_date?: string;
}

export interface Question {
  id: number;
  quiz_id: number;
  question_text: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  options?: string[];
  correct_answers: string[];
  explanation?: string;
  points: number;
  order: number;
  created_at: string;
  updated_at: string;
  order_index: number;
}

export interface UserFilters {
  role?: string;
  status?: string;
  search?: string;
}

export interface QuizFilters {
  category?: string;
  difficulty?: string;
  status?: string;
  search?: string;
  tags?: string[];
}
