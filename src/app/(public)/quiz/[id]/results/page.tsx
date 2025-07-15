"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ScoreCircle from "@/components/quiz/ScoreCircle";
import AnswerBreakdown from "@/components/quiz/AnswerBreakdown";

interface QuizResultsData {
  quiz: {
    id: number;
    title: string;
    questions: Array<{
      id: number;
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
    }>;
  };
  results: {
    answers: number[];
    score: number;
    total: number;
    timeSpent: number;
  };
}

export default function QuizResultsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [resultsData, setResultsData] = useState<QuizResultsData | null>(null);

  useEffect(() => {
    const storedResults = sessionStorage.getItem("quizResults");
    if (storedResults) {
      setResultsData(JSON.parse(storedResults));
    } else {
      // Redirect back to quiz if no results found
      router.push(`/quiz/${params.id}`);
    }
  }, [params.id, router]);

  if (!resultsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  const { quiz, results } = resultsData;
  const percentage = Math.round((results.score / results.total) * 100);
  const timeSpentMinutes = Math.floor(results.timeSpent / 60);
  const timeSpentSeconds = results.timeSpent % 60;

  const getPerformanceMessage = (percentage: number) => {
    if (percentage >= 90)
      return {
        message: "Excellent work! 🎉",
        color: "text-green-600",
        bg: "bg-green-50",
      };
    if (percentage >= 80)
      return {
        message: "Great job! 👏",
        color: "text-blue-600",
        bg: "bg-blue-50",
      };
    if (percentage >= 70)
      return {
        message: "Good effort! 👍",
        color: "text-yellow-600",
        bg: "bg-yellow-50",
      };
    if (percentage >= 60)
      return {
        message: "Keep practicing! 📚",
        color: "text-orange-600",
        bg: "bg-orange-50",
      };
    return {
      message: "More study needed 💪",
      color: "text-red-600",
      bg: "bg-red-50",
    };
  };

  const performance = getPerformanceMessage(percentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Quiz Results
          </h1>
          <h2 className="text-2xl text-gray-600">{quiz.title}</h2>
        </div>

        {/* Score Summary */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Score Circle */}
            <div className="flex justify-center">
              <ScoreCircle
                score={results.score}
                total={results.total}
                percentage={percentage}
              />
            </div>

            {/* Score Details */}
            <div className="text-center lg:text-left">
              <div
                className={`inline-block px-6 py-3 rounded-full ${performance.bg} ${performance.color} font-semibold text-lg mb-6`}
              >
                {performance.message}
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">
                    Correct Answers:
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    {results.score}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">
                    Incorrect Answers:
                  </span>
                  <span className="text-2xl font-bold text-red-500">
                    {results.total - results.score}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">
                    Total Questions:
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    {results.total}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600 font-medium">Time Spent:</span>
                  <span className="text-xl font-semibold text-blue-600">
                    {timeSpentMinutes}m {timeSpentSeconds}s
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link
            href={`/quiz/${params.id}`}
            className="flex-1 bg-blue-600 text-white text-center py-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Retake Quiz
          </Link>
          <Link
            href="/quiz"
            className="flex-1 bg-gray-100 text-gray-700 text-center py-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            Browse More Quizzes
          </Link>
          <Link
            href="/quiz/history"
            className="flex-1 border-2 border-blue-600 text-blue-600 text-center py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
          >
            View History
          </Link>
        </div>

        {/* Detailed Answer Breakdown */}
        <AnswerBreakdown
          questions={quiz.questions}
          userAnswers={results.answers}
        />
      </div>
    </div>
  );
}
