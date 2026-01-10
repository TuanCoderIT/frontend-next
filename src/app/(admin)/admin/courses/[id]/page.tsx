"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Calendar, User, Globe, Lock, Coins } from "lucide-react";
import AdminBreadcrumb from "@/components/admin/common/AdminBreadcrumb";
import PageHeader from "@/components/admin/common/PageHeader";
import { PageLoading } from "@/components/common/LoadingScreen";
import ChapterList from "@/components/admin/courses/ChapterList";
import ChapterForm from "@/components/admin/courses/ChapterForm";
import LessonForm from "@/components/admin/courses/LessonForm";
import {
    getCourseById,
    getChapters,
    createChapter,
    updateChapter,
    deleteChapter,
    createLesson,
    updateLesson,
    deleteLesson,
    ChapterPayload,
    LessonPayload,
} from "@/api/courses";
import { Course, Chapter, Lesson } from "@/types/public/course";
import { notify } from "@/utils/toast";
import { formatDate } from "@/utils/admin";

export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params.id as string;
    const [course, setCourse] = useState<Course | null>(null);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"overview" | "chapters">("overview");
    const [isChapterModalOpen, setIsChapterModalOpen] = useState(false);
    const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
    const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
    const [editingLesson, setEditingLesson] = useState<{ chapter: Chapter; lesson: Lesson } | null>(null);
    const [selectedChapterForLesson, setSelectedChapterForLesson] = useState<Chapter | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!courseId) return;
            setIsLoading(true);
            try {
                const courseData = await getCourseById(Number(courseId));
                setCourse(courseData);
                await fetchChapters(Number(courseId));
            } catch (error) {
                console.error(error);
                notify.error("Failed to load course. Please try again.");
                router.push("/admin/courses");
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourse();
    }, [courseId, router]);

    const fetchChapters = async (id: number) => {
        try {
            const data = await getChapters(id);
            setChapters(data);
        } catch (error) {
            console.error(error);
            notify.error("Failed to load chapters.");
        }
    };

    const handleAddChapter = () => {
        setEditingChapter(null);
        setSelectedChapterForLesson(null);
        setIsChapterModalOpen(true);
    };

    const handleEditChapter = (chapter: Chapter) => {
        setEditingChapter(chapter);
        setIsChapterModalOpen(true);
    };

    const handleDeleteChapter = async (chapter: Chapter) => {
        if (
            !confirm(
                `Delete chapter "${chapter.title}"? This will also delete all lessons in this chapter. This action cannot be undone.`
            )
        )
            return;

        const previous = [...chapters];
        setChapters((prev) => prev.filter((c) => c.id !== chapter.id));

        try {
            await deleteChapter(Number(courseId), chapter.id);
            notify.success("Chapter deleted successfully.");
        } catch (error) {
            console.error(error);
            setChapters(previous);
            notify.error("Failed to delete chapter.");
        }
    };

    const handleAddLesson = (chapter: Chapter) => {
        setSelectedChapterForLesson(chapter);
        setEditingLesson(null);
        setIsLessonModalOpen(true);
    };

    const handleEditLesson = (chapter: Chapter, lesson: Lesson) => {
        setSelectedChapterForLesson(chapter);
        setEditingLesson({ chapter, lesson });
        setIsLessonModalOpen(true);
    };

    const handleDeleteLesson = async (chapter: Chapter, lesson: Lesson) => {
        if (!confirm(`Delete lesson "${lesson.title}"? This action cannot be undone.`))
            return;

        const previous = [...chapters];
        setChapters((prev) =>
            prev.map((c) =>
                c.id === chapter.id
                    ? {
                        ...c,
                        lessons: c.lessons?.filter((l) => l.id !== lesson.id),
                    }
                    : c
            )
        );

        try {
            await deleteLesson(chapter.id, lesson.id);
            notify.success("Lesson deleted successfully.");
        } catch (error) {
            console.error(error);
            setChapters(previous);
            notify.error("Failed to delete lesson.");
        }
    };

    const handleChapterSubmit = async (values: ChapterPayload) => {
        if (!course) return;

        setIsSubmitting(true);
        try {
            if (editingChapter) {
                const updated = await updateChapter(
                    Number(courseId),
                    editingChapter.id,
                    values
                );
                setChapters((prev) =>
                    prev.map((c) => (c.id === updated.id ? updated : c))
                );
                notify.success("Chapter updated successfully.");
            } else {
                const created = await createChapter(Number(courseId), values);
                setChapters((prev) => [...prev, created]);
                notify.success("Chapter created successfully.");
            }
            setIsChapterModalOpen(false);
            setEditingChapter(null);
        } catch (error) {
            console.error(error);
            notify.error(
                editingChapter
                    ? "Failed to update chapter."
                    : "Failed to create chapter."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLessonSubmit = async (values: LessonPayload) => {
        if (!selectedChapterForLesson) return;

        setIsSubmitting(true);
        try {
            if (editingLesson) {
                const updated = await updateLesson(
                    selectedChapterForLesson.id,
                    editingLesson.lesson.id,
                    values
                );
                setChapters((prev) =>
                    prev.map((c) =>
                        c.id === selectedChapterForLesson.id
                            ? {
                                ...c,
                                lessons: c.lessons?.map((l) =>
                                    l.id === updated.id ? updated : l
                                ),
                            }
                            : c
                    )
                );
                notify.success("Lesson updated successfully.");
            } else {
                const created = await createLesson(
                    selectedChapterForLesson.id,
                    values
                );
                setChapters((prev) =>
                    prev.map((c) =>
                        c.id === selectedChapterForLesson.id
                            ? {
                                ...c,
                                lessons: [...(c.lessons ?? []), created],
                            }
                            : c
                    )
                );
                notify.success("Lesson created successfully.");
            }
            setIsLessonModalOpen(false);
            setEditingLesson(null);
            setSelectedChapterForLesson(null);
        } catch (error) {
            console.error(error);
            notify.error(
                editingLesson ? "Failed to update lesson." : "Failed to create lesson."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <PageLoading text="Loading course details..." />;
    }

    if (!course) {
        return (
            <div className="p-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Course Not Found</h1>
                    <p className="text-gray-600 mt-2">
                        The course you're looking for doesn't exist.
                    </p>
                    <button
                        onClick={() => router.push("/admin/courses")}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Courses
                    </button>
                </div>
            </div>
        );
    }

    const totalLessons = chapters.reduce(
        (sum, chapter) => sum + (chapter.lessons?.length ?? 0),
        0
    );

    return (
        <div className="space-y-6">
            <AdminBreadcrumb
                currentPage={course.title}
                parent={{ href: "/admin/courses", label: "Courses" }}
            />

            <PageHeader
                title={course.title}
                icon={<BookOpen />}
                actionLabel="Back to Courses"
                actionHref="/admin/courses"
                actionIcon={<ArrowLeft />}
                bgGradient="from-blue-50 to-indigo-50"
                buttonGradient="from-blue-500 to-indigo-600"
            />

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "overview"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("chapters")}
                        className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === "chapters"
                            ? "border-blue-500 text-blue-600"
                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            }`}
                    >
                        Chapters ({chapters.length})
                    </button>
                </nav>
            </div>

            {/* Content */}
            {activeTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Description */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Description
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                {course.description || "No description provided."}
                            </p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Course Statistics
                            </h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Chapters</span>
                                    <span className="font-medium">{chapters.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Lessons</span>
                                    <span className="font-medium">{totalLessons}</span>
                                </div>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Status
                            </h2>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    {course.is_public ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                                            <Globe className="h-4 w-4" />
                                            Public
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
                                            <Lock className="h-4 w-4" />
                                            Private
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {course.price_token && course.price_token > 0 ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
                                            <Coins className="h-4 w-4" />
                                            {course.price_token} tokens
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
                                            Free
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Metadata
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="h-4 w-4" />
                                    <span>Created: {formatDate(course.created_at)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="h-4 w-4" />
                                    <span>Updated: {formatDate(course.updated_at)}</span>
                                </div>
                                {course.instructor && (
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <User className="h-4 w-4" />
                                        <span>Instructor: {course.instructor.name}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === "chapters" && (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <ChapterList
                        chapters={chapters}
                        courseId={Number(courseId)}
                        onAddChapter={handleAddChapter}
                        onEditChapter={handleEditChapter}
                        onDeleteChapter={handleDeleteChapter}
                        onAddLesson={handleAddLesson}
                        onEditLesson={handleEditLesson}
                        onDeleteLesson={handleDeleteLesson}
                    />
                </div>
            )}

            {/* Chapter Modal */}
            {isChapterModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {editingChapter ? "Edit Chapter" : "Create Chapter"}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {editingChapter
                                        ? "Update chapter information."
                                        : "Add a new chapter to organize your course content."}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsChapterModalOpen(false);
                                    setEditingChapter(null);
                                }}
                                className="text-sm text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                        <ChapterForm
                            initialData={editingChapter ?? undefined}
                            courseId={Number(courseId)}
                            mode={editingChapter ? "edit" : "create"}
                            onSubmit={handleChapterSubmit}
                            onCancel={() => {
                                setIsChapterModalOpen(false);
                                setEditingChapter(null);
                            }}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                </div>
            )}

            {/* Lesson Modal */}
            {isLessonModalOpen && selectedChapterForLesson && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8 backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="mb-6 flex items-start justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {editingLesson ? "Edit Lesson" : "Create Lesson"}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {editingLesson
                                        ? "Update lesson information."
                                        : `Add a new lesson to "${selectedChapterForLesson.title}".`}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsLessonModalOpen(false);
                                    setEditingLesson(null);
                                    setSelectedChapterForLesson(null);
                                }}
                                className="text-sm text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                        <LessonForm
                            initialData={editingLesson?.lesson}
                            chapterId={selectedChapterForLesson.id}
                            mode={editingLesson ? "edit" : "create"}
                            onSubmit={handleLessonSubmit}
                            onCancel={() => {
                                setIsLessonModalOpen(false);
                                setEditingLesson(null);
                                setSelectedChapterForLesson(null);
                            }}
                            isSubmitting={isSubmitting}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

