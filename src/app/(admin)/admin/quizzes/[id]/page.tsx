"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Quiz, Question } from "@/types/admin/admin";
import { formatDate } from "@/utils/admin";
import StatusBadge from "@/components/admin/common/StatusBadge";
import ActionButton from "@/components/admin/common/ActionButton";
import QuestionModal from "@/components/admin/quizzes/QuestionModal";
import { ArrowLeft, BookCheck, CircleQuestionMark, Plus } from "lucide-react";
import { getQuizById } from "@/api/quiz";
import { PageLoading } from "@/components/common/LoadingScreen";
import PageHeader from "@/components/admin/common/PageHeader";
import AdminBreadcrumb from "@/components/admin/common/AdminBreadcrumb";
import {
  createQuestion,
  deleteQuestion,
  updateQuestion,
} from "@/api/questions";
import { mapOptions } from "@/utils/questionUtils";

export default function QuizDetailPage() {
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;
  const { id } = useParams(); // Next.js trả về chuỗi
  const [existingQuizData, setExistingQuizData] = useState<any>(null);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await getQuizById(Number(id));
        setExistingQuizData(data);
        setQuiz(data);
        setQuestions(data.questions || []);
        setIsLoading(false);
      } catch (err) {
        console.error(err);
        setIsLoading(false);
      }
    };
    if (id) fetchQuiz();
  }, [id]);

  if (!existingQuizData)
    return <PageLoading text="Loading Quiz Information..." />;

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

  const handleDeleteQuestion = async (question: Question) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      try {
        await deleteQuestion(question.id);
        setQuestions((prev) => prev.filter((q) => q.id !== question.id));
      } catch (error) {
        console.error("Xoá thất bại:", error);
      }
    }
  };

  const handleSaveQuestion = async (questionData: Partial<Question>) => {
    try {
      const payload = {
        ...questionData,
        exam_id: parseInt(quizId), // Thêm exam_id tại đây
      };
      if (modalMode === "create") {
        const created = await createQuestion(payload);
        setQuestions((prev) => [...prev, created]); // cập nhật state sau khi tạo
      } else if (modalMode === "edit" && selectedQuestion) {
        const updated = await updateQuestion(selectedQuestion.id, questionData);
        setQuestions((prev) =>
          prev.map((q) => (q.id === selectedQuestion.id ? updated : q))
        );
      }

      setIsQuestionModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi lưu câu hỏi:", error);
      // TODO: hiển thị lỗi ra UI nếu cần
    }
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
    return <PageLoading text="Loading Quiz Details..." />;
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
      <AdminBreadcrumb
        currentPage="Quiz Details"
        parent={{ href: "/admin/quizzes", label: "Quizzes" }}
      />
      {/* Header */}
      <div className="mb-8">
        <PageHeader
          title={quiz.title}
          icon={<BookCheck />}
          actionLabel="Back to Quizzes"
          actionHref="/admin/quizzes"
          actionIcon={<ArrowLeft />}
          bgGradient="from-green-50 to-emerald-50"
          buttonGradient="from-green-500 to-emerald-600"
        />

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
            <div className="bg-white rounded-2xl border shadow-md border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-indigo-700 mb-4">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {quiz.description}
              </p>
            </div>

            {/* Learning Objectives */}
            <div className="bg-white rounded-2xl border shadow-md border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-indigo-700 mb-4">
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
            <div className="bg-white rounded-2xl border shadow-md border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-indigo-700 mb-4">
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
              <h2 className="text-lg font-semibold text-indigo-700 mb-4">
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
              </div>
            </div>
            {/* Options */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-indigo-700 mb-4">
                Options
              </h2>
              <div className="flex items-center space-x-4 mt-2">
                <StatusBadge status={quiz.status} />
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium ${getDifficultyColor(
                    quiz.difficulty
                  )}`}
                >
                  {quiz.difficulty}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-cyan-200 text-black">
                  {questions.length} Questions
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-indigo-700 mb-4">
                Tags
              </h2>
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
              <h2 className="text-lg font-semibold text-indigo-700 mb-4">
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
                {/* {quiz.published_at && (
                  <div>
                    <span className="text-gray-600">Published:</span>
                    <span className="ml-2 text-gray-900">
                      {formatDate(quiz.published_at)}
                    </span>
                  </div>
                )} */}
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
              icon={<Plus />}
            >
              Add Question
            </ActionButton>
          </div>

          {/* Questions List */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {questions.length === 0 ? (
              <div className="text-center py-12">
                <CircleQuestionMark className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No questions yet
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating your first question.
                </p>
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
                          {question.content || "No question text provided"}
                        </h3>
                        {/* Hiển thị đáp án đúng cho từng loại câu hỏi */}
                        {question.type === "multiple_choice" &&
                          question.options && (
                            <div className="mt-3">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {Object.entries(
                                  mapOptions(Object.values(question.options))
                                ).map(([key, value]) => {
                                  const isCorrect = Array.isArray(
                                    question.answer
                                  )
                                    ? question.answer.includes(key) ||
                                      question.answer.includes(value)
                                    : question.answer === key ||
                                      question.answer === value;
                                  return (
                                    <div
                                      key={key}
                                      className={`p-2 text-sm rounded-lg border ${
                                        isCorrect
                                          ? "bg-green-50 border-green-200 text-green-800"
                                          : "bg-gray-50 border-gray-200 text-gray-700"
                                      }`}
                                    >
                                      <span className="font-medium">
                                        {key}.
                                      </span>{" "}
                                      {value}
                                      {isCorrect && (
                                        <span className="ml-2 text-green-600 font-bold">
                                          ✓
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        {question.type === "true_false" && (
                          <div className="mt-3">
                            <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-green-800 border border-green-200 text-sm font-medium">
                              Đáp án đúng:{" "}
                              <span className="font-semibold">
                                {!Array.isArray(question.answer) &&
                                (question.answer === true ||
                                  question.answer === "True")
                                  ? "Đúng"
                                  : "Sai"}
                              </span>
                            </span>
                          </div>
                        )}
                        {question.type === "short_answer" && (
                          <div className="mt-3">
                            <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-green-800 border border-green-200 text-sm font-medium">
                              Đáp án đúng:{" "}
                              <span className="font-semibold">
                                {Array.isArray(question.answer)
                                  ? question.answer.join(", ")
                                  : question.answer}
                              </span>
                            </span>
                          </div>
                        )}
                        {question.type === "essay" && question.answer && (
                          <div className="mt-3">
                            <span className="inline-block px-3 py-1 rounded-full bg-green-50 text-green-800 border border-green-200 text-sm font-medium">
                              Đáp án mẫu:{" "}
                              <span className="font-semibold">
                                {question.answer}
                              </span>
                            </span>
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
