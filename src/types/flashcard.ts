// src/types/flashcard.ts

import { Category } from "./public/category";

export type FlashcardSetStatus =
  | "draft"
  | "pending"
  | "published"
  | "rejected"
  | "archived";

export type FlashcardSourceType =
  | "manual"
  | "quiz_wrong_answers"
  | "ai_generated";

export interface Flashcard {
  id?: number;
  flashcard_set_id?: number;
  front_text: string;
  back_text: string;
  explanation?: string | null;
}

export interface FlashcardSet {
  id: number;
  user_id: number;

  category: Category;

  title: string;
  description?: string | null;

  source_type: FlashcardSourceType;
  is_ai_generated: boolean;

  exam_id?: number | null;
  exam?: {
    id: number;
    title: string;
  } | null;

  color?: string | null;
  status: FlashcardSetStatus;

  submitted_at?: string | null;
  reviewed_at?: string | null;
  reviewed_by?: number | null;
  review_notes?: string | null;

  user?: {
    id: number;
    name: string;
    email?: string;
  } | null;

  reviewer?: {
    id: number;
    name: string;
  } | null;

  flashcards?: Flashcard[];
  flashcards_count?: number;

  created_at: string;
  updated_at: string;
}

export interface FlashcardSetFormData {
  title: string;
  category: Category;
  description: string;
  source_type: FlashcardSourceType;
  quiz_id: number | null;
  color: string;
  status?: FlashcardSetStatus; // chỉ admin dùng
  flashcards: Flashcard[];
}
interface QuizFormData {
  title: string;
  description: string;
  category: Category; 
  difficulty: "Cơ bản" | "Trung bình" | "Nâng cao" | "";
  duration: number;
  status: "Nháp" | "Công khai" | "Lưu trữ" | "";
  passingScore: number;
  maxAttempts: number;
  learning_objectives: string[];
  prerequisites: string[];
  tags: string[];
  color: string;
  price_token: number;
}