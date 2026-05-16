import React, { useEffect, useState } from "react";
import { BookCheck, CircleX, Loader } from "lucide-react";
import FormInput from "../common/FormInput";
import FormTextarea from "../common/FormTextarea";
import FormSelect from "../common/FormSelect";
import { getCategories } from "@/api/quiz";
import TagInput from "../common/TagInput";
import { useRouter } from "next/navigation";
import { Category } from "@/types/public/category";

interface QuizFormData {
  title: string;
  description: string;
  category: Category; 
  difficulty: "Cơ bản" | "Trung bình" | "Nâng cao" | "";
  duration: number;
  status: "Nháp" | "Công khai" | "Lưu trữ" | "";
  passingScore: number;
  maxAttempts: number;
  learning_objectives: string[];
  prerequisites: string[];
  tags: string[];
  color: string;
  price_token: number;
}

interface QuizFormProps {
  mode?: "add" | "edit";
  initialData?: Partial<QuizFormData>;
  onSubmit?: (data: QuizFormData) => void;
  errors: any;
}

export default function QuizForm({
  mode,
  initialData,
  onSubmit,
}: QuizFormProps) {
  const [formData, setFormData] = useState<QuizFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || { id: 0, name: "" },
    difficulty: initialData?.difficulty || "",
    duration: initialData?.duration || 30,
    status: initialData?.status || "Nháp",
    passingScore: initialData?.passingScore || 70,
    maxAttempts: initialData?.maxAttempts || 3,
    learning_objectives: initialData?.learning_objectives || [],
    prerequisites: initialData?.prerequisites || [],
    tags: initialData?.tags || [],
    color: initialData?.color || "#3B82F6",
    price_token: initialData?.price_token || 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  const handleInputChange = (field: keyof QuizFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      console.log("Test data form: ", formData);
      await onSubmit?.(formData);
      router.push("/admin/quizzes");
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-8">
          {errors.form && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
              <CircleX className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">An Error occurs</p>
                <p className="text-red-600">{errors.form}</p>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Title */}
              <FormInput
                label="Quiz Title"
                name="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                required
                placeholder="Enter quiz title"
                error={errors.title}
                icon={<BookCheck className="h-5 w-5" />}
              />

              {/* Description */}
              <FormTextarea
                label="Description"
                name="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Enter quiz description"
                error={errors.description}
              />

              {/* Category & Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormSelect
                  label="Category"
                  name="category"
                  value={formData.category?.id?.toString() || ""}
                  onChange={(e) => {
                    const selectedId = Number(e.target.value);
                    const selectedCategory = categories.find(
                      (cat) => Number(cat.id) === selectedId
                    );
                    handleInputChange("category", selectedCategory || null);
                  }}
                  error={errors.category}
                  required
                  options={categories.map((cat) => ({
                    label: cat.name,
                    value: cat.id,
                  }))}
                />
                <FormSelect
                  label="Difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={(e) =>
                    handleInputChange("difficulty", e.target.value)
                  }
                  error={errors.difficulty}
                  required
                  options={[
                    { label: "Cơ bản", value: "Cơ bản" },
                    { label: "Intermediate", value: "Intermediate" },
                    { label: "Advanced", value: "Advanced" },
                  ]}
                />
              </div>

              {/* Duration & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Duration (minutes)"
                  name="duration"
                  type="number"
                  value={formData.duration.toString()}
                  onChange={(e) =>
                    handleInputChange(
                      "duration",
                      parseInt(e.target.value) || 30
                    )
                  }
                  error={errors.duration}
                  required
                  placeholder="30"
                />
                <FormSelect
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  error={errors.status}
                  required
                  options={[
                    { label: "Draft", value: "Draft" },
                    { label: "Published", value: "Published" },
                    { label: "Archived", value: "Archived" },
                  ]}
                />
              </div>

              {/* Passing Score & Max Attempts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Passing Score (%)"
                  name="passingScore"
                  type="number"
                  value={formData.passingScore.toString()}
                  onChange={(e) =>
                    handleInputChange(
                      "passingScore",
                      parseInt(e.target.value) || 70
                    )
                  }
                  error={errors.passingScore}
                  required
                  placeholder="70"
                />
                <FormInput
                  label="Max Attempts"
                  name="maxAttempts"
                  type="number"
                  value={formData.maxAttempts.toString()}
                  onChange={(e) =>
                    handleInputChange(
                      "maxAttempts",
                      parseInt(e.target.value) || 3
                    )
                  }
                  error={errors.maxAttempts}
                  required
                  placeholder="3"
                />
              </div>

              {/* Color */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quiz Color (Optional)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => handleInputChange("color", e.target.value)}
                      className="w-10 h-10 border shadow-md border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => handleInputChange("color", e.target.value)}
                      className="flex-1 px-4 py-2 shadow-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>
                <FormInput
                  label="Price (Tokens)"
                  name="price_token"
                  type="number"
                  value={formData.price_token?.toString() ?? ""}
                  onChange={(e) =>
                    handleInputChange(
                      "price_token",
                      e.target.value === "" ? 0 : Number(e.target.value)
                    )
                  }
                  error={errors.price_token}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Learning Objectives */}
              <TagInput
                label="Learning Objectives"
                items={formData.learning_objectives}
                onItemsChange={(items) =>
                  handleInputChange("learning_objectives", items)
                }
                placeholder="Add a learning objective"
                maxItems={10}
                required={false}
              />
              {/* Prerequisites */}
              <TagInput
                label="Prerequisites"
                items={formData.prerequisites}
                onItemsChange={(items) =>
                  handleInputChange("prerequisites", items)
                }
                placeholder="Add a prerequisite"
                maxItems={10}
                required={false}
              />
              {/* Tags */}
              <TagInput
                label="Tags"
                items={formData.tags}
                onItemsChange={(items) => handleInputChange("tags", items)}
                placeholder="Add a tag"
                maxItems={10}
                required={false}
              />
              {/* Preview Card */}
              <div
                className="bg-gray-50 rounded-lg p-6 border-l-4"
                style={{ borderLeftColor: formData.color }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Quiz Preview
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Title:</span>{" "}
                    {formData.title || "Quiz Title"}
                  </p>
                  <p>
                    <span className="font-medium">Category:</span>{" "}
                    {formData.category.name || "Category Name"}
                  </p>
                  <p>
                    <span className="font-medium">Difficulty:</span>{" "}
                    {formData.difficulty || "Difficulty"}
                  </p>
                  <p>
                    <span className="font-medium">Duration:</span>{" "}
                    {formData.duration} minutes
                  </p>
                  <p>
                    <span className="font-medium">Passing Score:</span>{" "}
                    {formData.passingScore}%
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs ${formData.status === "Công khai"
                        ? "bg-green-100 text-green-800"
                        : formData.status === "Nháp"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {formData.status || "Draft"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`px-5 py-2.5 cursor-pointer text-sm bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${isSubmitting
                ? "opacity-70 cursor-not-allowed"
                : "transform transition hover:-translate-y-1"
                }`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <Loader className="animate-spin ml-1 mr-2 h-4 w-4 text-white" />
                  Saving...
                </div>
              ) : mode === "edit" ? (
                "Cập nhật bài thi"
              ) : (
                "Lưu bài thi"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
