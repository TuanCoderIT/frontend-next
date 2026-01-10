"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { Chapter } from "@/types/public/course";
import { ChapterPayload } from "@/api/courses";
import FormInput from "../common/FormInput";
import FormTextarea from "../common/FormTextarea";

export interface ChapterFormValues extends ChapterPayload { }

interface ChapterFormProps {
    initialData?: Chapter;
    courseId: number;
    onSubmit: (values: ChapterFormValues) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
    mode?: "create" | "edit";
}

export default function ChapterForm({
    initialData,
    courseId,
    onSubmit,
    onCancel,
    isSubmitting = false,
    mode = "create",
}: ChapterFormProps) {
    const [formValues, setFormValues] = useState<ChapterFormValues>({
        title: initialData?.title ?? "",
        description: initialData?.description ?? "",
        order: initialData?.order ?? 1,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (initialData) {
            setFormValues({
                title: initialData.title,
                description: initialData.description ?? "",
                order: initialData.order,
            });
        }
    }, [initialData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormValues((prev) => ({
            ...prev,
            [name]: name === "order" ? Number(value) : value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrors({});

        if (!formValues.title.trim()) {
            setErrors({ title: "Title is required" });
            return;
        }

        await onSubmit(formValues);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <FormInput
                    label="Chapter Title"
                    name="title"
                    value={formValues.title}
                    onChange={handleChange}
                    placeholder="Introduction to React"
                    required
                    error={errors.title}
                />
            </div>

            <div className="space-y-2">
                <FormTextarea
                    label="Description"
                    name="description"
                    value={formValues.description ?? ""}
                    onChange={handleChange}
                    placeholder="Brief overview of what this chapter covers..."
                    rows={4}
                />
            </div>

            <div className="space-y-2">
                <FormInput
                    label="Order"
                    name="order"
                    type="number"
                    value={formValues.order.toString()}
                    onChange={handleChange}
                    placeholder="1"
                    required
                    error={errors.order}
                />
                <p className="text-xs text-gray-500">
                    The position of this chapter in the course (lower numbers appear first)
                </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t">
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
                    {mode === "create" ? "Create Chapter" : "Save Changes"}
                </button>
            </div>
        </form>
    );
}

