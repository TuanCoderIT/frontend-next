"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { ArrowLeft, Award, Calendar, Edit, Hash, Target, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { deleteAchievement } from "@/api/achievements";
import { formatDateTime } from "@/utils/admin";
import { Achievement } from "@/types/admin/achievement";

interface AchievementDetailProps {
  achievement: Achievement;
}

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

const DetailRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1 rounded-xl bg-gray-50 p-4">
    <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
      {label}
    </span>
    <div className="text-sm font-semibold text-gray-900 break-words">
      {value || "-"}
    </div>
  </div>
);

export default function AchievementDetail({
  achievement: initialAchievement,
}: AchievementDetailProps) {
  const router = useRouter();
  const [achievement] = useState<Achievement>(initialAchievement);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Bạn có chắc muốn xoá "${achievement.name}"?`)) return;

    setIsDeleting(true);
    try {
      await deleteAchievement(achievement.id);
      toast.success("Đã xoá danh hiệu.");
      router.push("/admin/achievements");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete achievement:", error);
      toast.error(getDeleteMessage(error));
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button
          onClick={() => router.push("/admin/achievements")}
          className="flex items-center text-gray-600 hover:text-amber-600 transition-colors w-fit"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to list
        </button>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() =>
              router.push(`/admin/achievements/${achievement.id}/edit`)
            }
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="h-32 relative bg-gradient-to-r from-amber-500 to-rose-500">
              <div className="absolute -bottom-10 left-8 h-24 w-24 bg-white rounded-3xl shadow-lg border border-gray-50 flex items-center justify-center text-5xl">
                {achievement.icon || <Award className="w-12 h-12 text-amber-600" />}
              </div>
            </div>
            <div className="p-8 pt-14">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {achievement.name}
                  </h1>
                  <p className="text-sm text-gray-500 font-mono mt-2">
                    {achievement.code}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                      rarityClasses[achievement.rarity]
                    }`}
                  >
                    {achievement.rarity}
                  </span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      achievement.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {achievement.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 mt-6 text-lg leading-relaxed">
                {achievement.description || "No description provided."}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <DetailRow label="Type" value={achievement.type} />
                <DetailRow label="Target value" value={achievement.target_value} />
                <DetailRow
                  label="Users achieved"
                  value={achievement.user_achievements_count ?? "-"}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Chi tiết phần thưởng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailRow label="XP reward" value={achievement.xp_reward} />
              <DetailRow label="Token reward" value={achievement.token_reward} />
              <DetailRow label="Reward title" value={achievement.reward_title} />
              <DetailRow
                label="Reward trophy"
                value={achievement.reward_trophy}
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800">Conditions</h2>
            <pre className="rounded-xl bg-gray-950 p-4 text-sm text-gray-100 overflow-auto whitespace-pre-wrap break-words">
              {achievement.conditions
                ? JSON.stringify(achievement.conditions, null, 2)
                : "null"}
            </pre>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Metadata
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Hash className="w-4 h-4 text-amber-600" />
                <span className="font-mono">{achievement.code}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Target className="w-4 h-4 text-amber-600" />
                <span>{achievement.type}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>{formatDateTime(achievement.created_at)}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>{formatDateTime(achievement.updated_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
