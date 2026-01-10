"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageHeader from "@/components/admin/common/PageHeader";
import { ArrowLeft, FolderTree } from "lucide-react";
import CategoryForm from "@/components/admin/categories/CategoryForm";
import AdminBreadcrumb from "@/components/admin/common/AdminBreadcrumb";
import { getCategoryById, updateCategory } from "@/api/categories";

export default function EditCategoryPage() {
    const router = useRouter();
    const params = useParams();
    const categoryId = params.id as string;
    const [isLoading, setIsLoading] = useState(true);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        color: "#3b82f6",
        is_active: true,
    });

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const res = await getCategoryById(categoryId);
                const category = res.data;
                setFormData({
                    name: category.name,
                    slug: category.slug,
                    color: category.color || "#3b82f6",
                    is_active: category.is_active,
                });
            } catch (err) {
                setErrors({ general: "Failed to load category data." });
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategory();
    }, [categoryId]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});
        try {
            await updateCategory(categoryId, {
                name: formData.name,
                slug: formData.slug,
                color: formData.color || undefined,
                is_active: formData.is_active,
            });
            router.push("/admin/categories");
        } catch (error: any) {
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({ form: "Failed to update category. Please try again." });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="flex items-center space-x-2">
                        <svg
                            className="w-6 h-6 animate-spin text-blue-600"
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
                                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        <span className="text-gray-600">Loading category data...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 mx-4">
            {/* Breadcrumb */}
            <AdminBreadcrumb
                currentPage="Edit Category"
                parent={{ href: "/admin/categories", label: "Categories" }}
            />
            {/* Header */}
            <PageHeader
                title="Edit Category"
                icon={<FolderTree />}
                actionLabel="Back to Categories"
                actionHref="/admin/categories"
                actionIcon={<ArrowLeft />}
            />
            {/* Form */}
            <CategoryForm
                formData={formData}
                errors={errors}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
                setFormData={setFormData}
                handleChange={handleChange}
                isEditMode={true}
            />
        </div>
    );
}

