"use client";

import { useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { Award, Plus } from "lucide-react";
import { toast } from "react-hot-toast";
import { deleteAchievement, getAchievements } from "@/api/achievements";
import ActionButton from "@/components/admin/common/ActionButton";
import AdminBreadcrumb from "@/components/admin/common/AdminBreadcrumb";
import CustomLink from "@/components/admin/common/CustomLink";
import FilterSelect from "@/components/admin/common/FilterSelect";
import PageHeader from "@/components/admin/common/PageHeader";
import SearchBar from "@/components/admin/common/SearchBar";
import Pagination from "@/components/common/Pagination";
import { DataLoading } from "@/components/common/LoadingScreen";
import {
  Achievement,
  AchievementFilters,
} from "@/types/admin/achievement";

const typeOptions = [
  { value: "general", label: "General" },
  { value: "quiz", label: "Quiz" },
  { value: "flashcard", label: "Flashcard" },
  { value: "streak", label: "Streak" },
  { value: "xp", label: "XP" },
  { value: "creator", label: "Creator" },
  { value: "community", label: "Community" },
  { value: "leaderboard", label: "Leaderboard" },
];

const rarityOptions = [
  { value: "common", label: "Common" },
  { value: "rare", label: "Rare" },
  { value: "epic", label: "Epic" },
  { value: "legendary", label: "Legendary" },
];

const activeOptions = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

const rarityClasses: Record<string, string> = {
  common: "bg-slate-100 text-slate-700",
  rare: "bg-sky-100 text-sky-700",
  epic: "bg-fuchsia-100 text-fuchsia-700",
  legendary: "bg-amber-100 text-amber-800",
};

const getDeleteMessage = (error: unknown) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  if (axiosError.response?.status === 422) {
    return axiosError.response.data?.message || "Không thể xoá danh hiệu này.";
  }
  return "Xoá danh hiệu thất bại. Vui lòng thử lại.";
};

export default function AchievementList() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filters, setFilters] = useState<AchievementFilters>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await getAchievements();
        setAchievements(data);
      } catch (err) {
        console.error("Failed to fetch achievements:", err);
        setError("Không thể tải danh sách danh hiệu.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, pageSize]);

  const filteredAchievements = useMemo(() => {
    return achievements.filter((achievement) => {
      const search = filters.search?.trim().toLowerCase();
      const matchesSearch =
        !search ||
        achievement.code.toLowerCase().includes(search) ||
        achievement.name.toLowerCase().includes(search) ||
        achievement.description?.toLowerCase().includes(search);

      const matchesType = !filters.type || achievement.type === filters.type;
      const matchesRarity =
        !filters.rarity || achievement.rarity === filters.rarity;
      const matchesActive =
        !filters.is_active ||
        String(achievement.is_active) === filters.is_active;

      return matchesSearch && matchesType && matchesRarity && matchesActive;
    });
  }, [achievements, filters]);

  const paginatedAchievements = filteredAchievements.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleDelete = async (achievement: Achievement) => {
    if (!window.confirm(`Bạn có chắc muốn xoá "${achievement.name}"?`)) return;

    try {
      await deleteAchievement(achievement.id);
      setAchievements((prev) =>
        prev.filter((item) => item.id !== achievement.id),
      );
      toast.success("Đã xoá danh hiệu.");
    } catch (err) {
      console.error("Failed to delete achievement:", err);
      toast.error(getDeleteMessage(err));
    }
  };

  if (isLoading) {
    return <DataLoading text="Đang tải danh sách danh hiệu..." />;
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb currentPage="Quản lý danh hiệu" />

      <PageHeader
        title="Quản lý danh hiệu"
        icon={<Award />}
        actionLabel="Thêm danh hiệu"
        actionHref="/admin/achievements/add"
        actionIcon={<Plus />}
        bgGradient="from-amber-50 to-rose-50"
        buttonGradient="from-amber-500 to-rose-500"
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <SearchBar
            placeholder="Tìm theo code, tên, mô tả..."
            value={filters.search || ""}
            onSearch={(search) =>
              setFilters((prev) => ({ ...prev, search }))
            }
          />
          <FilterSelect
            value={filters.type || ""}
            onChange={(type) =>
              setFilters((prev) => ({
                ...prev,
                type: type === "all" ? undefined : type,
              }))
            }
            options={typeOptions}
            placeholder="Tất cả loại"
          />
          <FilterSelect
            value={filters.rarity || ""}
            onChange={(rarity) =>
              setFilters((prev) => ({
                ...prev,
                rarity: rarity === "all" ? undefined : rarity,
              }))
            }
            options={rarityOptions}
            placeholder="Tất cả độ hiếm"
          />
          <FilterSelect
            value={filters.is_active || ""}
            onChange={(isActive) =>
              setFilters((prev) => ({
                ...prev,
                is_active: isActive === "all" ? undefined : isActive,
              }))
            }
            options={activeOptions}
            placeholder="Tất cả trạng thái"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-amber-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Danh hiệu
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Rarity
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Target
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  XP
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Token
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Active
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedAchievements.map((achievement) => (
                <tr
                  key={achievement.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="h-11 w-11 rounded-lg bg-amber-100 text-2xl flex items-center justify-center">
                        {achievement.icon || "🏅"}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate max-w-xs">
                          {achievement.name}
                        </p>
                        <p className="text-xs text-gray-500 font-mono">
                          {achievement.code}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 capitalize">
                    {achievement.type}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        rarityClasses[achievement.rarity]
                      }`}
                    >
                      {achievement.rarity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                    {achievement.target_value}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700">
                    {achievement.xp_reward}
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700">
                    {achievement.token_reward}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        achievement.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {achievement.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm font-semibold text-blue-600">
                    {achievement.user_achievements_count ?? "-"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CustomLink
                        href={`/admin/achievements/${achievement.id}`}
                        title="View"
                        type="view"
                      />
                      <CustomLink
                        href={`/admin/achievements/${achievement.id}/edit`}
                        title="Edit"
                        type="edit"
                      />
                      <ActionButton
                        variant="delete"
                        onClick={() => handleDelete(achievement)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-200">
          <Pagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalItems={filteredAchievements.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Award className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Không tìm thấy danh hiệu
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Thử đổi bộ lọc hoặc từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
