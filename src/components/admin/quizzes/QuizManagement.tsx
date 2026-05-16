"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Quiz, QuizFilters } from "@/types/admin/admin";
import SearchBar from "@/components/admin/common/SearchBar";
import FilterSelect from "@/components/admin/common/FilterSelect";
import ActionButton from "@/components/admin/common/ActionButton";
import StatusBadge from "@/components/admin/common/StatusBadge";
import { ClipboardList, NotebookPen, Plus } from "lucide-react";
import CustomLink from "../common/CustomLink";
import AdminBreadcrumb from "../common/AdminBreadcrumb";
import { getQuizzes, deleteQuiz } from "@/api/quiz";
import { getCategories } from "@/api/categories";
import Pagination from "@/components/common/Pagination";
import { DataLoading } from "@/components/common/LoadingScreen";
import { Category } from "@/types/admin/admin";

export default function QuizManagement() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<QuizFilters>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [quizzesResponse, categoriesResponse] = await Promise.all([
          getQuizzes(),
          getCategories()
        ]);
        setQuizzes(quizzesResponse);
        setFilteredQuizzes(quizzesResponse);
        setCategories(categoriesResponse);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Filter quizzes based on search and filters
  useEffect(() => {
    let filtered = [...quizzes];

    if (filters.search) {
      filtered = filtered.filter(
        (quiz) =>
          quiz.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
          quiz.description
            .toLowerCase()
            .includes(filters.search!.toLowerCase()) ||
          quiz.category?.name
            .toLowerCase()
            .includes(filters.search!.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter(
        (quiz) => quiz.category?.name === filters.category
      );
    }

    if (filters.difficulty) {
      filtered = filtered.filter(
        (quiz) => quiz.difficulty === filters.difficulty
      );
    }

    if (filters.status) {
      filtered = filtered.filter((quiz) => quiz.status === filters.status);
    }

    setFilteredQuizzes(filtered);
  }, [quizzes, filters]);

  // Reset to first page when filters change or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, pageSize]);

  const paginatedQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSearch = (query: string) => {
    setFilters((prev) => ({ ...prev, search: query }));
  };

  const handleCategoryFilter = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category: category === "all" ? undefined : category,
    }));
  };

  const handleDifficultyFilter = (difficulty: string) => {
    setFilters((prev) => ({
      ...prev,
      difficulty: difficulty === "all" ? undefined : difficulty,
    }));
  };

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: status === "all" ? undefined : status,
    }));
  };

  const handleDeleteQuiz = async (quiz: Quiz) => {
    if (window.confirm(`Are you sure you want to delete "${quiz.title}"?`)) {
      try {
        await deleteQuiz(quiz.id);
        // Chỉ xóa khỏi state sau khi API thành công
        setQuizzes((prev) => prev.filter((q) => q.id !== quiz.id));
      } catch (error) {
        console.error("Failed to delete quiz:", error);
        alert("Failed to delete quiz. Please try again.");
      }
    }
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.name,
    label: cat.name,
  }));

  const difficultyOptions = [
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" },
  ];

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "published", label: "Published" },
    { value: "archived", label: "Archived" },
  ];

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

  if (isLoading) {
    return <DataLoading text="Loading the Quizzes List..." />;
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <AdminBreadcrumb currentPage="Quizzes Management" />
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <NotebookPen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quizzes Management</h1>
              <p className="text-gray-600">Manage and create quizzes for your platform</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* AI Quiz Button */}
            <button
              onClick={() => window.location.href = '/admin/ai-quiz'}
              className="group relative px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 group-hover:animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>AI Quiz</span>
              </div>
            </button>

            {/* Regular Add Button */}
            <button
              onClick={() => router.push('/admin/quizzes/add')}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              title="Add New Quiz"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <SearchBar
            placeholder="Search quizzes..."
            onSearch={handleSearch}
            value={filters.search || ""}
          />
          <FilterSelect
            value={filters.category || ""}
            onChange={handleCategoryFilter}
            options={categoryOptions}
            placeholder="All Categories"
          />
          <FilterSelect
            value={filters.difficulty || ""}
            onChange={handleDifficultyFilter}
            options={difficultyOptions}
            placeholder="All Difficulties"
          />
          <FilterSelect
            value={filters.status || ""}
            onChange={handleStatusFilter}
            options={statusOptions}
            placeholder="All Status"
          />
        </div>
      </div>

      {/* Quiz Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y table-fixed divide-gray-200">
            <thead className="bg-indigo-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Quiz
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Questions
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedQuizzes.map((quiz) => (
                <tr
                  key={quiz.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 text-blue-700 bg-blue-100 rounded-lg flex items-center justify-center">
                          <ClipboardList />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {quiz.title}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500 truncate block max-w-xs">
                          {quiz.description}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Time limit: {quiz.duration} min
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-200 text-gray-800">
                      {quiz.category?.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={quiz.difficulty} type="difficulty" />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={quiz.status} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm text-fuchsia-700">
                      {quiz.questions_count}
                    </div>
                    <div className="text-xs text-gray-500">questions</div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm text-green-900">
                      {quiz.price_token}
                    </div>
                    <div className="text-xs text-gray-500">Tokens</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <CustomLink
                        href={`/admin/quizzes/${quiz.id}`}
                        title="View quiz"
                        type="view"
                      />
                      <CustomLink
                        href={`/admin/quizzes/${quiz.id}/edit`}
                        title="Edit quiz"
                        type="edit"
                      />
                      <ActionButton
                        variant="delete"
                        onClick={() => handleDeleteQuiz(quiz)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={filteredQuizzes.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[5, 10, 20]}
          />
        </div>

        {filteredQuizzes.length === 0 && (
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
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No quizzes found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new quiz.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
