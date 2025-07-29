"use client";

import { useState } from "react";
import { useRouter } from "@lexz451/next-nprogress";
import { ArrowLeft, CircleUserRound } from "lucide-react";
import PageHeader from "@/components/admin/common/PageHeader";
import UserForm from "@/components/admin/users/UserForm";
import AdminBreadcrumb from "@/components/admin/common/AdminBreadcrumb";
import { saveUser } from "@/api/users";

export default function AddUserPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "admin",
    phone: "",
    status: "",
    password: "",
    avatar: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, type, value } = e.target;

    if (type === "file") {
      const files = (e.target as HTMLInputElement).files;
      setFormData((prev) => ({
        ...prev,
        [name]: files?.[0] || null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
      await saveUser(formData);
      router.push("/admin/users");
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
    <div className="space-y-6 mx-4">
      {/* Breadcrumb */}
      <AdminBreadcrumb
        currentPage="Add New User"
        parent={{ href: "/admin/users", label: "Users" }}
      />
      {/* Header */}
      <PageHeader
        title="Add New User"
        icon={<CircleUserRound />}
        actionLabel="Back to Users"
        actionHref="/admin/users"
        actionIcon={<ArrowLeft />}
      />
      {/* Form */}
      <UserForm
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
