"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import PageHeader from "@/components/admin/common/PageHeader";
import { ArrowLeft, CircleUserRound } from "lucide-react";
import UserForm from "@/components/admin/users/UserForm";
import AdminBreadcrumb from "@/components/admin/common/AdminBreadcrumb";
import { getUserById, updateUser } from "@/api/users";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    phone: "",
    status: "",
    avatar: "",
  });

  // Test input for debugging
  useEffect(() => {
    console.log("formData changed:", formData);
  }, [formData]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUserById(userId);
        console.log("API response:", res.data);
        const user = res.data;
        setFormData({
          name: user.name,
          role: user.role,
          phone: user.phone_number || "",
          status: user.status,
          avatar: user.avatar || "",
        });
      } catch (err) {
        setErrors({ general: "Failed to load user data." });
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    if (type === "file" && files && files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    try {
      await updateUser(userId, formData);
      router.push("/admin/users");
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: "Failed to update user." });
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
            <span className="text-gray-600">Loading user data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mx-4">
      {/* Breadcrumb */}
      <AdminBreadcrumb
        currentPage="Edit User"
        parent={{ href: "/admin/users", label: "Users" }}
      />
      {/* Header */}
      <PageHeader
        title="Edit User"
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
        setFormData={setFormData}
        handleChange={handleChange}
        isEditMode={true}
      />
    </div>
  );
}
