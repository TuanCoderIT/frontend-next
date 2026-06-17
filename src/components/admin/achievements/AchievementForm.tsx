"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { Award, CheckCircle2, Gift, Info, Save, X } from "lucide-react";
import { toast } from "react-hot-toast";
import {
  createAchievement,
  updateAchievement,
} from "@/api/achievements";
import FormInput from "@/components/admin/common/FormInput";
import FormSelect from "@/components/admin/common/FormSelect";
import FormTextarea from "@/components/admin/common/FormTextarea";
import {
  Achievement,
  AchievementFormData,
  AchievementPayload,
  AchievementRarity,
  AchievementType,
} from "@/types/admin/achievement";

interface AchievementFormProps {
  initialData?: Achievement;
  isEdit?: boolean;
}

type FormErrors = Partial<Record<keyof AchievementFormData, string>>;

const typeOptions: { value: AchievementType; label: string }[] = [
  { value: "general", label: "General" },
  { value: "quiz", label: "Quiz" },
  { value: "flashcard", label: "Flashcard" },
  { value: "streak", label: "Streak" },
  { value: "xp", label: "XP" },
  { value: "creator", label: "Creator" },
  { value: "community", label: "Community" },
  { value: "leaderboard", label: "Leaderboard" },
];

const rarityOptions: { value: AchievementRarity; label: string }[] = [
  { value: "common", label: "Common" },
  { value: "rare", label: "Rare" },
  { value: "epic", label: "Epic" },
  { value: "legendary", label: "Legendary" },
];

const stringifyConditions = (
  conditions?: Record<string, unknown> | null,
) => {
  if (!conditions) return "";
  return JSON.stringify(conditions, null, 2);
};

const getInitialFormData = (
  initialData?: Achievement,
): AchievementFormData => ({
  code: initialData?.code || "",
  name: initialData?.name || "",
  description: initialData?.description || "",
  icon: initialData?.icon || "",
  type: initialData?.type || "general",
  rarity: initialData?.rarity || "common",
  target_value: initialData?.target_value || 1,
  xp_reward: initialData?.xp_reward || 0,
  token_reward: initialData?.token_reward || 0,
  reward_title: initialData?.reward_title || "",
  reward_trophy: initialData?.reward_trophy || "",
  conditions: stringifyConditions(initialData?.conditions),
  is_active: initialData?.is_active ?? true,
});

const getBackendMessage = (error: unknown) => {
  const axiosError = error as AxiosError<{ message?: string }>;
  return axiosError.response?.data?.message || "Lưu danh hiệu thất bại.";
};

export default function AchievementForm({
  initialData,
  isEdit = false,
}: AchievementFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<AchievementFormData>(() =>
    getInitialFormData(initialData),
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  const previewConditions = useMemo(() => {
    if (!formData.conditions.trim()) return "null";
    return formData.conditions;
  }, [formData.conditions]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    const numberFields = ["target_value", "xp_reward", "token_reward"];

    setFormData((prev) => ({
      ...prev,
      [name]: numberFields.includes(name) ? Number(value) : value,
    }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};
    let parsedConditions: Record<string, unknown> | null = null;

    if (!formData.code.trim()) nextErrors.code = "Code bắt buộc.";
    if (!formData.name.trim()) nextErrors.name = "Tên bắt buộc.";
    if (!formData.type) nextErrors.type = "Type bắt buộc.";
    if (!formData.rarity) nextErrors.rarity = "Rarity bắt buộc.";
    if (formData.target_value < 1) {
      nextErrors.target_value = "Target value phải lớn hơn hoặc bằng 1.";
    }
    if (formData.xp_reward < 0) {
      nextErrors.xp_reward = "XP reward phải lớn hơn hoặc bằng 0.";
    }
    if (formData.token_reward < 0) {
      nextErrors.token_reward = "Token reward phải lớn hơn hoặc bằng 0.";
    }

    if (formData.conditions.trim()) {
      try {
        const parsed = JSON.parse(formData.conditions);
        if (
          parsed === null ||
          Array.isArray(parsed) ||
          typeof parsed !== "object"
        ) {
          nextErrors.conditions = "Conditions phải là JSON object hợp lệ.";
        } else {
          parsedConditions = parsed;
        }
      } catch {
        nextErrors.conditions = "Conditions phải là JSON hợp lệ.";
      }
    }

    setErrors(nextErrors);
    return {
      isValid: Object.keys(nextErrors).length === 0,
      parsedConditions,
    };
  };

  const buildPayload = (
    conditions: Record<string, unknown> | null,
  ): AchievementPayload => ({
    code: formData.code.trim(),
    name: formData.name.trim(),
    description: formData.description.trim() || null,
    icon: formData.icon.trim() || null,
    type: formData.type,
    rarity: formData.rarity,
    target_value: Number(formData.target_value),
    xp_reward: Number(formData.xp_reward),
    token_reward: Number(formData.token_reward),
    reward_title: formData.reward_title.trim() || null,
    reward_trophy: formData.reward_trophy.trim() || null,
    conditions,
    is_active: formData.is_active,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, parsedConditions } = validate();
    if (!isValid) return;

    setIsSaving(true);
    try {
      const payload = buildPayload(parsedConditions);
      if (isEdit && initialData) {
        await updateAchievement(initialData.id, payload);
        toast.success("Đã cập nhật danh hiệu.");
      } else {
        await createAchievement(payload);
        toast.success("Đã tạo danh hiệu.");
      }
      router.push("/admin/achievements");
      router.refresh();
    } catch (error) {
      console.error("Failed to save achievement:", error);
      toast.error(getBackendMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? "Chỉnh sửa danh hiệu" : "Thêm danh hiệu mới"}
          </h1>
          <p className="text-gray-500 mt-1">
            Cấu hình điều kiện, phần thưởng và trạng thái hiển thị cho badge.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Thoát
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-6 py-2 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-all disabled:opacity-50 shadow-md"
          >
            <Save className="w-5 h-5 mr-2" />
            {isSaving ? "Đang lưu..." : "Lưu danh hiệu"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
              <Award className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Thông tin cơ bản
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="quiz_master"
                error={errors.code}
                required
              />
              <FormInput
                label="Tên danh hiệu"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Quiz Master"
                error={errors.name}
                required
              />
            </div>

            <FormTextarea
              label="Mô tả"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Mô tả điều người dùng cần đạt..."
              rows={4}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                label="Icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                placeholder="🏆 hoặc trophy"
              />
              <FormSelect
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                options={typeOptions}
                error={errors.type}
                required
              />
              <FormSelect
                label="Rarity"
                name="rarity"
                value={formData.rarity}
                onChange={handleChange}
                options={rarityOptions}
                error={errors.rarity}
                required
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-4">
              <Gift className="w-5 h-5 text-rose-600" />
              <h2 className="text-lg font-semibold text-gray-800">
                Điều kiện và phần thưởng
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                label="Target value"
                name="target_value"
                type="number"
                value={String(formData.target_value)}
                onChange={handleChange}
                error={errors.target_value}
                required
              />
              <FormInput
                label="XP reward"
                name="xp_reward"
                type="number"
                value={String(formData.xp_reward)}
                onChange={handleChange}
                error={errors.xp_reward}
                required
              />
              <FormInput
                label="Token reward"
                name="token_reward"
                type="number"
                value={String(formData.token_reward)}
                onChange={handleChange}
                error={errors.token_reward}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                label="Reward title"
                name="reward_title"
                value={formData.reward_title}
                onChange={handleChange}
                placeholder="Master Learner"
              />
              <FormInput
                label="Reward trophy"
                name="reward_trophy"
                value={formData.reward_trophy}
                onChange={handleChange}
                placeholder="gold_trophy"
              />
            </div>

            {/* <FormTextarea
              label="Conditions JSON"
              name="conditions"
              value={formData.conditions}
              onChange={handleChange}
              placeholder={'{\n  "quiz_count": 10\n}'}
              rows={8}
              error={errors.conditions}
              className="font-mono"
            /> */}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6 sticky top-24">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-4">
              Trạng thái
            </h3>

            <label className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 cursor-pointer">
              <span>
                <span className="block text-sm font-semibold text-gray-800">
                  Active
                </span>
                <span className="block text-xs text-gray-500 mt-1">
                  Cho phép người dùng đạt danh hiệu này.
                </span>
              </span>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    is_active: e.target.checked,
                  }))
                }
                className="h-5 w-5 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              />
            </label>

            {/* <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold">Conditions payload</p>
                  <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-words text-xs">
                    {previewConditions}
                  </pre>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              JSON trống sẽ được gửi là null.
            </div> */}
          </div>
        </div>
      </div>
    </form>
  );
}
