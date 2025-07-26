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
import Link from "next/link";
import CustomLink from "../common/CustomLink";
import PageHeader from "../common/PageHeader";
import AdminBreadcrumb from "../common/AdminBreadcrumb";

export default function QuizManagement() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [filters, setFilters] = useState<QuizFilters>({});
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - Replace with actual API calls
  useEffect(() => {
    const mockQuizzes: Quiz[] = [
      {
        id: 1,
        title: "JavaScript Fundamentals",
        description: "Learn the basics of JavaScript programming language",
        category: "Programming",
        difficulty: "Beginner",
        duration: 45,
        total_questions: 20,
        learning_objectives: ["Variables", "Functions", "Objects"],
        prerequisites: ["Basic HTML knowledge"],
        tags: ["javascript", "programming", "web"],
        passing_score: 70,
        max_attempts: 3,
        status: "published",
        created_at: "2024-01-15T10:00:00Z",
        updated_at: "2024-07-20T14:30:00Z",
        published_at: "2024-01-20T09:00:00Z",
        creator_id: 1,
        creator_name: "John Smith",
        enrollment_count: 245,
        completion_rate: 78.5,
        average_score: 82.3,
        last_attempt_date: "2024-07-23T15:45:00Z",
        estimated_time: "",
        color: "",
        created_by: 0,
      },
      {
        id: 2,
        title: "Advanced React Patterns",
        description: "Master advanced React concepts and design patterns",
        category: "Programming",
        difficulty: "Advanced",
        duration: 90,
        total_questions: 35,
        learning_objectives: ["Hooks", "Context", "Performance"],
        prerequisites: ["React basics", "JavaScript ES6+"],
        tags: ["react", "javascript", "frontend"],
        passing_score: 80,
        max_attempts: 2,
        status: "published",
        created_at: "2024-02-10T14:30:00Z",
        updated_at: "2024-07-18T11:20:00Z",
        published_at: "2024-02-15T10:00:00Z",
        creator_id: 2,
        creator_name: "Jane Doe",
        enrollment_count: 156,
        completion_rate: 65.2,
        average_score: 76.8,
        last_attempt_date: "2024-07-22T20:15:00Z",
        estimated_time: "",
        color: "",
        created_by: 0,
      },
      {
        id: 3,
        title: "Database Design Principles",
        description:
          "Learn fundamental concepts of database design and normalization",
        category: "Database",
        difficulty: "Intermediate",
        duration: 60,
        total_questions: 25,
        learning_objectives: ["Normalization", "Relationships", "Indexing"],
        prerequisites: ["Basic SQL knowledge"],
        tags: ["database", "sql", "design"],
        passing_score: 75,
        max_attempts: 3,
        status: "draft",
        created_at: "2024-03-05T09:15:00Z",
        updated_at: "2024-07-21T16:45:00Z",
        published_at: "",
        creator_id: 3,
        creator_name: "Mike Johnson",
        enrollment_count: 0,
        completion_rate: 0,
        average_score: 0,
        last_attempt_date: "",
        estimated_time: "",
        color: "",
        created_by: 0,
      },
    ];

    setTimeout(() => {
      setQuizzes(mockQuizzes);
      setFilteredQuizzes(mockQuizzes);
      setIsLoading(false);
    }, 500);
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
          quiz.category.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters.category) {
      filtered = filtered.filter((quiz) => quiz.category === filters.category);
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

  const handleCreateQuiz = () => {
    router.push("/admin/quizzes/add");
  };

  const handleEditQuiz = (quiz: Quiz) => {
    router.push(`/admin/quizzes/${quiz.id}/edit`);
  };

  const handleViewQuiz = (quiz: Quiz) => {
    router.push(`/admin/quizzes/${quiz.id}`);
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
            <span className="text-gray-600">Loading quizzes...</span>
          </div>
        </div>
      </div>
    );
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
                          by {quiz.creator_name} • {quiz.duration} min
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-200 text-gray-800">
                      {quiz.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={quiz.difficulty} type="difficulty" />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={quiz.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {quiz.total_questions}
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
