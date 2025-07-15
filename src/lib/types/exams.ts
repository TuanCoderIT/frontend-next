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