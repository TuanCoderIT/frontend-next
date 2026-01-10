'use client';

import { useState } from 'react';
import { AIQuizResponse, UserQuizSubmission } from '@/types/public/exams';
import { generateQuizFromText, generateQuizFromFile } from '@/api/quiz';
import AIQuizGeneratorBase from '../common/AIQuizGeneratorBase';
import QuizPreview from './QuizPreview';

export default function AIQuizGenerator() {
  const [generatedQuiz, setGeneratedQuiz] = useState<AIQuizResponse | null>(null);

  const handleTextGeneration = async (data: { prompt: string; numberOfQuestions: number }) => {
    return await generateQuizFromText({
      prompt: data.prompt,
      number_of_questions: data.numberOfQuestions,
    });
  };

  const handleFileGeneration = async (data: { file: File; numberOfQuestions: number }) => {
    return await generateQuizFromFile({
      file: data.file,
      number_of_questions: data.numberOfQuestions,
    });
  };

  const handlePreview = (quiz: UserQuizSubmission | AIQuizResponse) => {
    // For admin mode, we expect AIQuizResponse, but handle both types for compatibility
    if ('submitted_at' in quiz) {
      // It's a UserQuizSubmission, convert to AIQuizResponse format
      const aiQuizResponse: AIQuizResponse = {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        category_id: quiz.category_id,
        difficulty: quiz.difficulty,
        duration: quiz.duration,
        status: 'draft' as const,
        is_ai_generated: true,
        questions: quiz.questions,
      };
      setGeneratedQuiz(aiQuizResponse);
    } else {
      // It's already an AIQuizResponse
      setGeneratedQuiz(quiz);
    }
  };

  const handleReset = () => {
    setGeneratedQuiz(null);
  };

  if (generatedQuiz) {
    return (
      <QuizPreview 
        quiz={generatedQuiz} 
        onBack={handleReset}
        onEdit={() => {
          // Navigate to quiz edit page
          window.location.href = `/admin/quizzes/${generatedQuiz.id}/edit`;
        }}
      />
    );
  }

  return (
    <AIQuizGeneratorBase
      title="🤖 Tạo Quiz bằng AI"
      subtitle="Tạo quiz tự động từ văn bản hoặc tải file lên"
      isUserMode={false}
      onTextGeneration={handleTextGeneration}
      onFileGeneration={handleFileGeneration}
      onPreview={handlePreview}
      successMessage="Quiz được tạo thành công!"
    />
  );
}