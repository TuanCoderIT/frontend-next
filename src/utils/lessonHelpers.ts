import { LessonStatus } from "@/api/lesson";

/**
 * Chuyển LessonStatus từ backend sang trạng thái hiển thị trên frontend
 * Logic:
 * - Nếu is_completed = true → completed (backend đã kiểm tra >= 50% watched)
 * - Nếu is_free_preview = true → unlocked
 * - Nếu is_free_preview = false → locked
 */
export const getLessonStatus = (lessonStatus: LessonStatus): "locked" | "unlocked" | "completed" => {
    // Check if lesson is completed (backend marks as completed when >= 50% watched)
    if (lessonStatus.is_completed === true) {
        return "completed";
    }

    // Check based on is_free_preview from lesson object
    // If is_free_preview = true → unlocked
    // If is_free_preview = false → locked
    return lessonStatus.lesson.is_free_preview ? "unlocked" : "locked";
};

/**
 * Chuyển danh sách LessonStatus sang danh sách kèm trạng thái
 */
export const mapLessonsWithStatus = (lessons: LessonStatus[]) =>
    lessons.map((ls) => ({
        ...ls,
        status: getLessonStatus(ls),
    }));

/**
 * Check if lesson can be viewed based on is_free_preview
 */
export const canViewLesson = (lessonStatus: LessonStatus): boolean => {
    const status = getLessonStatus(lessonStatus);
    return status !== "locked";
};

