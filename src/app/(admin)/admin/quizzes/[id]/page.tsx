"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Quiz, Question } from "@/types/admin/admin";
import { formatDate } from "@/utils/admin";
import StatusBadge from "@/components/admin/common/StatusBadge";
import ActionButton from "@/components/admin/common/ActionButton";
import QuestionModal from "@/components/admin/quizzes/QuestionModal";
import Link from "next/link";
import {
  ArrowLeftFromLine,
  CircleUserRound,
  NotebookPen,
  Plus,
  SquareChevronLeft,
  SquarePen,
} from "lucide-react";
import BackButton from "@/components/admin/common/BackButton";

export default function QuizDetailPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "questions">(
    "overview"
  );
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  // Mock data - Replace with actual API calls
  useEffect(() => {
    const loadQuizData = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Mock quiz data
        const mockQuiz: Quiz = {
          id: parseInt(quizId),
          title: "JavaScript Fundamentals",
          description:
            "Learn the basics of JavaScript programming language including variables, functions, objects, and more. This comprehensive quiz will test your understanding of core JavaScript concepts.",
          category: "Programming",
          difficulty: "Beginner",
          duration: 45,
          total_questions: 15,
          learning_objectives: [
            "Understand JavaScript variables and data types",
            "Master function declarations and expressions",
            "Work with objects and arrays effectively",
          ],
          prerequisites: [
            "Basic HTML knowledge",
            "Understanding of programming concepts",
          ],
          tags: ["javascript", "programming", "web"],
          passing_score: 70,
          max_attempts: 3,
          estimated_time: "45 minutes",
          color: "blue",
          status: "published",
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-07-20T14:30:00Z",
          published_at: "2024-01-20T09:00:00Z",
          created_by: 1,
          creator_id: 1,
          creator_name: "John Smith",
          enrollment_count: 245,
          completion_rate: 78.5,
          average_score: 82.3,
          last_attempt_date: "2024-07-23T15:45:00Z",
        };

        // Mock questions data
        const mockQuestions: Question[] = [
          {
            id: 1,
            quiz_id: parseInt(quizId),
            question_text:
              "What is the correct way to declare a variable in JavaScript?",
            type: "multiple_choice",
            options: [
              "var x = 5;",
              "variable x = 5;",
              "v x = 5;",
              "declare x = 5;",
            ],
            correct_answers: ["var x = 5;"],
            explanation:
              "In JavaScript, variables are declared using 'var', 'let', or 'const' keywords.",
            points: 2,
            order_index: 1,
            order: 0,
            created_at: "",
            updated_at: "",
          },
          {
            id: 2,
            quiz_id: parseInt(quizId),
            question_text: "JavaScript is a compiled language.",
            type: "true_false",
            options: ["True", "False"],
            correct_answers: ["False"],
            explanation:
              "JavaScript is an interpreted language, not a compiled language.",
            points: 1,
            order_index: 2,
            order: 0,
            created_at: "",
            updated_at: "",
          },
          {
            id: 3,
            quiz_id: parseInt(quizId),
            question_text:
              "What does the 'typeof' operator return for an array?",
            type: "short_answer",
            options: [],
            correct_answers: ["object"],
            explanation:
              "In JavaScript, arrays are actually objects, so typeof returns 'object'.",
            points: 3,
            order_index: 3,
            order: 0,
            created_at: "",
            updated_at: "",
          },
        ];

        setQuiz(mockQuiz);
        setQuestions(mockQuestions);
      } catch (error) {
        console.error("Error loading quiz data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (quizId) {
      loadQuizData();
    }
  }, [quizId]);

  const handleCreateQuestion = () => {
    setSelectedQuestion(null);
    setModalMode("create");
    setIsQuestionModalOpen(true);
  };

  const handleEditQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setModalMode("edit");
    setIsQuestionModalOpen(true);
  };

  const handleDeleteQuestion = (question: Question) => {
    if (window.confirm(`Are you sure you want to delete this question?`)) {
      setQuestions((prev) => prev.filter((q) => q.id !== question.id));
    }
  };

  const handleSaveQuestion = (questionData: Partial<Question>) => {
    if (modalMode === "create") {
      const newQuestion: Question = {
        id: Math.max(...questions.map((q) => q.id), 0) + 1,
        quiz_id: parseInt(quizId),
        question_text: questionData.question_text || "",
        type: questionData.type || "multiple_choice",
        options: questionData.options || [],
        correct_answers: questionData.correct_answers || [],
        explanation: questionData.explanation || "",
        points: questionData.points || 1,
        order_index: questions.length + 1,
        order: 0,
        created_at: "",
        updated_at: "",
      };
      setQuestions((prev) => [...prev, newQuestion]);
    } else if (selectedQuestion) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === selectedQuestion.id ? { ...q, ...questionData } : q
        )
      );
    }
    setIsQuestionModalOpen(false);
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

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "multiple_choice":
        return "Multiple Choice";
      case "true_false":
        return "True/False";
      case "short_answer":
        return "Short Answer";
      case "essay":
        return "Essay";
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <svg
              className="w-6 h-6 animate-spin text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span className="text-gray-600">Loading quiz details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Quiz Not Found</h1>
          <p className="text-gray-600 mt-2">
            The quiz you're looking for doesn't exist.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex-1">
            <BackButton />
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg shadow-sm">
                      <NotebookPen className="h-6 w-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-semibold ml-2 text-gray-800">
                      {quiz.title}
                    </h1>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <StatusBadge status={quiz.status} />
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getDifficultyColor(
                        quiz.difficulty
                      )}`}
                    >
                      {quiz.difficulty}
                    </span>
                    <span className="text-gray-500">
                      by {quiz.creator_name}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/admin/quizzes/${quiz.id}/edit`}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transform transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <SquarePen className="h-5 w-5" />
                  Edit Quiz
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("questions")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "questions"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Questions ({questions.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {quiz.description}
              </p>
            </div>

            {/* Learning Objectives */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Learning Objectives
              </h2>
              <ul className="space-y-2">
                {quiz.learning_objectives.map((objective, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prerequisites */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Prerequisites
              </h2>
              <ul className="space-y-2">
                {quiz.prerequisites.map((prerequisite, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{prerequisite}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Stats
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{quiz.duration} minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Questions</span>
                  <span className="font-medium">{questions.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Passing Score</span>
                  <span className="font-medium">{quiz.passing_score}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Max Attempts</span>
                  <span className="font-medium">{quiz.max_attempts}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Enrollments</span>
                  <span className="font-medium">{quiz.enrollment_count}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-medium">{quiz.completion_rate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Score</span>
                  <span className="font-medium">{quiz.average_score}%</span>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {quiz.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Metadata
              </h2>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">Created:</span>
                  <span className="ml-2 text-gray-900">
                    {formatDate(quiz.created_at)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Updated:</span>
                  <span className="ml-2 text-gray-900">
                    {formatDate(quiz.updated_at)}
                  </span>
                </div>
                {quiz.published_at && (
                  <div>
                    <span className="text-gray-600">Published:</span>
                    <span className="ml-2 text-gray-900">
                      {formatDate(quiz.published_at)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "questions" && (
        <div className="space-y-6">
          {/* Questions Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Questions ({questions.length})
            </h2>
            <ActionButton
              variant="primary"
              onClick={handleCreateQuestion}
              icon={
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              }
            >
              Add Question
            </ActionButton>
          </div>

          {/* Questions List */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {questions.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No questions yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first question.
                </p>
                <div className="mt-6">
                  <ActionButton
                    variant="primary"
                    onClick={handleCreateQuestion}
                    icon={
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    }
                  >
                    Add First Question
                  </ActionButton>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 text-sm font-medium">
                            {index + 1}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {getQuestionTypeLabel(question.type)}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {question.points}{" "}
                            {question.points === 1 ? "point" : "points"}
                          </span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {question.question_text}
                        </h3>
                        {question.type === "multiple_choice" &&
                          question.options && (
                            <div className="mt-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {question.options.map((option, optionIndex) => (
                                  <div
                                    key={optionIndex}
                                    className={`p-2 text-sm rounded-lg border ${
                                      question.correct_answers.includes(option)
                                        ? "bg-green-50 border-green-200 text-green-800"
                                        : "bg-gray-50 border-gray-200 text-gray-700"
                                    }`}
                                  >
                                    <span className="font-medium">
                                      {String.fromCharCode(65 + optionIndex)}.
                                    </span>{" "}
                                    {option}
                                    {question.correct_answers.includes(
                                      option
                                    ) && (
                                      <span className="ml-2 text-green-600">
                                        ✓
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        {question.explanation && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <span className="font-medium">Explanation:</span>{" "}
                              {question.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <ActionButton
                          variant="edit"
                          onClick={() => handleEditQuestion(question)}
                        />
                        <ActionButton
                          variant="delete"
                          onClick={() => handleDeleteQuestion(question)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Question Modal */}
      {isQuestionModalOpen && (
        <QuestionModal
          question={selectedQuestion}
          mode={modalMode}
          isOpen={isQuestionModalOpen}
          onClose={() => setIsQuestionModalOpen(false)}
          onSave={handleSaveQuestion}
        />
      )}
    </div>
  );
}
