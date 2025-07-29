"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Quiz, QuizFilters } from "@/types/admin/admin";
import { formatDate } from "@/utils/admin";
import SearchBar from "@/components/admin/common/SearchBar";
import FilterSelect from "@/components/admin/common/FilterSelect";
import ActionButton from "@/components/admin/common/ActionButton";
import StatusBadge from "@/components/admin/common/StatusBadge";
import { ClipboardList, NotebookPen, Plus } from "lucide-react";
import CustomLink from "../common/CustomLink";
import PageHeader from "../common/PageHeader";
import AdminBreadcrumb from "../common/AdminBreadcrumb";
import { getQuizzes } from "@/api/quiz";
import { DataLoading } from "@/components/common/LoadingScreen";

export default function QuizManagement() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [filters, setFilters] = useState<QuizFilters>({});
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - Replace with actual API calls
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        // Replace with actual API call
        const response = await getQuizzes();
        setQuizzes(response);
        setFilteredQuizzes(response);
        console.log(response);
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
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

  const handleDeleteQuiz = (quiz: Quiz) => {
    if (window.confirm(`Are you sure you want to delete "${quiz.title}"?`)) {
      setQuizzes((prev) => prev.filter((q) => q.id !== quiz.id));
    }
  };

  const categoryOptions = [
    { value: "Programming", label: "Programming" },
    { value: "Database", label: "Database" },
    { value: "Mathematics", label: "Mathematics" },
    { value: "Science", label: "Science" },
  ];

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
      <PageHeader
        title="Quizzes Management"
        icon={<NotebookPen />}
        actionLabel="Add new quiz"
        actionHref="/admin/quizzes/add"
        actionIcon={<Plus />}
        bgGradient="from-green-50 to-emerald-50"
        buttonGradient="from-green-500 to-emerald-600"
      />

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
                  Enrollments
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQuizzes.map((quiz) => (
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
                        <p className="text-sm text-gray-500 truncate">
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
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {quiz.enrollment_count}
                    </div>
                    <div className="text-xs text-gray-500">students</div>
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
