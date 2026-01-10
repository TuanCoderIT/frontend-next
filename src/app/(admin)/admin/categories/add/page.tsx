"use client";

import { useState } from "react";
import { useRouter } from "@lexz451/next-nprogress";
import { ArrowLeft, FolderTree } from "lucide-react";
import PageHeader from "@/components/admin/common/PageHeader";
import CategoryForm from "@/components/admin/categories/CategoryForm";
import AdminBreadcrumb from "@/components/admin/common/AdminBreadcrumb";
import { saveCategory } from "@/api/categories";

export default function AddCategoryPage() {
    const router = useRouter();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        color: "#3b82f6",
        is_active: true,
    });

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
            await saveCategory({
                name: formData.name,
                slug: formData.slug,
                color: formData.color || undefined,
                is_active: formData.is_active,
            });
            router.push("/admin/categories");
        } catch (error: any) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors || {});
            } else {
                console.error("Unexpected error:", error);
                setErrors({ form: "Failed to create category. Please try again." });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 mx-4">
            {/* Breadcrumb */}
            <AdminBreadcrumb
                currentPage="Add New Category"
                parent={{ href: "/admin/categories", label: "Categories" }}
            />
            {/* Header */}
            <PageHeader
                title="Add New Category"
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
                handleChange={handleChange}
                setFormData={setFormData}
            />
        </div>
    );
}

