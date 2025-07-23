"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getUserQuizHistory } from "@/api/public/quiz";
import { QuizHistoryItem } from "@/types/exams";

export default function QuizHistoryPage() {
  const [sortBy, setSortBy] = useState("recent");
  const [filterCategory, setFilterCategory] = useState("all");
  const { user } = useAuth();
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      const data = await getUserQuizHistory(user.id);
      setHistory(data);
    };
    fetchHistory();
  }, [user]);

  const getPerformanceColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 bg-green-100";
    if (percentage >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800";
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "Advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const sortedAndFilteredHistory = history
    .filter(
      (quiz) =>
        filterCategory === "all" || quiz.exam.category === filterCategory
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "score":
          return b.percentage - a.percentage;
        case "title":
          return a.exam.title.localeCompare(b.exam.title);
        default: // recent
          return (
            new Date(b.completed_at).getTime() -
            new Date(a.completed_at).getTime()
          );
      }
    });

  const totalQuizzes = sortedAndFilteredHistory.length;
  const averageScore = Math.round(
    sortedAndFilteredHistory.reduce((sum, quiz) => sum + quiz.percentage, 0) /
      totalQuizzes
  );
  const bestScore = Math.max(
    ...sortedAndFilteredHistory.map((quiz) => quiz.percentage)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Quiz <span className="text-blue-600">History</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Track your learning progress and review past quiz performances
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {totalQuizzes}
              </div>
              <div className="text-gray-600">Quizzes Completed</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {averageScore}%
              </div>
              <div className="text-gray-600">Average Score</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {bestScore}%
              </div>
              <div className="text-gray-600">Best Score</div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="recent">Most Recent</option>
                  <option value="score">Highest Score</option>
                  <option value="title">Quiz Title</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Category:
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="Programming">Programming</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="Language">Language</option>
                </select>
              </div>
            </div>
            <Link
              href="/quiz"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Take New Quiz
            </Link>
          </div>
        </div>

        {/* Quiz History List */}
        <div className="space-y-4">
          {sortedAndFilteredHistory.map((quiz) => (
            <div
              key={`${quiz.id}-${quiz.completed_at}`}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Quiz Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {quiz.exam.title}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">
                          {quiz.exam.category}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(
                            quiz.exam.difficulty
                          )}`}
                        >
                          {quiz.exam.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    Completed on {formatDate(quiz.completed_at)} • Time spent:{" "}
                    {quiz.time_spent}
                  </div>
                </div>

                {/* Score */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div
                      className={`text-2xl font-bold px-4 py-2 rounded-lg ${getPerformanceColor(
                        quiz.percentage
                      )}`}
                    >
                      {quiz.percentage}%
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {quiz.score}/{quiz.total}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/quiz/${quiz.id}`}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Retake
                    </Link>
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                      Review
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedAndFilteredHistory.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.08-2.329C8.207 9.747 10.017 8 12 8s3.793 1.747 6.08 4.671a7.965 7.965 0 01-2.08 2.329z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No quiz history found
            </h3>
            <p className="text-gray-600 mb-6">
              Start taking quizzes to see your progress here
            </p>
            <Link
              href="/quiz"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
            >
              Take Your First Quiz
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
