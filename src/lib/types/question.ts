export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizData {
  id: number;
  title: string;
  duration: number;
  questions: Question[];
}

export interface RawQuestion {
  id: number;
  content: string;
  options: Record<string, string>; // vì là object { A: "...", B: "..." }
  answer: string;
  explanation?: string;
}
