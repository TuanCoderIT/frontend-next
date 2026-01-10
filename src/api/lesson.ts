import { axiosAPI } from "@/api/axios";

// Unwrap axios response
const unwrapData = <T>(resData: any): T => {
    if (resData?.data) return resData.data as T;
    return resData as T;
};

// -------------------------
// Interfaces
// -------------------------
export interface LessonStatus {
    lesson: {
        id: number;
        title: string;
        content?: string | null;
        video_url?: string | null;
        type: "video" | "text";
        is_free_preview: boolean; // dùng để xác định khóa hay mở
        order: number;
    };
    progress?: number; // watched_seconds (seconds) for video, scroll_percent (0-100) for text
    is_completed?: boolean; // true when lesson is completed (>= 50% watched)
    next_lesson?: {
        id: number;
        title: string;
        course_slug: string;
    } | null;
}

// -------------------------
// API Functions
// -------------------------

// Get lesson with status
export const getLessonWithStatus = async (courseSlug: string, lessonId: number) => {
    const res = await axiosAPI.get(`/courses/${courseSlug}/lessons/${lessonId}`);
    const data = unwrapData<{
        lesson: {
            id: number;
            title: string;
            content?: string | null;
            video_url?: string | null;
            type: "video" | "text";
            is_free_preview: boolean;
            order: number;
        };
        unlocked: boolean;
        progress?: { watched_seconds?: number; scroll_percent?: number; is_completed?: boolean };
        next_lesson?: { id: number; title: string; course_slug: string } | null;
    }>(res.data);

    // Calculate progress
    // For video: watched_seconds (in seconds)
    // For text: scroll_percent (0-100)
    const progress = data.lesson.type === "video"
        ? data.progress?.watched_seconds ?? 0
        : data.progress?.scroll_percent ?? 0;

    return {
        lesson: data.lesson,
        progress: progress,
        is_completed: data.progress?.is_completed ?? false,
        next_lesson: data.next_lesson ?? null,
    } as LessonStatus;
};

// Mark lesson as learned
export const learnLesson = async (courseSlug: string, lessonId: number) => {
    const res = await axiosAPI.post(`/courses/${courseSlug}/lessons/${lessonId}/learn`);
    const data = unwrapData<{ message: string; progress?: any; next_lesson?: any }>(res.data);
    return data;
};

// Save lesson progress
export const saveProgress = async (
    lessonId: number,
    data: { watched_seconds?: number; scroll_percent?: number }
) => {
    const payload: any = { ...data };
    if (payload.watched_seconds !== undefined) {
        payload.watched_seconds = Math.floor(payload.watched_seconds);
    }
    if (payload.scroll_percent !== undefined) {
        payload.scroll_percent = Math.floor(payload.scroll_percent);
    }
    const res = await axiosAPI.post(`/lessons/${lessonId}/progress`, payload);
    return unwrapData<{
        message: string;
        is_completed: boolean;
        next_lesson?: { id: number; title: string; course_slug: string };
    }>(res.data);
};

// Resume lesson
export const resumeLesson = async (lessonId: number) => {
    const res = await axiosAPI.post(`/lessons/${lessonId}/resume`);
    const data = unwrapData<{
        watched_seconds?: number;
        scroll_percent?: number;
        is_completed?: boolean;
    }>(res.data);

    return {
        resume_time: data.watched_seconds ?? 0,
        progress: data.scroll_percent ?? 0,
        status: data.is_completed ? "resumed" : "new",
    };
};

// Unlock lesson
export const unlockLesson = async (lessonId: number) => {
    const res = await axiosAPI.post(`/lessons/${lessonId}/unlock`);
    const data = unwrapData<{ message: string; lesson?: any }>(res.data);

    return {
        unlocked: !!data.lesson,
        message: data.message,
    };
};

// Get next lesson
export const getNextLesson = async (lessonId: number) => {
    const res = await axiosAPI.get(`/lessons/${lessonId}/next`);
    return unwrapData<{ id: number; title: string; course_slug: string } | null>(res.data);
};

// Get course progress
export const getCourseProgress = async (courseSlug: string) => {
    const res = await axiosAPI.get(`/courses/${courseSlug}/progress`);
    const data = unwrapData<{
        progress_percent: number;
        completed_lessons: number;
        total_lessons: number;
    }>(res.data);

    return {
        progress: data.progress_percent,
        completed_lessons: data.completed_lessons,
        total_lessons: data.total_lessons,
    };
};
