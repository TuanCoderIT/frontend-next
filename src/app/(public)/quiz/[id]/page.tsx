"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Mock quiz basic info data
const mockQuizInfo = {
  id: 1,
  title: "JavaScript Fundamentals",
  description:
    "Master the basics of JavaScript programming with essential concepts and syntax. This comprehensive quiz covers variables, data types, operators, functions, and fundamental programming concepts that every JavaScript developer should know.",
  category: "Programming",
  difficulty: "Beginner",
  duration: 30, // minutes
  totalQuestions: 25,
  passingScore: 70,
  attempts: 0,
  maxAttempts: 3,
  estimatedTime: "25-30 minutes",
  tags: ["JavaScript", "Programming", "Web Development", "Fundamentals"],
  learningObjectives: [
    "Understand JavaScript variable declarations and scope",
    "Master different data types and their usage",
    "Learn about operators and expressions",
    "Understand function declarations and expressions",
    "Apply basic programming concepts in JavaScript",
  ],
  prerequisites: [
    "Basic understanding of programming concepts",
    "Familiarity with web development basics",
    "HTML and CSS knowledge (recommended)",
  ],
};

export default function QuizDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [quizInfo] = useState(mockQuizInfo);
  const [isLoading] = useState(false);

  // In real app, fetch quiz info here
  useEffect(() => {
    // TODO: Fetch quiz basic info from API
    // fetch(`/api/exams/${params.id}`)
    console.log(`Fetching quiz info for ID: ${params.id}`);
  }, [params.id]);

  const handleStartQuiz = () => {
    router.push(`/quiz/${params.id}/start`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800 border-green-200";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Advanced":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Programming":
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
        );
      default:
        return (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-screen-lg mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-blue-600">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/quiz" className="hover:text-blue-600">
                Quizzes
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">{quizInfo.title}</li>
          </ol>
        </nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Quiz Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                <div className="flex items-center mb-4">
                  <div className="bg-white bg-opacity-20 rounded-lg p-2 mr-4">
                    {getCategoryIcon(quizInfo.category)}
                  </div>
                  <div>
                    <span className="text-blue-100 text-sm">
                      {quizInfo.category}
                    </span>
                    <h1 className="text-3xl font-bold">{quizInfo.title}</h1>
                  </div>
                </div>
                <p className="text-blue-100 text-lg leading-relaxed">
                  {quizInfo.description}
                </p>
              </div>
            </div>

            {/* Learning Objectives */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Learning Objectives
              </h2>
              <div className="space-y-3">
                {quizInfo.learningObjectives.map((objective, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <svg
                        className="w-3 h-3 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-700">{objective}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Prerequisites
              </h2>
              <div className="space-y-3">
                {quizInfo.prerequisites.map((prerequisite, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <svg
                        className="w-3 h-3 text-yellow-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-700">{prerequisite}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Topics Covered
              </h2>
              <div className="flex flex-wrap gap-3">
                {quizInfo.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Quiz Info & Start */}
          <div className="space-y-6">
            {/* Quiz Stats */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Quiz Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Questions:</span>
                  <span className="text-xl font-bold text-gray-900">
                    {quizInfo.totalQuestions}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Duration:</span>
                  <span className="text-lg font-semibold text-blue-600">
                    {quizInfo.duration} min
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Difficulty:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold border ${getDifficultyColor(
                      quizInfo.difficulty
                    )}`}
                  >
                    {quizInfo.difficulty}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">
                    Passing Score:
                  </span>
                  <span className="text-lg font-semibold text-green-600">
                    {quizInfo.passingScore}%
                  </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Attempts:</span>
                  <span className="text-lg font-semibold text-gray-900">
                    {quizInfo.attempts}/{quizInfo.maxAttempts}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600 font-medium">Est. Time:</span>
                  <span className="text-sm text-gray-500">
                    {quizInfo.estimatedTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Start Quiz Button */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <button
                onClick={handleStartQuiz}
                disabled={quizInfo.attempts >= quizInfo.maxAttempts}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  quizInfo.attempts >= quizInfo.maxAttempts
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
                }`}
              >
                {quizInfo.attempts >= quizInfo.maxAttempts
                  ? "Max Attempts Reached"
                  : "Start Quiz"}
              </button>

              {quizInfo.attempts < quizInfo.maxAttempts && (
                <p className="text-center text-sm text-gray-500 mt-3">
                  You have{" "}
                  <strong>{quizInfo.maxAttempts - quizInfo.attempts}</strong>{" "}
                  attempt(s) remaining
                </p>
              )}
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-yellow-800 mb-4 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                Quick Tips
              </h3>
              <ul className="space-y-2 text-yellow-800 text-sm">
                <li>• Read each question carefully</li>
                <li>• You can navigate between questions</li>
                <li>• Review your answers before submitting</li>
                <li>• Watch the timer in the top right</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
