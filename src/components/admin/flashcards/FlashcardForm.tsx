"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Flashcard,
  FlashcardSet,
  FlashcardSetFormData,
} from "@/types/public/flashcard";
import { Category } from "@/types/admin/admin";
import { getCategories } from "@/api/categories";
import {
  createFlashcardSet,
  updateFlashcardSet,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
} from "@/api/flashcards";
import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelect";
import FormTextarea from "../common/FormTextarea";
import { Plus, Trash2, Save, X, Layers, Info } from "lucide-react";
import { DataLoading } from "@/components/common/LoadingScreen";

interface FlashcardFormProps {
  initialData?: FlashcardSet;
  isEdit?: boolean;
}

export default function FlashcardForm({
  initialData,
  isEdit = false,
}: FlashcardFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<FlashcardSetFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    visibility: initialData?.visibility || "public",
    sourceType: initialData?.sourceType || "manual",
    categoryId: initialData?.category?.id || null,
    examId: initialData?.exam?.id || null,
    status: initialData?.status || "draft",
    cards: initialData?.cards || [{ term: "", definition: "", explanation: "" }],
  });

  const [deletedCardIds, setDeletedCardIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        // If creating new set, initialize category to the first one available
        if (!isEdit && data.length > 0 && !formData.categoryId) {
          setFormData((prev) => ({ ...prev, categoryId: data[0].id }));
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, [isEdit]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (
    index: number,
    field: keyof Flashcard,
    value: string,
  ) => {
    const newCards = [...formData.cards];
    newCards[index] = { ...newCards[index], [field]: value };
    setFormData((prev) => ({ ...prev, cards: newCards }));
  };

  const addCard = () => {
    setFormData((prev) => ({
      ...prev,
      cards: [...prev.cards, { term: "", definition: "", explanation: "" }],
    }));
  };

  const removeCard = (index: number) => {
    const cardToRemove = formData.cards[index];
    if (cardToRemove.id) {
      setDeletedCardIds((prev) => [...prev, cardToRemove.id!]);
    }

    const newCards = formData.cards.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, cards: newCards }));
  };

  const validate = () => {
    if (!formData.title.trim()) {
      alert("Tiêu đề không được để trống");
      return false;
    }
    if (formData.cards.length === 0) {
      alert("Vui lòng thêm ít nhất 1 thẻ flashcard");
      return false;
    }
    for (const card of formData.cards) {
      if (!card.term.trim() || !card.definition.trim()) {
        alert("Mỗi thẻ phải có cả Thuật ngữ và Định nghĩa");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      let setId = initialData?.id;

      // 1. Save Flashcard Set
      const setPayload = {
        title: formData.title,
        description: formData.description,
        visibility: formData.visibility,
        sourceType: formData.sourceType,
        categoryId: formData.categoryId,
        examId: formData.examId,
        status: formData.status,
      };

      console.log("Saving Flashcard Set Payload:", setPayload);

      if (isEdit && setId) {
        await updateFlashcardSet(setId, setPayload);
      } else {
        const response = (await createFlashcardSet(setPayload)) as any;
        // Extract ID (handling potential wrapped response from Laravel)
        setId = response.id || response.data?.id;
      }

      // 2. Handle Flashcards
      if (setId) {
        // Delete removed cards
        if (isEdit) {
          await Promise.all(deletedCardIds.map((id) => deleteFlashcard(id)));
        }

        // Update/Create current cards
        await Promise.all(
          formData.cards.map(async (card) => {
            const cardPayload = {
              term: card.term,
              definition: card.definition,
              explanation: card.explanation,
            };

            try {
              if (card.id) {
                return await updateFlashcard(card.id, cardPayload);
              } else {
                return await createFlashcard(setId!, cardPayload);
              }
            } catch (error: any) {
              console.error(
                "Flashcard Save Error Detail:",
                error.response?.data || error,
              );
              throw error;
            }
          }),
        );
      }

      router.push("/admin/flashcards");
      router.refresh();
    } catch (error) {
      console.error("Failed to save flashcard set:", error);
      alert("An error occurred while saving. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <DataLoading text="Đang tải dữ liệu..." />;

  const sourceTypeOptions = [
    { value: "manual", label: "Thủ công" },
    { value: "ai_generated", label: "Tạo bởi AI" },
    { value: "quiz_wrong_answers", label: "Câu trả lời sai" },
  ];

  const statusOptions = [
    { value: "draft", label: "Nháp" },
    { value: "published", label: "Xuất bản" },
    { value: "archived", label: "Lưu trữ" },
  ];

  return (
    <div className="mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? "Chỉnh sửa bộ thẻ" : "Thêm bộ thẻ mới"}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEdit
              ? "Cập nhật thông tin và nội dung của bộ thẻ flashcards"
              : "Tạo một bộ thẻ flashcards mới để giúp người dùng ôn tập hiệu quả"}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Thoát
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-md"
          >
            {isSaving ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang lưu...
              </span>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Lưu bộ thẻ
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6">
            <div className="flex items-center space-x-2 border-b border-gray-100 pb-4">
              <Layers className="w-5 h-5 text-indigo-500" />
              <h2 className="text-lg font-semibold text-gray-800">
                Thông tin bộ thẻ
              </h2>
            </div>

            <FormInput
              label="Tiêu đề"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., JavaScript Fundamentals"
              required
            />

            <FormTextarea
              label="Mô tả"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what this flashcard set covers..."
              rows={4}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect
                label="Danh mục"
                name="categoryId"
                value={formData.categoryId?.toString() || ""}
                onChange={(e) => {
                  const catId = parseInt(e.target.value);
                  setFormData((prev) => ({
                    ...prev,
                    categoryId: Number.isNaN(catId) ? null : catId,
                  }));
                }}
                options={categories.map((c) => ({
                  value: c.id.toString(),
                  label: c.name,
                }))}
              />
              <FormSelect
                label="Hiển thị"
                name="visibility"
                value={formData.visibility}
                onChange={handleChange}
                options={[
                  { value: "public", label: "Công khai" },
                  { value: "private", label: "Riêng tư" },
                ]}
              />
            </div>
          </div>

          {/* Flashcards List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Info className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Số thẻ ({formData.cards.length})
                </h2>
              </div>
              <button
                type="button"
                onClick={addCard}
                className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm thẻ mới
              </button>
            </div>

            <div className="space-y-4">
              {formData.cards.map((card, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 relative group animate-in fade-in slide-in-from-bottom-2 duration-300"
                >
                  <div className="absolute -left-3 top-6 w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                    {index + 1}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCard(index)}
                    className="absolute right-4 top-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                    <div className="space-y-4">
                      <FormTextarea
                        label="Mặt trước"
                        value={card.term}
                        onChange={(e) =>
                          handleCardChange(index, "term", e.target.value)
                        }
                        placeholder="Câu hỏi hoặc Thuật ngữ..."
                        rows={3}
                        required
                      />
                    </div>
                    <div className="space-y-4">
                      <FormTextarea
                        label="Mặt sau"
                        value={card.definition}
                        onChange={(e) =>
                          handleCardChange(index, "definition", e.target.value)
                        }
                        placeholder="Câu trả lời hoặc Định nghĩa..."
                        rows={3}
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-50">
                    <FormInput
                      label="Ghi chú (tùy chọn)"
                      value={card.explanation || ""}
                      onChange={(e) =>
                        handleCardChange(index, "explanation", e.target.value)
                      }
                      placeholder="Thêm giải thích hoặc ghi chú cho thẻ này..."
                      name={""}
                    />
                  </div>
                </div>
              ))}
            </div>

            {formData.cards.length > 0 && (
              <button
                type="button"
                onClick={addCard}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center group"
              >
                <Plus className="w-6 h-6 mr-2 group-hover:scale-125 transition-transform" />
                <span className="font-medium">Thêm thẻ khác cho bộ này</span>
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6 sticky top-24">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-4">
              Cài đặt nâng cao
            </h3>

            <FormSelect
              label="Nguồn tạo"
              name="sourceType"
              value={formData.sourceType}
              onChange={handleChange}
              options={sourceTypeOptions}
            />

            <FormSelect
              label="Trạng thái"
              name="status"
              value={formData.status || ""}
              onChange={handleChange}
              options={statusOptions}
            />

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold">Mẹo xuất bản</p>
                  <p className="mt-1">
                    Để bộ thẻ của bạn dễ dàng tiếp cận với người dùng, hãy đặt
                    trạng thái là "Xuất bản". Chọn trạng thái phù hợp với mục đích của bạn
                    để tối ưu hóa khả năng tiếp cận và sử dụng bộ thẻ!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
