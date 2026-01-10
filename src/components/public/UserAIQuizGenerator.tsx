'use client';

import { useState } from 'react';
import { UserQuizSubmission, AIQuizResponse } from '@/types/public/exams';
import { submitUserQuizFromText, submitUserQuizFromFile } from '@/api/quiz';
import AIQuizGeneratorBase from '../common/AIQuizGeneratorBase';
import UserQuizPreview from './UserQuizPreview';

export default function UserAIQuizGenerator() {
  const [generatedQuiz, setGeneratedQuiz] = useState<UserQuizSubmission | null>(null);

  const handleTextGeneration = async (data: { prompt: string; numberOfQuestions: number }) => {
    return await submitUserQuizFromText({
      prompt: data.prompt,
      number_of_questions: data.numberOfQuestions,
    });
  };

  const handleFileGeneration = async (data: { file: File; numberOfQuestions: number }) => {
    return await submitUserQuizFromFile({
      file: data.file,
      number_of_questions: data.numberOfQuestions,
    });
  };

  const handlePreview = (quiz: UserQuizSubmission | AIQuizResponse) => {
    // Convert AIQuizResponse to UserQuizSubmission format if needed
    if ('submitted_at' in quiz) {
      // It's already a UserQuizSubmission
      setGeneratedQuiz(quiz);
    } else {
      // It's an AIQuizResponse, convert it to UserQuizSubmission format
      const userQuizSubmission: UserQuizSubmission = {
        ...quiz,
        submitted_at: new Date().toISOString(),
        reviewed_at: undefined,
        reviewer_notes: undefined,
        user_id: 0, // Will be set by backend
        status: 'pending' as const,
      };
      setGeneratedQuiz(userQuizSubmission);
    }
  };

  const handleReset = () => {
    setGeneratedQuiz(null);
  };

  if (generatedQuiz) {
    return (
      <UserQuizPreview 
        quiz={generatedQuiz} 
        onBack={handleReset}
        onViewSubmissions={() => {
          // Navigate to user submissions page
          window.location.href = '/my-quiz-submissions';
        }}
      />
    );
  }

  return (
    <AIQuizGeneratorBase
      title="🤖 Đề xuất Quiz bằng AI"
      subtitle="Tạo quiz và gửi đến admin để duyệt xuất bản"
      isUserMode={true}
      onTextGeneration={handleTextGeneration}
      onFileGeneration={handleFileGeneration}
      onPreview={handlePreview}
      successMessage="Đề xuất quiz đã được gửi thành công! Chờ admin duyệt."
    />
  );
}