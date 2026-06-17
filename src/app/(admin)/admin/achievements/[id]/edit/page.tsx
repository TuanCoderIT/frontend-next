"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { getAchievementById } from "@/api/achievements";
import AchievementForm from "@/components/admin/achievements/AchievementForm";
import { DataLoading } from "@/components/common/LoadingScreen";
import { Achievement } from "@/types/admin/achievement";

export default function EditAchievementPage() {
  const { id } = useParams();
  const [achievement, setAchievement] = useState<Achievement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAchievement = async () => {
      try {
        setIsLoading(true);
        setError("");
        const data = await getAchievementById(Number(id));
        setAchievement(data);
      } catch (err) {
        console.error("Failed to fetch achievement:", err);
        setError("Không thể tải danh hiệu.");
        toast.error("Không thể tải danh hiệu.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchAchievement();
  }, [id]);

  if (isLoading) return <DataLoading text="Đang tải dữ liệu danh hiệu..." />;

  if (error || !achievement) {
    return (
      <div className="text-center py-20 text-gray-500">
        {error || "Achievement not found."}
      </div>
    );
  }

  return <AchievementForm initialData={achievement} isEdit />;
}
