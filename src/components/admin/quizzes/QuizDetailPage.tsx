"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Quiz, Question } from "@/types/admin/admin";
import { formatDate } from "@/utils/admin";
import StatusBadge from "@/components/admin/common/StatusBadge";
import ActionButton from "@/components/admin/common/ActionButton";
import QuestionModal from "@/components/admin/quizzes/QuestionModal";

export default function QuizDetailPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = parseInt(params.id as string);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState<"info" | "questions">("info");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  // Mock data - Replace with actual API calls
  useEffect(() => {
    const mockQuiz: Quiz = {
      id: quizId,
      title: "JavaScript Fundamentals",
      description:
        "Master the core concepts of JavaScript programming language including variables, functions, and control structures.",
      category: "Programming",
      difficulty: "Beginner",
      duration: 30,
      total_questions: 20,
      learning_objectives: [
        "Understand JavaScript syntax and basic concepts",
        "Work with variables and data types",
        "Master functions and scope",
      ],
      prerequisites: [
        "Basic HTML knowledge",
        "Understanding of programming concepts",
      ],
      tags: ["JavaScript", "Programming", "Web Development"],
      passing_score: 70,
      max_attempts: 3,
      estimated_time: "25-30 minutes",
      color: "#3B82F6",
      status: "published",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-07-20T14:30:00Z",
      created_by: 1,
      creator_id: 0,
      creator_name: "",
      enrollment_count: 0,
      completion_rate: 0,
      average_score: 0,
    };

    const mockQuestions: Question[] = [
      {
        id: 1,
        quiz_id: quizId,
        question_text:
          "What is the correct way to declare a variable in JavaScript?",
        type: "multiple_choice",
        options: [
          "var myVar;",
          "variable myVar;",
          "v myVar;",
          "declare myVar;",
        ],
        correct_answers: ["var myVar;"],
        explanation:
          "In JavaScript, variables are declared using 'var', 'let', or 'const' keywords.",
        points: 1,
        order: 1,
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-07-20T14:30:00Z",
        order_index: 0,
      },
      {
        id: 2,
        quiz_id: quizId,
        question_text: "Which of the following are JavaScript data types?",
        type: "multiple_choice",
        options: ["String", "Number", "Boolean", "All of the above"],
        correct_answers: ["All of the above"],
        explanation:
          "JavaScript has several primitive data types including String, Number, Boolean, Undefined, Null, and Symbol.",
        points: 2,
        order: 2,
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-07-20T14:30:00Z",
        order_index: 0,
      },
    ];

    setQuiz(mockQuiz);
    setQuestions(mockQuestions);
    setIsLoading(false);
  }, [quizId]);

  const handleAddQuestion = () => {
    setModalMode("create");
    setSelectedQuestion(null);
    setIsQuestionModalOpen(true);
  };

  const handleEditQuestion = (question: Question) => {
    setModalMode("edit");
    setSelectedQuestion(question);
    setIsQuestionModalOpen(true);
  };

  const handleDeleteQuestion = (question: Question) => {
    if (confirm(`Are you sure you want to delete this question?`)) {
      setQuestions((prev) => prev.filter((q) => q.id !== question.id));
    }
  };

  const handleBackToList = () => {
    router.push("/admin/quizzes");
  };

  if (isLoading || !quiz) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToList}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-gray-600 mt-1">Quiz Management</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <StatusBadge status={quiz.status} type="status" />
          <StatusBadge status={quiz.difficulty} type="difficulty" />
        </div>
      </div>

      {/* Quiz Header Card */}
      <div
        className="rounded-xl p-6 text-white relative overflow-hidden"
        style={{ backgroundColor: quiz.color }}
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/80 text-sm font-medium">
              {quiz.category}
            </span>
            <div className="flex items-center space-x-4 text-white/90 text-sm">
              <span>{quiz.duration} min</span>
              <span>{quiz.total_questions} questions</span>
              <span>{quiz.passing_score}% to pass</span>
            </div>
          </div>
          <p className="text-white/90 leading-relaxed">{quiz.description}</p>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("info")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "info"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Quiz Information
            </button>
            <button
              onClick={() => setActiveTab("questions")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "questions"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Questions ({questions.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "info" ? (
            <div className="space-y-8">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Duration</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {quiz.duration} min
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Questions</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {quiz.total_questions}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">
                    Passing Score
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {quiz.passing_score}%
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-500 mb-1">Max Attempts</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {quiz.max_attempts}
                  </div>
                </div>
              </div>

              {/* Learning Objectives */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Learning Objectives
                </h3>
                <div className="space-y-2">
                  {quiz.learning_objectives.map((objective, index) => (
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
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Prerequisites
                </h3>
                <div className="space-y-2">
                  {quiz.prerequisites.map((prerequisite, index) => (
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
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {quiz.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Metadata */}
              <div className="pt-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-500">
                  <div>
                    <span className="font-medium">Created:</span>{" "}
                    {formatDate(quiz.created_at)}
                  </div>
                  <div>
                    <span className="font-medium">Last Updated:</span>{" "}
                    {formatDate(quiz.updated_at)}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Questions Header */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Questions
                </h3>
                <button
                  onClick={handleAddQuestion}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium 
                           hover:bg-blue-700 transition-colors duration-200
                           flex items-center space-x-2"
                >
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>Add Question</span>
                </button>
              </div>

              {/* Questions List */}
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                            Q{index + 1}
                          </span>
                          <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded capitalize">
                            {question.type.replace("_", " ")}
                          </span>
                          <span className="text-sm text-gray-500">
                            {question.points}{" "}
                            {question.points === 1 ? "point" : "points"}
                          </span>
                        </div>

                        <h4 className="text-lg font-medium text-gray-900 mb-3">
                          {question.question_text}
                        </h4>

                        {question.options && (
                          <div className="space-y-2 mb-3">
                            {question.options.map((option, optionIndex) => (
                              <div
                                key={optionIndex}
                                className={`flex items-center space-x-2 p-2 rounded ${
                                  question.correct_answers.includes(option)
                                    ? "bg-green-50 border border-green-200"
                                    : "bg-gray-50"
                                }`}
                              >
                                <span className="text-sm font-medium text-gray-600">
                                  {String.fromCharCode(65 + optionIndex)}.
                                </span>
                                <span className="text-sm text-gray-800">
                                  {option}
                                </span>
                                {question.correct_answers.includes(option) && (
                                  <svg
                                    className="w-4 h-4 text-green-600"
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
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {question.explanation && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="text-sm font-medium text-blue-800 mb-1">
                              Explanation:
                            </div>
                            <div className="text-sm text-blue-700">
                              {question.explanation}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center space-x-1 ml-4">
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

              {questions.length === 0 && (
                <div className="text-center py-12">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
                    Get started by adding your first question.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Question Modal */}
      {isQuestionModalOpen && (
        <QuestionModal
          question={selectedQuestion}
          mode={modalMode}
          isOpen={isQuestionModalOpen}
          onClose={() => setIsQuestionModalOpen(false)}
          onSave={(questionData) => {
            if (modalMode === "create") {
              const newQuestion: Question = {
                id: Math.max(...questions.map((q) => q.id), 0) + 1,
                quiz_id: quizId,
                order: questions.length + 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                question_text: questionData.question_text ?? "",
                type: questionData.type ?? "multiple_choice",
                options: questionData.options ?? [],
                correct_answers: questionData.correct_answers ?? [],
                explanation: questionData.explanation ?? "",
                points: questionData.points ?? 1,
                order_index: 0,
              };
              setQuestions((prev) => [...prev, newQuestion]);
            } else {
              setQuestions((prev) =>
                prev.map((q) =>
                  q.id === selectedQuestion?.id
                    ? {
                        ...q,
                        ...questionData,
                        updated_at: new Date().toISOString(),
                      }
                    : q
                )
              );
            }
            setIsQuestionModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
