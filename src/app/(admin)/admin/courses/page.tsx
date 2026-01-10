"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, BookOpen, ExternalLink } from "lucide-react";
import AdminBreadcrumb from "@/components/admin/common/AdminBreadcrumb";
import { DataLoading } from "@/components/common/LoadingScreen";
import CourseForm, {
    CourseFormValues,
} from "@/components/admin/courses/CourseForm";
import {
    createCourse,
    deleteCourse,
    getCourseById,
    getCourseBySlug,
    getCourses,
    updateCourse,
} from "@/api/courses";
import { Course } from "@/types/public/course";
import { notify } from "@/utils/toast";
import Pagination from "@/components/common/Pagination";

const toSlug = (title: string) =>
    title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

const formatDate = (dateString: string) =>
    new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(new Date(dateString));

export default function AdminCoursesPage() {
    const router = useRouter();
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        const fetchCourses = async () => {
            setIsLoading(true);
            try {
                const data = await getCourses();
                console.log("DATA FROM API:", data);
                setCourses(data);
            } catch (error) {
                console.error(error);
                notify.error("Unable to load courses. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleCreate = async (values: CourseFormValues) => {
        const now = new Date().toISOString();
        const tempId = Date.now();
        const optimisticCourse: Course = {
            id: tempId,
            user_id: 0,
            title: values.title,
            slug: toSlug(values.title),
            description: values.description,
            category_id: values.category_id ?? null,
            thumbnail: null,
            is_public: values.is_public,
            created_at: now,
            updated_at: now,
            chapters: [],
            instructor: undefined,
            price_token: values.price_token ?? null,
            category: { id: 0, name: "" },
        };

        setCourses((prev) => [optimisticCourse, ...prev]);

        try {
            const created = await createCourse(values);
            setCourses((prev) =>
                prev.map((course) => (course.id === tempId ? created : course))
            );
            notify.success("Course created successfully.");
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            setCourses((prev) => prev.filter((course) => course.id !== tempId));
            notify.error("Failed to create course. Please try again.");
        }
    };

    const handleUpdate = async (values: CourseFormValues) => {
        if (!editingCourse) return;
        const prevSnapshot = [...courses];
        const optimistic: Course = {
            ...editingCourse,
            title: values.title,
            description: values.description,
            category_id:
                values.category_id !== undefined ? values.category_id : null,
            is_public: values.is_public,
            price_token: values.price_token ?? null,
            updated_at: new Date().toISOString(),
        };

        setCourses((prev) =>
            prev.map((course) =>
                course.id === editingCourse.id ? optimistic : course
            )
        );

        try {
            const updated = await updateCourse(editingCourse.id, values);
            setCourses((prev) =>
                prev.map((course) => (course.id === updated.id ? updated : course))
            );
            notify.success("Course updated successfully.");
            setEditingCourse(null);
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
            setCourses(prevSnapshot);
            notify.error("Failed to update course. Please try again.");
        }
    };

    const handleDelete = async (course: Course) => {
        if (!confirm(`Delete course "${course.title}"? This action cannot be undone.`))
            return;

        const previous = [...courses];
        setCourses((prev) => prev.filter((c) => c.id !== course.id));

        try {
            await deleteCourse(course.id);
            notify.success("Course deleted.");
        } catch (error) {
            console.error(error);
            setCourses(previous);
            notify.error("Failed to delete course.");
        }
    };

    const handleSubmit = async (values: CourseFormValues) => {
        setIsSubmitting(true);
        try {
            if (editingCourse) {
                await handleUpdate(values);
            } else {
                await handleCreate(values);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const openCreateModal = () => {
        setEditingCourse(null);
        setIsModalOpen(true);
    };

    const openEditModal = async (course: Course) => {
        setEditingCourse(course);
        setIsModalOpen(true);

        if (!course.chapters || course.chapters.length === 0) {
            try {
                const detailed = await getCourseById(course.id);
                setCourses((prev) =>
                    prev.map((item) => (item.id === course.id ? detailed : item))
                );
                setEditingCourse(detailed);
            } catch (error) {
                console.warn("Unable to load full course detail", error);
            }
        }
    };

    // Pagination logic
    const paginatedCourses = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return courses.slice(start, end);
    }, [courses, currentPage, pageSize]);

    useEffect(() => {
        setCurrentPage(1);
    }, [pageSize]);

    return (
        <div className="space-y-6">
            <AdminBreadcrumb currentPage="Courses" parent={{ href: "/admin", label: "Dashboard" }} />

            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white/90 px-6 py-5 shadow-sm sm:flex-row sm:items-center">
                <div className="flex items-start gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                        <BookOpen className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">
                            Course Management
                        </h1>
                        <p className="text-sm text-gray-500">
                            Monitor, create, and curate courses for your learners.
                        </p>
                    </div>
                </div>
                <button
                    onClick={openCreateModal}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4" />
                    New course
                </button>
            </div>

            {isLoading ? (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-16">
                    <DataLoading text="Loading courses..." />
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Course
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Category
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Price (Tokens)
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Created
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wide text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {paginatedCourses.map((course) => (
                                    <tr key={course.id} className="hover:bg-slate-50/80">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-semibold text-gray-900">
                                                    {course.title}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {course.slug}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                                {course.category?.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${course.is_public
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "bg-amber-50 text-amber-700"
                                                    }`}
                                            >
                                                {course.is_public ? "Public" : "Private"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {course.price_token && course.price_token > 0 ? (
                                                <>
                                                    <div className="text-sm font-medium text-green-900">
                                                        {course.price_token}
                                                    </div>
                                                    <div className="text-xs text-gray-500">Tokens</div>
                                                </>
                                            ) : (
                                                <span className="text-sm text-gray-400">Free</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {formatDate(course.created_at)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => router.push(`/admin/courses/${course.id}`)}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-blue-200 hover:text-blue-600"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                    Manage
                                                </button>
                                                <button
                                                    onClick={() => openEditModal(course)}
                                                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-blue-200 hover:text-blue-600"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(course)}
                                                    className="inline-flex items-center justify-center rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    {courses.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <Pagination
                                currentPage={currentPage}
                                pageSize={pageSize}
                                totalItems={courses.length}
                                onPageChange={setCurrentPage}
                                onPageSizeChange={setPageSize}
                                pageSizeOptions={[5, 10, 20, 50]}
                            />
                        </div>
                    )}
                    {courses.length === 0 && (
                        <div className="px-6 py-16 text-center text-sm text-gray-500">
                            <p className="font-medium text-gray-700">
                                No courses available yet.
                            </p>
                            <p className="mt-1">
                                Click the &ldquo;New course&rdquo; button to create your first
                                course.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 backdrop-blur-sm">
                    <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {editingCourse ? "Edit Course" : "Create Course"}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {editingCourse
                                        ? "Update course information and visibility."
                                        : "Provide the basic information to publish a new course."}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setEditingCourse(null);
                                }}
                                className="text-sm text-gray-400 hover:text-gray-600"
                            >
                                Close
                            </button>
                        </div>
                        <CourseForm
                            initialData={editingCourse ?? undefined}
                            mode={editingCourse ? "edit" : "create"}
                            onSubmit={handleSubmit}
                            onCancel={() => {
                                setIsModalOpen(false);
                                setEditingCourse(null);
                            }}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

