"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FlashcardSet, FlashcardSetStatus } from "@/types/public/flashcard";
import { FlashcardSetFilters } from "@/types/admin/admin";
import { formatDate } from "@/utils/admin";
import SearchBar from "@/components/admin/common/SearchBar";
import FilterSelect from "@/components/admin/common/FilterSelect";
import ActionButton from "@/components/admin/common/ActionButton";
import StatusBadge from "@/components/admin/common/StatusBadge";
import { Layers, Plus, Archive, CheckCircle } from "lucide-react";
import CustomLink from "../common/CustomLink";
import AdminBreadcrumb from "../common/AdminBreadcrumb";
import {
  getFlashcardSets,
  deleteFlashcardSet,
  updateFlashcardSetStatus,
  archiveFlashcardSet,
} from "@/api/flashcards";
import { getCategories } from "@/api/categories";
import Pagination from "@/components/common/Pagination";
import { DataLoading } from "@/components/common/LoadingScreen";
import { Category } from "@/types/admin/admin";
import PageHeader from "../common/PageHeader";

export default function FlashcardManagement() {
  const router = useRouter();
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([]);
  const [filteredSets, setFilteredSets] = useState<FlashcardSet[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filters, setFilters] = useState<FlashcardSetFilters>({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [setsResponse, categoriesResponse] = await Promise.all([
          getFlashcardSets(),
          getCategories(),
        ]);
        setFlashcardSets(setsResponse);
        setFilteredSets(setsResponse);
        setCategories(categoriesResponse);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    // const fetchInitialData = async () => {
    //   try {
    //     setIsLoading(true);
    //     const [setsRaw, categoriesResponse] = await Promise.all([
    //       getFlashcardSets(),
    //       getCategories(),
    //     ]);

    //     const setsResponse = setsRaw as any;
    //     console.log("Dữ liệu Flashcards nhận về:", setsResponse);
    //     // Xử lý bóc tách lớp dữ liệu
    //     let finalArray = [];

    //     // Nếu bạn dùng axiosAPI và return res.data trong file api service:
    //     // setsResponse lúc này là { success: true, data: [...] hoặc {data: [...]} }

    //     if (Array.isArray(setsResponse)) {
    //       finalArray = setsResponse;
    //     } else if (setsResponse && Array.isArray(setsResponse.data)) {
    //       // Trường hợp Laravel trả về ['data' => $sets]
    //       finalArray = setsResponse.data;
    //     } else if (
    //       setsResponse &&
    //       setsResponse.data &&
    //       Array.isArray(setsResponse.data.data)
    //     ) {
    //       // Trường hợp Laravel vẫn còn Paginate: ['data' => ['data' => [...]]]
    //       finalArray = setsResponse.data.data;
    //     }

    //     const finalCategories = Array.isArray(categoriesResponse)
    //       ? categoriesResponse
    //       : (categoriesResponse as any).data || [];

    //     setFlashcardSets(finalArray);
    //     setFilteredSets(finalArray);
    //     setCategories(finalCategories);
    //   } catch (error) {
    //     console.error("Failed to fetch initial data:", error);
    //   } finally {
    //     setIsLoading(false);
    //   }
    // };

    fetchInitialData();
  }, []);

  // Filter flashcard sets based on search and filters
  useEffect(() => {
    let filtered = [...flashcardSets];

    if (filters.search) {
      filtered = filtered.filter(
        (set) =>
          set.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
          set.description
            ?.toLowerCase()
            .includes(filters.search!.toLowerCase()),
      );
    }

    if (filters.status) {
      filtered = filtered.filter((set) => set.status === filters.status);
    }

    if (filters.sourceType) {
      filtered = filtered.filter(
        (set) => set.sourceType === filters.sourceType,
      );
    }

    if (filters.category) {
      filtered = filtered.filter(
        (set) => set.category?.name === filters.category,
      );
    }

    setFilteredSets(filtered);
  }, [flashcardSets, filters]);

  // Reset to first page when filters change or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, pageSize]);

  const paginatedSets = filteredSets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
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

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({
      ...prev,
      status: status === "all" ? undefined : status,
    }));
  };

  const handleSourceTypeFilter = (sourceType: string) => {
    setFilters((prev) => ({
      ...prev,
      sourceType: sourceType === "all" ? undefined : sourceType,
    }));
  };

  const handleDeleteSet = async (set: FlashcardSet) => {
    if (window.confirm(`Bạn có chắc muốn xoá bộ thẻ "${set.title}"?`)) {
      try {
        await deleteFlashcardSet(set.id);
        setFlashcardSets((prev) => prev.filter((s) => s.id !== set.id));
      } catch (error) {
        console.error("Failed to delete flashcard set:", error);
        alert("Failed to delete flashcard set. Please try again.");
      }
    }
  };

  const handleUpdateStatus = async (id: number, status: FlashcardSetStatus) => {
    const action = status === "published" ? "publish" : status;
    if (
      window.confirm(`Bạn có chắc muốn ${action} bộ thẻ này?`)
    ) {
      try {
        const updated = await updateFlashcardSetStatus(id, status);
        setFlashcardSets((prev) =>
          prev.map((s) => (s.id === id ? updated : s)),
        );
      } catch (error) {
        console.error(`Failed to update status to ${status}:`, error);
        alert(`Failed to update status. Please try again.`);
      }
    }
  };

  const handleArchive = async (id: number) => {
    if (
      window.confirm("Bạn có chắc muốn lưu trữ bộ thẻ này? Bộ thẻ sẽ không hiển thị trên trang người dùng nữa.")
    ) {
      try {
        const updated = await archiveFlashcardSet(id);
        setFlashcardSets((prev) =>
          prev.map((s) => (s.id === id ? updated : s)),
        );
      } catch (error) {
        console.error("Failed to archive flashcard set:", error);
        alert("Failed to archive flashcard set. Please try again.");
      }
    }
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.name,
    label: cat.name,
  }));

  const statusOptions = [
    { value: "draft", label: "Nháp" },
    { value: "published", label: "Xuất bản" },
    { value: "archived", label: "Lưu trữ" },
  ];

  const sourceTypeOptions = [
    { value: "manual", label: "Thủ công" },
    { value: "ai_generated", label: "Tạo bằng AI" },
    { value: "quiz_wrong_answers", label: "Câu trả lời sai" },
  ];

  if (isLoading) {
    return <DataLoading text="Đang tải danh sách bộ thẻ..." />;
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb currentPage="Quản lý bộ thẻ" />

      {/* Header */}
      <PageHeader
        title="Quản lý bộ thẻ"
        icon={<Layers />}
        actionLabel="Thêm bộ thẻ mới"
        actionHref="/admin/flashcards/add"
        actionIcon={<Plus />}
        bgGradient="from-blue-50 to-indigo-50"
        buttonGradient="from-blue-500 to-indigo-600"
      />

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <SearchBar
            placeholder="Tìm kiếm bộ thẻ..."
            onSearch={handleSearch}
            value={filters.search || ""}
          />
          <FilterSelect
            value={filters.category || ""}
            onChange={handleCategoryFilter}
            options={categoryOptions}
            placeholder="Tất cả danh mục"
          />
          <FilterSelect
            value={filters.status || ""}
            onChange={handleStatusFilter}
            options={statusOptions}
            placeholder="Tất cả trạng thái"
          />
          <FilterSelect
            value={filters.sourceType || ""}
            onChange={handleSourceTypeFilter}
            options={sourceTypeOptions}
            placeholder="Tất cả nguồn tạo"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y table-fixed divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Tên bộ thẻ
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Nguồn tạo
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Số thẻ
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedSets.map((set) => (
                <tr key={set.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white bg-blue-600">
                          <Layers className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {set.title}
                        </p>
                        <p className="text-xs text-gray-500 truncate block max-w-xs">
                          {set.description || "No description"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        set.sourceType === "ai_generated"
                          ? "bg-purple-100 text-purple-800"
                          : set.sourceType === "quiz_wrong_answers"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {set.sourceType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-200 text-gray-800">
                      {set.category?.name || "Khác"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={set.status} />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm font-semibold text-blue-600">
                      {set.cardCount || 0}
                    </div>
                    <div className="text-xs text-gray-600">thẻ</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(set.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <CustomLink
                        href={`/admin/flashcards/${set.id}`}
                        title="View"
                        type="view"
                      />
                      <CustomLink
                        href={`/admin/flashcards/${set.id}/edit`}
                        title="Edit"
                        type="edit"
                      />

                      {set.status === "draft" && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(set.id, "published")
                          }
                          className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Publish"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}

                      {set.status !== "archived" && (
                        <button
                          onClick={() => handleArchive(set.id)}
                          className="p-1 text-amber-600 hover:bg-amber-50 rounded transition-colors"
                          title="Archive"
                        >
                          <Archive className="w-5 h-5" />
                        </button>
                      )}

                      <ActionButton
                        variant="delete"
                        onClick={() => handleDeleteSet(set)}
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
            totalItems={filteredSets.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </div>

        {filteredSets.length === 0 && (
          <div className="text-center py-12">
            <Layers className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No flashcard sets found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your filters or search query.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
