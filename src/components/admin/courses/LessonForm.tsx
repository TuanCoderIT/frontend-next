"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Lesson } from "@/types/public/course";
import { LessonPayload } from "@/api/courses";
import FormInput from "../common/FormInput";
import FormTextarea from "../common/FormTextarea";
import FormSelect from "../common/FormSelect";

export interface LessonFormValues extends LessonPayload { }

interface LessonFormProps {
    initialData?: Lesson;
    chapterId: number;
    onSubmit: (values: LessonFormValues) => Promise<void>;
    onCancel: () => void;
    isSubmitting?: boolean;
    mode?: "create" | "edit";
    lessonType?: "video" | "text";
    videoUrl?: string | null;
}

export default function LessonForm({
    initialData,
    chapterId,
    onSubmit,
    onCancel,
    isSubmitting = false,
    mode = "create",
    lessonType = "video",
    videoUrl = null,
}: LessonFormProps) {
    const [formValues, setFormValues] = useState<LessonFormValues>({
        title: initialData?.title ?? "",
        content: initialData?.content ?? "",
        order: initialData?.order ?? 1,
        is_free_preview: initialData?.is_free_preview ?? false,
        type: initialData?.type ?? "video",
        video_url: initialData?.video_url ?? null,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (initialData) {
            setFormValues({
                title: initialData.title,
                content: initialData.content ?? "",
                order: initialData.order,
                is_free_preview: initialData.is_free_preview,
                type: initialData.type,
                video_url: initialData.video_url,
            });
        }
    }, [initialData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
                    label="Lesson Title"
                    name="title"
                    value={formValues.title}
                    onChange={handleChange}
                    placeholder="Getting Started with Components"
                    required
                    error={errors.title}
                />
            </div>
            <div className="space-y-2">
                <FormSelect
                    label="Lesson Type"
                    name="type"
                    value={formValues.type}
                    onChange={handleChange}
                    options={[{ label: "Video", value: "video" }, { label: "Text", value: "text" }]}
                />
            </div>
            {formValues.type === "video" && (
                <div className="space-y-2">
                    <FormInput
                        label="Video URL"
                        name="video_url"
                        value={formValues.video_url ?? ""}
                        onChange={handleChange}
                        placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        required
                        error={errors.video_url}
                    />
                </div>
            )}
            <div className="space-y-2">
                <FormTextarea
                    label="Content"
                    name="content"
                    value={formValues.content ?? ""}
                    onChange={handleChange}
                    placeholder="Lesson content, instructions, or notes..."
                    rows={6}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4">
                <div>
                    <p className="text-sm font-medium text-gray-900">
                        Free Preview
                    </p>
                    <p className="text-xs text-gray-500">
                        Allow users to view this lesson without purchasing the course
                    </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                    <input
                        type="checkbox"
                        name="is_free_preview"
                        checked={formValues.is_free_preview}
                        onChange={handleChange}
                        className="peer sr-only"
                    />
                    <div className="peer h-6 w-10 rounded-full bg-gray-200 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:translate-x-0 after:rounded-full after:bg-white after:transition-all peer-checked:bg-blue-500 peer-checked:after:translate-x-4"></div>
                </label>
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
                    {mode === "create" ? "Create Lesson" : "Save Changes"}
                </button>
            </div>
        </form>
    );
}

