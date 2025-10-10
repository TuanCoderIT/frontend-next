"use client";

import { useEffect, useState } from "react";
import { getQuizzes, getCategories } from "@/api/quiz";
import QuizCard from "@/components/quiz/QuizCard";
import SearchBar from "@/components/quiz/SearchBar";
import CategoryFilter from "@/components/quiz/CategoryFilter";
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

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories([{ id: "All", name: "All" }, ...data]);
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
      ? "All Quizzes"
      : categories.find((c) => c.id === selectedCategory)?.name || "Category";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Explore <span className="text-blue-600">Quizzes</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Test your knowledge with our carefully crafted quizzes across
            various subjects.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          {/* Quiz Grid */}
          <div className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">
                {selectedCategoryName}
                <span className="text-gray-500 text-lg ml-2">
                  ({filteredQuizzes.length})
                </span>
              </h2>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Sort by: Difficulty</option>
                <option>Sort by: Duration</option>
                <option>Sort by: Progress</option>
              </select>
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
                  No quizzes found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedQuizzes.map((quiz) => (
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
    </div>
  );
}
