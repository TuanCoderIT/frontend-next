import { axiosAPI } from "@/api/axios";
import { Course, CourseCategory, Chapter, Lesson } from "@/types/public/course";

export interface CoursePayload {
    title: string;
    description?: string;
    category_id?: number | null;
    is_public: boolean;
    price_token?: number | null;
    thumbnail?: File | string | null;
    slug?: string;
}

const unwrapData = <T>(resData: any): T => {
    if (resData?.data) {
        return resData.data as T;
    }
    return resData as T;
};

// export const getCourses = async (params: Record<string, any> = {}) => {
//     const response = await axiosAPI.get("/courses", { params });
//     return unwrapData<Course[]>(response.data);
// };

export const getCourses = async (params = {}) => {
    const response = await axiosAPI.get("/admin/courses", { params });
    return unwrapData<Course[]>(response.data);
};

export const getCourseBySlug = async (slug: string) => {
    const response = await axiosAPI.get(`/courses/${slug}`);
    return unwrapData<Course>(response.data);
};

export const getCourseById = async (id: number) => {
    const response = await axiosAPI.get(`/admin/courses/${id}`);
    return unwrapData<Course>(response.data);
};

// Public API - Get course chapters with lessons
export const getCourseChapters = async (courseSlug: string) => {
    const response = await axiosAPI.get(`/courses/${courseSlug}/chapters`);
    return unwrapData<Chapter[]>(response.data);
};

const buildCourseFormData = (payload: CoursePayload) => {
    const formData = new FormData();
    if (payload.slug) formData.append("slug", payload.slug);
    formData.append("title", payload.title);
    if (payload.description) formData.append("description", payload.description);
    formData.append("is_public", payload.is_public ? "1" : "0");
    formData.append("category_id", payload.category_id ? String(payload.category_id) : "");
    formData.append("price_token", String(payload.price_token ?? 0));
    if (payload.thumbnail instanceof File) formData.append("thumbnail", payload.thumbnail);
    return formData;
};

export const createCourse = async (payload: CoursePayload) => {
    const response = await axiosAPI.post("/admin/courses", buildCourseFormData(payload), {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrapData<Course>(response.data);
};

export const updateCourse = async (id: number, payload: CoursePayload) => {
    const formData = buildCourseFormData(payload);
    formData.append("_method", "PUT");
    const response = await axiosAPI.post(`/admin/courses/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return unwrapData<Course>(response.data);
};

export const deleteCourse = async (id: number) => {
    await axiosAPI.delete(`/admin/courses/${id}`);
};

export const getCourseCategories = async () => {
    const response = await axiosAPI.get("/course-categories");
    return unwrapData<CourseCategory[]>(response.data);
};

// Chapter API
export interface ChapterPayload {
    title: string;
    description?: string;
    order: number;
}

export const getChapters = async (courseId: number) => {
    const response = await axiosAPI.get(`/admin/courses/${courseId}/chapters`);
    return unwrapData<Chapter[]>(response.data);
};

export const createChapter = async (courseId: number, payload: ChapterPayload) => {
    const response = await axiosAPI.post(`/admin/courses/${courseId}/chapters`, payload);
    return unwrapData<Chapter>(response.data);
};

export const updateChapter = async (
    courseId: number,
    chapterId: number,
    payload: ChapterPayload
) => {
    const response = await axiosAPI.put(
        `/admin/courses/${courseId}/chapters/${chapterId}`,
        payload
    );
    return unwrapData<Chapter>(response.data);
};

export const deleteChapter = async (courseId: number, chapterId: number) => {
    await axiosAPI.delete(`/admin/courses/${courseId}/chapters/${chapterId}`);
};

// Lesson API
export interface LessonPayload {
    title: string;
    content?: string;
    order: number;
    is_free_preview: boolean;
    type: "video" | "text";
    video_url?: string | null;
}

export const getLessons = async (chapterId: number) => {
    const response = await axiosAPI.get(`/admin/chapters/${chapterId}/lessons`);
    return unwrapData<Lesson[]>(response.data);
};

export const createLesson = async (chapterId: number, payload: LessonPayload) => {
    const response = await axiosAPI.post(`/admin/chapters/${chapterId}/lessons`, payload);
    return unwrapData<Lesson>(response.data);
};

export const updateLesson = async (
    chapterId: number,
    lessonId: number,
    payload: LessonPayload
) => {
    const response = await axiosAPI.put(
        `/admin/chapters/${chapterId}/lessons/${lessonId}`,
        payload
    );
    return unwrapData<Lesson>(response.data);
};

export const deleteLesson = async (chapterId: number, lessonId: number) => {
    await axiosAPI.delete(`/admin/chapters/${chapterId}/lessons/${lessonId}`);
};

