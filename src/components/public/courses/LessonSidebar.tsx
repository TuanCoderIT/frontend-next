"use client";

import { useState } from "react";
import Link from "next/link";
import { PlayCircle, LockKeyhole, CheckCircle2, ChevronDown, ChevronRight, X } from "lucide-react";
import { Chapter, Lesson, Course } from "@/types/public/course";

interface LessonWithStatus extends Lesson {
    status?: "locked" | "unlocked" | "completed";
    progress?: number;
    can_view?: boolean;
    isPreview?: boolean;
}

interface LessonSidebarProps {
    chapters: Chapter[];
    courseSlug: string;
    currentLessonId: number;
    lessonsStatus?: Record<number, LessonWithStatus>;
    onLessonClick?: (lessonId: number) => void;
    course?: Course | null;
    coursePurchased?: boolean;
    onClose?: () => void;
}

export default function LessonSidebar({
    chapters,
    courseSlug,
    currentLessonId,
    lessonsStatus = {},
    onLessonClick,
    course,
    coursePurchased = false,
    onClose,
}: LessonSidebarProps) {
    const [expandedChapters, setExpandedChapters] = useState<Set<number>>(() => {
        // Auto-expand chapter containing current lesson
        const currentChapter = chapters.find((chapter) =>
            chapter.lessons?.some((lesson) => lesson.id === currentLessonId)
        );
        return currentChapter ? new Set([currentChapter.id]) : new Set();
    });

    const toggleChapter = (chapterId: number) => {
        setExpandedChapters((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(chapterId)) {
                newSet.delete(chapterId);
            } else {
                newSet.add(chapterId);
            }
            return newSet;
        });
    };

    // Build all lessons list to find lesson index
    const allLessons: Array<{ lesson: Lesson; chapter: Chapter }> = [];
    chapters.forEach((chapter) => {
        const sortedLessons = [...(chapter.lessons ?? [])].sort(
            (a, b) => a.order - b.order
        );
        sortedLessons.forEach((lesson) => {
            allLessons.push({ lesson, chapter });
        });
    });
    const getLessonStatusIcon = (lesson: LessonWithStatus) => {
        const status = lesson.status || (lesson.can_view === false ? "locked" : "unlocked");

        if (status === "completed") {
            return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
        }
        if (status === "locked") {
            return <LockKeyhole className="h-4 w-4 text-gray-400" />;
        }
        if (lesson.type === "video") {
            return <PlayCircle className="h-4 w-4 text-blue-600" />;
        }
        return <div className="h-4 w-4 rounded-full border-2 border-blue-600" />;
    };

    const getLessonStatusBadge = (lesson: LessonWithStatus, lessonId: number) => {
        const status = lesson.status || (lesson.can_view === false ? "locked" : "unlocked");

        // Find lesson index
        const lessonIndex = allLessons.findIndex((item) => item.lesson.id === lessonId);

        // Check if this is a preview lesson (first 3 lessons of paid course that's not purchased)
        const isCourseFree = !course?.price_token || course.price_token === 0;
        const isPreview = !isCourseFree && !coursePurchased && lessonIndex < 3 && status !== "locked";

        if ((lesson.is_free_preview || isPreview || lesson.isPreview) && status !== "locked") {
            return (
                <span className="ml-auto rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    Xem trước
                </span>
            );
        }
        if (status === "completed") {
            return (
                <span className="ml-auto rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                    Hoàn thành
                </span>
            );
        }
        return null;
    };

    const handleLessonClick = (e: React.MouseEvent, lessonId: number) => {
        const lesson = lessonsStatus[lessonId];
        const status = lesson?.status || (lesson?.can_view === false ? "locked" : "unlocked");

        if (status === "locked" && onLessonClick) {
            e.preventDefault();
            onLessonClick(lessonId);
        }
    };

    const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);

    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Nội dung khóa học</h3>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition"
                        aria-label="Đóng sidebar"
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
                <div className="space-y-1">
                    {sortedChapters.map((chapter) => {
                        const sortedLessons = [...(chapter.lessons ?? [])].sort(
                            (a, b) => a.order - b.order
                        );

                        if (sortedLessons.length === 0) {
                            return null;
                        }

                        const isExpanded = expandedChapters.has(chapter.id);
                        const hasCurrentLesson = sortedLessons.some(
                            (lesson) => lesson.id === currentLessonId
                        );

                        return (
                            <div key={chapter.id} className="space-y-0.5">
                                {/* Chapter Header - Clickable to expand/collapse */}
                                <button
                                    onClick={() => toggleChapter(chapter.id)}
                                    className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-gray-50 transition text-left"
                                >
                                    <div className="flex-shrink-0">
                                        {isExpanded ? (
                                            <ChevronDown className="h-4 w-4 text-gray-500" />
                                        ) : (
                                            <ChevronRight className="h-4 w-4 text-gray-500" />
                                        )}
                                    </div>
                                    <span className="text-xs font-semibold text-gray-500">
                                        {chapter.order}
                                    </span>
                                    <span className="text-sm font-medium text-gray-700 flex-1 truncate">
                                        {chapter.title}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {sortedLessons.length} bài học
                                    </span>
                                </button>

                                {/* Lessons - Show when expanded */}
                                {isExpanded && (
                                    <div className="ml-6 space-y-0.5 border-l-2 border-gray-100 pl-3">
                                        {sortedLessons.map((lesson) => {
                                            const lessonWithStatus = lessonsStatus[lesson.id] || lesson;
                                            const status =
                                                lessonWithStatus.status ||
                                                (lessonWithStatus.can_view === false
                                                    ? "locked"
                                                    : "unlocked");
                                            const isActive = lesson.id === currentLessonId;

                                            return (
                                                <Link
                                                    key={lesson.id}
                                                    href={`/courses/${courseSlug}/lessons/${lesson.id}`}
                                                    onClick={(e) => handleLessonClick(e, lesson.id)}
                                                    className={`group flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition ${isActive
                                                        ? "bg-blue-50 font-medium text-blue-700"
                                                        : status === "locked"
                                                            ? "text-gray-400 cursor-not-allowed"
                                                            : "text-gray-600 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <div className="flex-shrink-0">
                                                        {getLessonStatusIcon(lessonWithStatus)}
                                                    </div>
                                                    <span className="truncate flex-1">
                                                        {lesson.order}. {lesson.title}
                                                    </span>
                                                    {getLessonStatusBadge(lessonWithStatus, lesson.id)}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

