"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Course } from "@/types/public/course";
import { CoursePayload } from "@/api/courses";
import { ImageIcon, Loader2 } from "lucide-react";
import FormSelect from "../common/FormSelect";
import { getCategories } from "@/api/quiz";
import { Category } from "@/types/public/category";
import FormInput from "../common/FormInput";

export interface CourseFormValues extends CoursePayload { }

interface CourseFormProps {
    initialData?: Course;
    onSubmit: (values: CourseFormValues) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
    mode?: "create" | "edit";
}

export default function CourseForm({
    initialData,
    onSubmit,
    onCancel,
    isSubmitting = false,
    mode = "create",
}: CourseFormProps) {
    const [formValues, setFormValues] = useState<CourseFormValues>({
        title: initialData?.title ?? "",
        description: initialData?.description ?? "",
        category_id: initialData?.category_id ?? null,
        is_public: initialData?.is_public ?? true,
        price_token: initialData?.price_token ?? 0,
        thumbnail: initialData?.thumbnail ?? null,
    });

    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
        initialData?.thumbnail ?? null
    );

    const [categories, setCategories] = useState<Category[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.warn("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (!initialData) return;
        setFormValues({
            title: initialData.title,
            description: initialData.description ?? "",
            category_id: initialData.category_id ?? null,
            is_public: initialData.is_public,
            price_token: initialData.price_token ?? 0,
            thumbnail: initialData.thumbnail ?? null,
        });
        setThumbnailPreview(initialData.thumbnail ?? null);
    }, [initialData]);

    useEffect(() => {
        return () => {
            if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
                URL.revokeObjectURL(thumbnailPreview);
            }
        };
    }, [thumbnailPreview]);

    const handleChange = (
        e:
            | React.ChangeEvent<HTMLInputElement>
            | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            setFormValues((prev) => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked,
            }));
            return;
        }

        setFormValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        setFormValues((prev) => ({
            ...prev,
            category_id: selectedId ? Number(selectedId) : null,
        }));
    };

    const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        setFormValues(prev => ({
            ...prev,
            thumbnail: file ? file : null,
        }));
        if (file) {
            const preview = URL.createObjectURL(file);
            setThumbnailPreview(preview);
        } else {
            setThumbnailPreview(initialData?.thumbnail ?? null);
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        console.log("FINAL PAYLOAD:", formValues);
        event.preventDefault();
        await onSubmit(formValues);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        Course title <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="title"
                        value={formValues.title}
                        onChange={handleChange}
                        placeholder="Introduction to modern web development"
                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        required
                    />
                </div>

                <FormSelect
                    label="Category"
                    name="category_id"
                    value={formValues.category_id?.toString() || ""}
                    onChange={handleCategoryChange}
                    error={errors.category_id}
                    options={[
                        { label: "No category", value: "" },
                        ...categories.map((cat) => ({
                            label: cat.name,
                            value: String(cat.id),
                        })),
                    ]}
                />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                    Description
                </label>
                <textarea
                    name="description"
                    value={formValues.description ?? ""}
                    onChange={handleChange}
                    placeholder="Describe what learners will achieve after completing this course..."
                    rows={4}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                        Thumbnail
                    </label>
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50/60 p-6 text-center">
                        {thumbnailPreview ? (
                            <div className="relative h-36 w-full overflow-hidden rounded-lg border border-gray-200">
                                <Image
                                    src={thumbnailPreview}
                                    alt="Course thumbnail preview"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center space-y-2 text-gray-500">
                                <ImageIcon className="h-10 w-10" />
                                <p className="text-sm">
                                    Upload a course cover image (optional)
                                </p>
                            </div>
                        )}
                        <label className="mt-4 inline-flex cursor-pointer items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm ring-1 ring-blue-200 hover:bg-blue-50">
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleThumbnailChange}
                            />
                            Browse files
                        </label>
                    </div>
                </div>

                <div className="space-y-4">
                    <FormInput
                        label="Price (Tokens)"
                        name="price_token"
                        type="number"
                        value={formValues.price_token?.toString() ?? ""}
                        onChange={(e) =>
                            setFormValues((prev) => ({
                                ...prev,
                                price_token: e.target.value === "" ? 0 : Number(e.target.value),
                            }))
                        }
                        error={errors.price_token}
                    />
                    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                Make course public
                            </p>
                            <p className="text-xs text-gray-500">
                                Public courses are visible to everyone on the marketplace.
                            </p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                            <input
                                type="checkbox"
                                name="is_public"
                                checked={formValues.is_public}
                                onChange={handleChange}
                                className="peer sr-only"
                            />
                            <div className="peer h-6 w-10 rounded-full bg-gray-200 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:translate-x-0 after:rounded-full after:bg-white after:transition-all peer-checked:bg-blue-500 peer-checked:after:translate-x-4"></div>
                        </label>
                    </div>

                    {initialData && (
                        <div className="rounded-xl border border-gray-200 bg-white p-4">
                            <p className="text-xs uppercase tracking-wide text-gray-400">
                                Metadata
                            </p>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                                <p>
                                    Created:{" "}
                                    {new Date(initialData.created_at).toLocaleDateString()}
                                </p>
                                <p>
                                    Updated:{" "}
                                    {new Date(initialData.updated_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                >
                    {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    {mode === "create" ? "Create Course" : "Save Changes"}
                </button>
            </div>
        </form>
    );
}

