export interface Lesson {
    id: number;
    chapter_id: number;
    title: string;
    content?: string | null;
    order: number;
    is_free_preview: boolean;
    type: "video" | "text";
    video_url?: string | null;
    created_at: string;
    updated_at: string;
}

export interface Chapter {
    id: number;
    course_id: number;
    title: string;
    description?: string | null;
    order: number;
    created_at: string;
    updated_at: string;
    lessons?: Lesson[];
}

export interface Course {
    id: number;
    user_id: number;
    category_id?: number | null;
    title: string;
    slug: string;
    description?: string | null;
    thumbnail?: string | null;
    is_public: boolean;
    price_token: number | null;
    purchased?: boolean;
    created_at: string;
    updated_at: string;
    chapters?: Chapter[];
    instructor?: { id: number; name: string; email: string };
    category: CourseCategory;
}

export interface CourseCategory {
    id: number;
    name: string;
}

