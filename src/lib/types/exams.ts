export interface Exam {
  id: number;
  title: string;
  description: string;
  category: string; // hoặc Category nếu bạn nối relation
  difficulty: string;
  duration: number;
  questions: number;
  progress: number;
  color: string;
}

export interface QuizInfo {
  title: string;
  description: string;
  category: string;
  learning_objectives: string[];
  prerequisites: string[];
  tags: string[];
  total_questions: number;
  duration: number;
  difficulty: string;
  passing_score: number;
  attempts: number;
  max_attempts: number;
  estimated_time: string;
}

