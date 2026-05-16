"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Flashcard, 
  FlashcardSet, 
  FlashcardSetFormData, 
  FlashcardSourceType, 
  FlashcardSetStatus 
} from "@/types/flashcard";
import { Category } from "@/types/admin/admin";
import { getCategories } from "@/api/categories";
import { 
  createFlashcardSet, 
  updateFlashcardSet, 
  createFlashcard, 
  updateFlashcard, 
  deleteFlashcard 
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

export default function FlashcardForm({ initialData, isEdit = false }: FlashcardFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(isEdit);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState<FlashcardSetFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    source_type: initialData?.source_type || "manual",
    quiz_id: initialData?.exam_id || null,
    category: initialData?.category || { id: 0, name: "" },
    color: initialData?.color || "#3b82f6",
    status: initialData?.status || "draft",
    flashcards: initialData?.flashcards || [{ front_text: "", back_text: "", explanation: "" }],
  });

  const [deletedCardIds, setDeletedCardIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        // If creating new set, initialize category to the first one available
        if (!isEdit && data.length > 0 && formData.category.id === 0) {
          setFormData(prev => ({ ...prev, category: data[0] }));
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, [isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (index: number, field: keyof Flashcard, value: string) => {
    const newCards = [...formData.flashcards];
    newCards[index] = { ...newCards[index], [field]: value };
    setFormData((prev) => ({ ...prev, flashcards: newCards }));
  };

  const addCard = () => {
    setFormData((prev) => ({
      ...prev,
      flashcards: [...prev.flashcards, { front_text: "", back_text: "", explanation: "" }],
    }));
  };

  const removeCard = (index: number) => {
    const cardToRemove = formData.flashcards[index];
    if (cardToRemove.id) {
      setDeletedCardIds((prev) => [...prev, cardToRemove.id!]);
    }
    
    const newCards = formData.flashcards.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, flashcards: newCards }));
  };

  const validate = () => {
    if (!formData.title.trim()) {
      alert("Title is required");
      return false;
    }
    if (formData.flashcards.length === 0) {
      alert("At least one flashcard is required");
      return false;
    }
    for (const card of formData.flashcards) {
      if (!card.front_text.trim() || !card.back_text.trim()) {
        alert("Each card must have front and back text");
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
        source_type: formData.source_type,
        category_id: formData.category?.id && Number(formData.category.id) > 0 ? formData.category.id : null,
        exam_id: formData.quiz_id,
        color: formData.color,
        status: formData.status,
      };

      console.log("Saving Flashcard Set Payload:", setPayload);

      if (isEdit && setId) {
        await updateFlashcardSet(setId, setPayload);
      } else {
        const response = await createFlashcardSet(setPayload) as any;
        // Extract ID (handling potential wrapped response from Laravel)
        setId = response.id || response.data?.id;
      }

      // 2. Handle Flashcards
      if (setId) {
        // Delete removed cards
        if (isEdit) {
          await Promise.all(deletedCardIds.map(id => deleteFlashcard(id)));
        }

        // Update/Create current cards
        await Promise.all(formData.flashcards.map(async (card) => {
          const cardPayload = {
            front_text: card.front_text,
            back_text: card.back_text,
            explanation: card.explanation,
            flashcard_set_id: setId, // Explicitly include set ID
          };

          try {
            if (card.id) {
              return await updateFlashcard(card.id, cardPayload);
            } else {
              return await createFlashcard(setId!, cardPayload);
            }
          } catch (error: any) {
            console.error("Flashcard Save Error Detail:", error.response?.data || error);
            throw error;
          }
        }));
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

  if (isLoading) return <DataLoading text="Loading form data..." />;

  const sourceTypeOptions = [
    { value: "manual", label: "Manual" },
    { value: "ai_generated", label: "AI Generated" },
    { value: "quiz_wrong_answers", label: "Quiz Wrong Answers" },
  ];

  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending" },
    { value: "published", label: "Published" },
    { value: "rejected", label: "Rejected" },
    { value: "archived", label: "Archived" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? "Edit Flashcard Set" : "Create New Flashcard Set"}
          </h1>
          <p className="text-gray-500 mt-1">
            {isEdit ? "Update your flashcard set details and cards" : "Define a new set of flashcards for learning"}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-md"
          >
            {isSaving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Set
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
              <h2 className="text-lg font-semibold text-gray-800">General Information</h2>
            </div>
            
            <FormInput
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., JavaScript Fundamentals"
              required
            />
            
            <FormTextarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what this flashcard set covers..."
              rows={4}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormSelect
                label="Category"
                name="category_id"
                value={formData.category?.id?.toString() || ""}
                onChange={(e) => {
                  const catId = parseInt(e.target.value);
                  const selectedCat = categories.find(c => c.id === catId);
                  if (selectedCat) {
                    setFormData(prev => ({ ...prev, category: selectedCat }));
                  }
                }}
                options={categories.map(c => ({ value: c.id.toString(), label: c.name }))}
              />
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Set Color</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="h-10 w-20 p-1 rounded-lg border border-gray-300 cursor-pointer"
                  />
                  <span className="text-sm text-gray-500 uppercase font-mono">{formData.color}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Flashcards List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Info className="w-5 h-5 text-indigo-500" />
                <h2 className="text-lg font-semibold text-gray-800">Flashcards ({formData.flashcards.length})</h2>
              </div>
              <button
                type="button"
                onClick={addCard}
                className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg hover:bg-indigo-100 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Card
              </button>
            </div>

            <div className="space-y-4">
              {formData.flashcards.map((card, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 relative group animate-in fade-in slide-in-from-bottom-2 duration-300">
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
                        label="Front Side"
                        value={card.front_text}
                        onChange={(e) => handleCardChange(index, "front_text", e.target.value)}
                        placeholder="Question or Term..."
                        rows={3}
                        required
                      />
                    </div>
                    <div className="space-y-4">
                      <FormTextarea
                        label="Back Side"
                        value={card.back_text}
                        onChange={(e) => handleCardChange(index, "back_text", e.target.value)}
                        placeholder="Answer or Definition..."
                        rows={3}
                        required
                      />
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-50">
                    <FormInput
                      label="Explanation (Optional)"
                      value={card.explanation || ""}
                      onChange={(e) => handleCardChange(index, "explanation", e.target.value)}
                      placeholder="Additional context or memory tip..." name={""}                    />
                  </div>
                </div>
              ))}
            </div>

            {formData.flashcards.length > 0 && (
              <button
                type="button"
                onClick={addCard}
                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center group"
              >
                <Plus className="w-6 h-6 mr-2 group-hover:scale-125 transition-transform" />
                <span className="font-medium">Add another flashcard</span>
              </button>
            )}
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 space-y-6 sticky top-24">
            <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-4">Settings</h3>
            
            <FormSelect
              label="Source Type"
              name="source_type"
              value={formData.source_type}
              onChange={handleChange}
              options={sourceTypeOptions}
            />

            <FormSelect
              label="Status"
              name="status"
              value={formData.status || ""}
              onChange={handleChange}
              options={statusOptions}
            />

            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold">Publication Tip</p>
                  <p className="mt-1">Sets set to "Published" will be immediately visible to users after approval.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
