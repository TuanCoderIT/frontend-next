"use client";

import { useState } from "react";
import {
    ChevronDown,
    ChevronRight,
    Plus,
    Pencil,
    Trash2,
    BookOpen,
    PlayCircle,
    Lock,
} from "lucide-react";
import { Chapter, Lesson } from "@/types/public/course";

interface ChapterListProps {
    chapters: Chapter[];
    courseId: number;
    isLoading?: boolean;
    onAddChapter: () => void;
    onEditChapter: (chapter: Chapter) => void;
    onDeleteChapter: (chapter: Chapter) => void;
    onAddLesson: (chapter: Chapter) => void;
    onEditLesson: (chapter: Chapter, lesson: Lesson) => void;
    onDeleteLesson: (chapter: Chapter, lesson: Lesson) => void;
}

export default function ChapterList({
    chapters,
    courseId,
    isLoading = false,
    onAddChapter,
    onEditChapter,
    onDeleteChapter,
    onAddLesson,
    onEditLesson,
    onDeleteLesson,
}: ChapterListProps) {
    const [expandedChapters, setExpandedChapters] = useState<Record<number, boolean>>({});

    const toggleChapter = (chapterId: number) => {
        setExpandedChapters((prev) => ({
            ...prev,
            [chapterId]: !prev[chapterId],
        }));
    };

    const sortedChapters = [...chapters].sort((a, b) => a.order - b.order);

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="animate-pulse rounded-xl border border-gray-200 bg-white p-6"
                    >
                        <div className="h-6 w-3/4 rounded bg-gray-200"></div>
                        <div className="mt-2 h-4 w-1/2 rounded bg-gray-200"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (chapters.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-sm font-medium text-gray-900">
                    No chapters yet
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                    Get started by creating your first chapter for this course.
                </p>
                <button
                    onClick={onAddChapter}
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4" />
                    Add Chapter
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                    Chapters ({chapters.length})
                </h3>
                <button
                    onClick={onAddChapter}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4" />
                    Add Chapter
                </button>
            </div>

            <div className="space-y-3">
                {sortedChapters.map((chapter) => {
                    const isExpanded = expandedChapters[chapter.id] ?? false;
                    const sortedLessons = [...(chapter.lessons ?? [])].sort(
                        (a, b) => a.order - b.order
                    );

                    return (
                        <div
                            key={chapter.id}
                            className="group rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                        >
                            {/* Chapter Header */}
                            <div className="flex items-start gap-4 p-5">
                                <button
                                    onClick={() => toggleChapter(chapter.id)}
                                    className="mt-1 flex-shrink-0 text-gray-400 hover:text-gray-600"
                                >
                                    {isExpanded ? (
                                        <ChevronDown className="h-5 w-5" />
                                    ) : (
                                        <ChevronRight className="h-5 w-5" />
                                    )}
                                </button>

                                <div className="flex-1">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3">
                                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                                                    {chapter.order}
                                                </span>
                                                <h4 className="text-base font-semibold text-gray-900">
                                                    {chapter.title}
                                                </h4>
                                            </div>
                                            {chapter.description && (
                                                <p className="mt-2 text-sm text-gray-600">
                                                    {chapter.description}
                                                </p>
                                            )}
                                            <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                                                <span>
                                                    {sortedLessons.length}{" "}
                                                    {sortedLessons.length === 1
                                                        ? "lesson"
                                                        : "lessons"}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                            <button
                                                onClick={() => onEditChapter(chapter)}
                                                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-blue-200 hover:text-blue-600"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => onDeleteChapter(chapter)}
                                                className="inline-flex items-center gap-1 rounded-lg border border-red-100 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Lessons List */}
                            {isExpanded && (
                                <div className="border-t border-gray-100 bg-gray-50/50">
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h5 className="text-sm font-medium text-gray-700">
                                                Lessons
                                            </h5>
                                            <button
                                                onClick={() => onAddLesson(chapter)}
                                                className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 hover:border-blue-200 hover:text-blue-600"
                                            >
                                                <Plus className="h-3.5 w-3.5" />
                                                Add Lesson
                                            </button>
                                        </div>

                                        {sortedLessons.length === 0 ? (
                                            <div className="rounded-lg border border-dashed border-gray-300 bg-white p-6 text-center">
                                                <PlayCircle className="mx-auto h-8 w-8 text-gray-400" />
                                                <p className="mt-2 text-xs text-gray-500">
                                                    No lessons in this chapter yet
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {sortedLessons.map((lesson) => (
                                                    <div
                                                        key={lesson.id}
                                                        className="group/lesson flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3 transition hover:border-blue-200 hover:shadow-sm"
                                                    >
                                                        <div className="flex items-center gap-3 flex-1">
                                                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                                                                {lesson.order}
                                                            </span>
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <h6 className="text-sm font-medium text-gray-900">
                                                                        {lesson.title}
                                                                    </h6>
                                                                    {lesson.is_free_preview && (
                                                                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                                                                            <PlayCircle className="h-3 w-3" />
                                                                            Free Preview
                                                                        </span>
                                                                    )}
                                                                    {!lesson.is_free_preview && (
                                                                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                                                                            <Lock className="h-3 w-3" />
                                                                            Premium
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-1.5 opacity-0 transition-opacity group-hover/lesson:opacity-100">
                                                            <button
                                                                onClick={() =>
                                                                    onEditLesson(chapter, lesson)
                                                                }
                                                                className="inline-flex items-center justify-center rounded-lg border border-gray-200 p-1.5 text-gray-600 hover:border-blue-200 hover:text-blue-600"
                                                                title="Edit lesson"
                                                            >
                                                                <Pencil className="h-3.5 w-3.5" />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    onDeleteLesson(chapter, lesson)
                                                                }
                                                                className="inline-flex items-center justify-center rounded-lg border border-red-100 p-1.5 text-red-600 hover:bg-red-50"
                                                                title="Delete lesson"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

