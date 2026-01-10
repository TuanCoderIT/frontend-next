"use client";

import { useEffect, useState } from "react";
import { getQuizzes, getCategories } from "@/api/quiz";
import QuizCard from "@/components/public/quiz/QuizCard";
import SearchBar from "@/components/public/quiz/SearchBar";
import CategoryFilter from "@/components/public/quiz/CategoryFilter";
import AIQuizBanner from "@/components/common/AIQuizBanner";
import { Exam } from "@/types/public/exams";
import { Category } from "@/types/public/category";
import Pagination from "@/components/common/Pagination";

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState<Exam[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | number>(
    "All"
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories([{ id: "All", name: "Tất cả" }, ...data]);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const data = await getQuizzes(selectedCategory);
      setQuizzes(data);
    };
    fetchQuizzes();
  }, [selectedCategory]);

  const filteredQuizzes = quizzes.filter(
    (quiz: Exam) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- LOGIC PHÂN TRANG (PAGINATION SLICING) ---
  const indexOfLastQuiz = currentPage * pageSize;
  const indexOfFirstQuiz = indexOfLastQuiz - pageSize;
  const paginatedQuizzes = filteredQuizzes.slice(
    indexOfFirstQuiz,
    indexOfLastQuiz
  );
  // --- KẾT THÚC LOGIC PHÂN TRANG ---

  const selectedCategoryName =
    selectedCategory === "All"
      ? "Tất cả bài kiểm tra"
      : categories.find((c) => c.id === selectedCategory)?.name || "Chủ đề";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* AI Quiz Banner */}
      {showBanner && (
        <AIQuizBanner 
          isAdmin={false} 
          onClose={() => setShowBanner(false)} 
        />
      )}
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Khám phá <span className="text-blue-600">bài kiểm tra</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Kiểm tra kiến thức của bạn với các bài kiểm tra được thiết kế
            trên nhiều chủ đề.
          </p>
        </div>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        {/* Search Bar */}
        <div className="mb-8 mt-8">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>

        <div className="space-y-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              {selectedCategoryName}
              <span className="text-gray-500 text-lg ml-2">
                ({filteredQuizzes.length})
              </span>
            </h2>
            <div className="flex items-center space-x-4">
              {/* AI Quiz Button */}
              <button
                onClick={() => window.location.href = '/create-quiz'}
                className="group relative px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <span>Tạo Quiz AI</span>
                </div>
              </button>
              
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Sắp xếp theo: Độ khó</option>
                <option>Sắp xếp theo: Thời gian</option>
                <option>Sắp xếp theo: Tiến trình</option>
              </select>
            </div>
          </div>

          {filteredQuizzes.length === 0 ? (
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
                    d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.467-.881-6.08-2.329C8.207 9.747 10.017 8 12 8s3.793 1.747 6.08 4.671a7.965 7.965 0 01-2.08 2.329z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Không tìm thấy bài kiểm tra
              </h3>
              <p className="text-gray-600">
                Thử điều chỉnh tìm kiếm hoặc tiêu chí lọc
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedQuizzes.map((quiz) => (
                // <QuizCard key={quiz.id} quiz={{ ...quiz, questions_count: 0 }} />
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              pageSize={pageSize}
              totalItems={filteredQuizzes.length}
              onPageChange={setCurrentPage}
              showPageSizeDropdown={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
