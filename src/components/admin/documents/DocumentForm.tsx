"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DocumentFormData } from "@/types/admin/document";
import { createDocument, updateDocument } from "@/api/documents";
import FormInput from "@/components/admin/common/FormInput";
import FormTextarea from "@/components/admin/common/FormTextarea";
import BackButton from "@/components/admin/common/BackButton";
import { FileText, Upload, Crown, DollarSign, Image as ImageIcon, X } from "lucide-react";
import { getCategories } from "@/api/quiz";
import { Category } from "@/types/public/category";
import { toast } from "react-hot-toast";
import FormSelect from "../common/FormSelect";

interface DocumentFormProps {
    mode: "create" | "edit";
    initialData?: Partial<DocumentFormData>;
    onSubmit?: (data: DocumentFormData) => void;
    errors: any;
}

export default function DocumentForm({ mode, initialData, onSubmit }: DocumentFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [categories, setCategories] = useState<Category[]>([]);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);

    const [formData, setFormData] = useState<DocumentFormData>({
        title: initialData?.title || "",
        category_id: initialData?.category_id || 0,
        description: initialData?.description || "",
        is_premium: initialData?.is_premium || false,
        price_token: initialData?.price_token || 0,
        status: initialData?.status || "draft",
        file: null,
        thumbnail: null,
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
                toast.error("Failed to load categories");
            }
        };

        fetchCategories();
    }, []);

    // Set thumbnail preview from initial data
    useEffect(() => {
        if (initialData && mode === "edit" && (initialData as any).thumbnail) {
            setThumbnailPreview((initialData as any).thumbnail);
        }
    }, [initialData, mode]);

    // Update formData when initialData changes (for edit mode)
    useEffect(() => {
        if (initialData && mode === "edit") {
            setFormData({
                title: initialData.title || "",
                category_id: initialData.category_id || 0,
                description: initialData.description || "",
                is_premium: initialData.is_premium || false,
                price_token: initialData.price_token || 0,
                status: initialData.status || "draft",
                file: null,
                thumbnail: null,
            });
        }
    }, [initialData, mode]);

    const handleInputChange = (field: keyof DocumentFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setFormData(prev => ({ ...prev, file }));
            setFilePreview(file.name);
        }
        if (errors.file) {
            setErrors(prev => ({ ...prev, file: "" }));
        }
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setFormData(prev => ({ ...prev, thumbnail: file }));
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setThumbnailPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
        if (errors.thumbnail) {
            setErrors(prev => ({ ...prev, thumbnail: "" }));
        }
    };

    const handleRemoveThumbnail = () => {
        setFormData(prev => ({ ...prev, thumbnail: null }));
        setThumbnailPreview(null);
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (formData.is_premium && formData.price_token <= 0) {
            newErrors.price_tokens = "Price must be greater than 0 for premium documents";
        }

        if (mode === "create" && !formData.file) {
            newErrors.file = "File is required";
        }

        if (!formData.category_id || formData.category_id === 0) {
            newErrors.category_id = "Category is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            await onSubmit?.(formData);
            toast.success(mode === "create" ? "Document created successfully" : "Document updated successfully");
            router.push("/admin/documents");
        } catch (error: any) {
            if (error.response?.status === 422) {
                const validationErrors = error.response.data.errors || {};
                const formattedErrors: Record<string, string> = {};
                Object.keys(validationErrors).forEach(key => {
                    formattedErrors[key] = Array.isArray(validationErrors[key])
                        ? validationErrors[key][0]
                        : validationErrors[key];
                });
                setErrors(formattedErrors);
                toast.error("Validation failed. Please check your input.");
            } else {
                console.error("Unexpected error:", error);
                toast.error(error.response?.data?.message || "Failed to save document");
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm">
            {/* Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                        <FormInput
                            name="title"
                            label="Document Title"
                            value={formData.title}
                            onChange={(e) => handleInputChange("title", e.target.value)}
                            placeholder="Enter document title"
                            error={errors.title}
                            required
                        />
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category_id"
                                value={formData.category_id.toString()}
                                onChange={(e) => handleInputChange("category_id", parseInt(e.target.value) || 0)}
                                className={`block w-full rounded-lg shadow-sm border ${errors.category_id ? "border-red-300" : "border-gray-300"
                                    } bg-white py-2.5 px-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                            >
                                <option value="0">Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id.toString()}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category_id && (
                                <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
                            )}
                        </div>
                        {/* <FormSelect
                            label="Category"
                            name="category_id"
                            value={formData.category_id.toString()}
                            onChange={(e) => handleInputChange("category_id", parseInt(e.target.value) || 0)}
                            error={errors.category}
                            required
                            options={categories.map((cat) => ({
                                label: cat.name,
                                value: cat.id.toString(),
                            }))}
                        /> */}
                        <FormTextarea
                            label="Description"
                            value={formData.description || ""}
                            onChange={(e) => handleInputChange("description", e.target.value)}
                            placeholder="Enter document description (optional)"
                            rows={3}
                            error={errors.description}
                        />
                    </div>
                    {/* Document Settings */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">Document Settings</h2>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={(e) => handleInputChange("status", e.target.value as "draft" | "published" | "archived")}
                                className={`block w-full rounded-lg shadow-sm border ${errors.status ? "border-red-300" : "border-gray-300"
                                    } bg-white py-2.5 px-3 text-gray-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                            {errors.status && (
                                <p className="mt-1 text-sm text-red-600">{errors.status}</p>
                            )}
                        </div>

                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                id="is_premium"
                                checked={formData.is_premium}
                                onChange={(e) => handleInputChange("is_premium", e.target.checked)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="is_premium" className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                                <Crown className="w-4 h-4 text-yellow-500" />
                                <span>Premium Document</span>
                            </label>
                        </div>

                        {formData.is_premium && (
                            <FormInput
                                name="price_tokens"
                                label="Price (Tokens)"
                                type="number"
                                value={formData.price_token.toString()}
                                onChange={(e) => handleInputChange("price_token", parseInt(e.target.value) || 0)}
                                placeholder="Enter price in tokens"
                                error={errors.price_tokens}
                                icon={<DollarSign className="w-4 h-4" />}
                            />
                        )}
                    </div>

                    {/* File Upload */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">File Upload</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Document File {mode === "create" && <span className="text-red-500">*</span>}
                            </label>

                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                                <div className="space-y-1 text-center">
                                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                        >
                                            <span>Upload a file</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                className="sr-only"
                                                accept=".pdf,.doc,.docx,.txt"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PDF, DOC, DOCX, TXT up to 10MB
                                    </p>
                                </div>
                            </div>

                            {filePreview && (
                                <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                    <FileText className="w-4 h-4" />
                                    <span>{filePreview}</span>
                                    {formData.file && (
                                        <span className="text-gray-400">
                                            ({(formData.file.size / 1024 / 1024).toFixed(2)} MB)
                                        </span>
                                    )}
                                </div>
                            )}

                            {mode === "edit" && !formData.file && initialData && (initialData as any).file_url && (
                                <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600 bg-blue-50 p-2 rounded">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    <span>Current file: {(initialData as any).file_url.split('/').pop()}</span>
                                </div>
                            )}

                            {errors.file && (
                                <p className="mt-1 text-sm text-red-600">{errors.file}</p>
                            )}
                        </div>

                        {/* Thumbnail Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Thumbnail Image (Optional)
                            </label>

                            {thumbnailPreview ? (
                                <div className="relative inline-block">
                                    <img
                                        src={thumbnailPreview}
                                        alt="Thumbnail preview"
                                        className="h-32 w-32 object-cover rounded-lg border border-gray-300"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveThumbnail}
                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors">
                                    <div className="space-y-1 text-center">
                                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="flex text-sm text-gray-600">
                                            <label
                                                htmlFor="thumbnail-upload"
                                                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                            >
                                                <span>Upload thumbnail</span>
                                                <input
                                                    id="thumbnail-upload"
                                                    name="thumbnail-upload"
                                                    type="file"
                                                    className="sr-only"
                                                    accept="image/*"
                                                    onChange={handleThumbnailChange}
                                                />
                                            </label>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            PNG, JPG, GIF up to 5MB
                                        </p>
                                    </div>
                                </div>
                            )}

                            {errors.thumbnail && (
                                <p className="mt-1 text-sm text-red-600">{errors.thumbnail}</p>
                            )}
                        </div>
                    </div>

                    {/* Submit Error */}
                    {errors.submit && (
                        <div className="bg-red-50 border border-red-200 rounded-md p-4">
                            <p className="text-sm text-red-600">{errors.submit}</p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? "Saving..." : mode === "create" ? "Create Document" : "Update Document"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
