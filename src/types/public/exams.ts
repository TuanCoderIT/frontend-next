import { Category } from "./category";

export interface Exam {
  id: number;
  title: string;
  description: string;
  category: Category;
  difficulty: string;
  duration: number;
  questions: number;
  progress: number;
  color: string;
}

export interface QuizInfo {
  id: number;
  title: string;
  description: string;
  category: string;
  learning_objectives: string[];
  prerequisites: string[];
  tags: string[];
  questions_count: number;
  duration: number;
  difficulty: string;
  passing_score: number;
  attempts: number;
  max_attempts: number;
  estimated_time: string;
  price_token: number;
  is_purchased: boolean;
}

export interface QuizHistoryItem {
  id: number;
  user_id: number;
  exam_id: number;
  score: number;
  total: number;
  percentage: number;
  time_spent: number;
  completed_at: string;
  exam: {
    id: number;
    title: string;
    category: string;
    difficulty: "Beginner" | "Intermediate" | "Advanced";
  };
}

