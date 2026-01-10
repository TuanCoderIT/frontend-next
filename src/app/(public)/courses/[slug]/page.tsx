"use client";

import { useEffect, useMemo, useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getCourseBySlug, getCourseChapters } from "@/api/courses";
import { getCourseProgress } from "@/api/lesson";
import { checkPurchase, purchaseItem } from "@/api/purchase";
import { Chapter, Course, Lesson } from "@/types/public/course";
import { ChevronDown, ChevronRight, PlayCircle, LockKeyhole, Star, Clock, CheckCircle2, ShoppingCart, Coins } from "lucide-react";
import { notify } from "@/utils/toast";
import { getImageUrl } from "@/utils/imageUtils";
import { useAuth } from "@/context/AuthContext";

const fallbackThumbnail =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzc2IiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDM3NiAyNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iMCIgd2lkdGg9IjM3NiIgaGVpZ2h0PSIyNDAiIGZpbGw9IiNFRUYzRjciLz48cGF0aCBkPSJNMTQ0LjE2IDE1OC41YzAtNy41NjcgNi4xMzMtMTMuNyAxMy43LTEzLjdoNDQuMjhjNy41NjcgMCAxMy43IDYuMTMzIDEzLjcgMTMuN3YxMC45NmMwIDQuMDY5LTMuMjk2IDcuMzcxLTcuMzY2IDcuMzcxSDIxMS4yMnYxMC4xNEMyMTEuMjIgMTgzLjYzIDE5Ny44NSA0MiAxODguMzggNDJjLTkuNDc0IDAtMjIuODQgMTQxLjYzLTEyLjg4IDEzNC4zNkgxNTEuNTJsLTcuMzY2IDBjLTQuMDc0IDAtNy4zNjYtMy4zLTcuMzY2LTcuMzd2LTEwLjk2ek0xNjQuMTEgMTA0LjEzYy03LjU2NyAwLTEzLjctNi4xMzMtMTMuNy0xMy43LDAtNy41NjcgNi4xMzMtMTMuNyAxMy43LTEzLjdoNDQuMjhjNy41NjcgMCAxMy43IDYuMTMzIDEzLjcgMTMuNyAwIDcuNTY3LTYuMTMzIDEzLjctMTMuNyAxMy43aC00NC4yOHoiIGZpbGw9IiNDRUQ3RUIiLz48L3N2Zz4=";

export default function CourseDetailPage() {
    const params = useParams<{ slug: string }>();
    const router = useRouter();
    const { user } = useAuth();
    const [course, setCourse] = useState<Course | null>(null);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openChapters, setOpenChapters] = useState<Record<number, boolean>>({});
    const [courseProgress, setCourseProgress] = useState<{
        progress: number;
        completed_lessons: number;
        total_lessons: number;
        last_lesson_id?: number;
        last_lesson_title?: string;
    } | null>(null);
    const [coursePurchased, setCoursePurchased] = useState(false);
    const [isPurchasing, setIsPurchasing] = useState(false);

    useEffect(() => {
        if (!params?.slug) return;
        const fetchCourse = async () => {
            setIsLoading(true);
            try {
                const [courseData, chaptersData] = await Promise.all([
                    getCourseBySlug(params.slug),
                    getCourseChapters(params.slug),
                ]);
                console.log("Course data:", courseData);
                console.log("Course thumbnail:", courseData.thumbnail);
                setCourse(courseData);
                setChapters(chaptersData);

                // Check if course is purchased (if course is paid)
                const isCourseFree = !courseData.price_token || courseData.price_token === 0;
                let purchased = false;

                if (!isCourseFree) {
                    try {
                        const purchaseCheck = await checkPurchase("course", courseData.id);
                        purchased = purchaseCheck.purchased || false;
                        courseData.purchased = purchased;
                    } catch (error) {
                        console.error("Failed to check purchase:", error);
                        purchased = false;
                    }
                } else {
                    // Free course → automatically "purchased"
                    purchased = true;
                    courseData.purchased = true;
                }
                setCoursePurchased(purchased);

                // Open first chapter by default
                const initialOpen: Record<number, boolean> = {};
                if (chaptersData.length > 0) {
                    initialOpen[chaptersData[0].id] = true;
                }
                setOpenChapters(initialOpen);

                // Fetch course progress
                try {
                    const progress = await getCourseProgress(params.slug);
                    setCourseProgress(progress);
                } catch (error) {
                    // Progress might not be available (user not logged in or hasn't started)
                    console.log("Course progress not available:", error);
                }
            } catch (error) {
                console.error(error);
                notify.error("Course not found.");
                router.push("/courses");
            } finally {
                setIsLoading(false);
            }
        };
        fetchCourse();
    }, [params?.slug, router]);

    const lessonsCount = useMemo(
        () =>
            chapters.reduce(
                (sum, chapter) => sum + (chapter.lessons?.length ?? 0),
                0
            ),
        [chapters]
    );

    // Get all lessons in order for navigation
    const allLessons = useMemo(() => {
        const lessons: Array<{ lesson: Lesson; chapter: Chapter }> = [];
        chapters.forEach((chapter) => {
            const sortedLessons = [...(chapter.lessons ?? [])].sort((a, b) => a.order - b.order);
            sortedLessons.forEach((lesson) => {
                lessons.push({ lesson, chapter });
            });
        });
        return lessons;
    }, [chapters]);

    const toggleChapter = (chapterId: number) => {
        setOpenChapters((prev) => ({ ...prev, [chapterId]: !prev[chapterId] }));
    };

    // Handle course purchase
    const handlePurchaseCourse = async () => {
        if (!user) {
            notify.error("Bạn cần đăng nhập để đăng ký khóa học");
            router.push(`/auth/login?redirect=/courses/${params.slug}`);
            return;
        }

        if (!course) return;

        try {
            setIsPurchasing(true);
            const res = await purchaseItem("course", course.id);
            notify.success(res.message || "Đăng ký khóa học thành công!");
            setCoursePurchased(true);
            if (course) {
                course.purchased = true;
            }
        } catch (err: any) {
            if (err.response?.status === 400) {
                notify.error("Không đủ tokens. Vui lòng nạp thêm.");
                router.push("/wallet/payment");
            } else {
                notify.error(err.response?.data?.message || "Đăng ký khóa học thất bại");
            }
        } finally {
            setIsPurchasing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="h-7 w-1/2 animate-pulse rounded bg-slate-200" />
                        <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-slate-200" />
                        <div className="mt-4 h-56 w-full animate-pulse rounded-xl bg-slate-200" />
                        <div className="mt-6 space-y-2">
                            <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
                            <div className="h-3 w-5/6 animate-pulse rounded bg-slate-200" />
                            <div className="h-3 w-4/6 animate-pulse rounded bg-slate-200" />
                        </div>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="h-5 w-1/3 animate-pulse rounded bg-slate-200" />
                        <div className="mt-4 space-y-3">
                            {Array.from({ length: 4 }).map((_, idx) => (
                                <div key={idx} className="h-10 w-full animate-pulse rounded-xl bg-slate-200" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!course) return null;

    return (
        <div className="bg-slate-50/60 pb-16">
            <section className="bg-gradient-to-br from-blue-50 via-slate-50 to-white">
                <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {course.title}
                                    </h1>
                                    <p className="mt-1 text-sm text-gray-600">
                                        By {course.instructor?.name ?? "Unknown instructor"}
                                    </p>
                                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-4 w-4" />
                                            <span>{chapters.length} chương</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <PlayCircle className="h-4 w-4" />
                                            <span>{lessonsCount} bài học</span>
                                        </div>
                                        {course.price_token && course.price_token > 0 && (
                                            <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
                                                <Coins className="h-3.5 w-3.5" />
                                                <span>{course.price_token} tokens</span>
                                            </div>
                                        )}
                                        {courseProgress && courseProgress.total_lessons > 0 && (
                                            <div className="flex items-center gap-1.5">
                                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                                <span>
                                                    {courseProgress.completed_lessons}/
                                                    {courseProgress.total_lessons} đã hoàn thành
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {courseProgress && courseProgress.progress > 0 && (
                                        <div className="mt-4 space-y-2">
                                            <div className="flex items-center justify-between text-sm text-gray-600">
                                                <span className="font-medium">Tiến độ khóa học</span>
                                                <span className="font-semibold text-blue-600">
                                                    {Math.round(courseProgress.progress)}%
                                                </span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                                <div
                                                    className="h-full bg-blue-600 transition-all duration-300"
                                                    style={{ width: `${courseProgress.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="relative mt-5 h-56 w-full overflow-hidden rounded-xl bg-slate-100 sm:h-72">
                                {course.thumbnail ? (
                                    <Image
                                        src={getImageUrl(course.thumbnail)}
                                        alt={course.title}
                                        fill
                                        className="object-cover"
                                        onError={(e) => {
                                            console.error("Image load error:", e);
                                            console.error("Thumbnail URL:", getImageUrl(course.thumbnail));
                                        }}
                                        unoptimized
                                    />
                                ) : (
                                    <Image
                                        src={fallbackThumbnail}
                                        alt={course.title}
                                        fill
                                        className="object-cover"
                                    />
                                )}
                            </div>

                            {course.description && (
                                <div className="prose prose-sm mt-6 max-w-none text-gray-700">
                                    <p className="leading-relaxed">{course.description}</p>
                                </div>
                            )}
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Nội dung khóa học
                            </h2>
                            <div className="mt-4 space-y-2">
                                {chapters.length === 0 && (
                                    <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
                                        Không có chương nào khả dụng.
                                    </div>
                                )}

                                {chapters
                                    .sort((a, b) => a.order - b.order)
                                    .map((chapter) => {
                                        const isOpen = openChapters[chapter.id];
                                        const sortedLessons = [...(chapter.lessons ?? [])].sort(
                                            (a, b) => a.order - b.order
                                        );
                                        return (
                                            <div
                                                key={chapter.id}
                                                className="overflow-hidden rounded-xl border border-gray-200 transition hover:border-gray-300"
                                            >
                                                <button
                                                    className="flex w-full items-center justify-between gap-3 bg-slate-50 px-4 py-3 text-left transition hover:bg-slate-100"
                                                    onClick={() => toggleChapter(chapter.id)}
                                                    aria-expanded={isOpen}
                                                >
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                                                                {chapter.order}
                                                            </span>
                                                            <p className="font-medium text-gray-900">
                                                                {chapter.title}
                                                            </p>
                                                        </div>
                                                        {chapter.description && (
                                                            <p className="mt-1 text-xs text-gray-500 line-clamp-1">
                                                                {chapter.description}
                                                            </p>
                                                        )}
                                                        <p className="mt-1 text-xs text-gray-400">
                                                            {sortedLessons.length}{" "}
                                                            {sortedLessons.length === 1 ? "lesson" : "lessons"}
                                                        </p>
                                                    </div>
                                                    {isOpen ? (
                                                        <ChevronDown className="h-5 w-5 flex-shrink-0 text-gray-400" />
                                                    ) : (
                                                        <ChevronRight className="h-5 w-5 flex-shrink-0 text-gray-400" />
                                                    )}
                                                </button>

                                                {isOpen && (
                                                    <div className="divide-y divide-gray-100 bg-white">
                                                        {sortedLessons.length === 0 && (
                                                            <div className="px-4 py-3 text-xs text-gray-500">
                                                                Không có bài học nào.
                                                            </div>
                                                        )}
                                                        {sortedLessons.map((lesson) => {
                                                            return (
                                                                <LessonRow
                                                                    key={lesson.id}
                                                                    lesson={lesson}
                                                                    courseSlug={params.slug}
                                                                    chapterId={chapter.id}
                                                                    courseProgress={courseProgress}
                                                                    course={course}
                                                                    coursePurchased={coursePurchased}
                                                                />
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                            </div>

                            {allLessons.length > 0 && (
                                <div className="mt-6 space-y-3">
                                    {/* If course is paid and not purchased, show purchase button */}
                                    {course?.price_token && course.price_token > 0 && !coursePurchased ? (
                                        <button
                                            onClick={handlePurchaseCourse}
                                            disabled={isPurchasing}
                                            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ShoppingCart className="h-5 w-5" />
                                            {isPurchasing ? "Đang xử lý..." : `Đăng ký học (${course.price_token} tokens)`}
                                        </button>
                                    ) : (
                                        <>
                                            {/* Only show Start/Continue Learning if purchased or free course */}
                                            {courseProgress && courseProgress.last_lesson_id ? (
                                                <Link
                                                    href={`/courses/${params.slug}/lessons/${courseProgress.last_lesson_id}`}
                                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                                                >
                                                    <PlayCircle className="h-5 w-5" />
                                                    Tiếp tục học
                                                    {courseProgress.last_lesson_title && (
                                                        <span className="text-xs opacity-90">
                                                            ({courseProgress.last_lesson_title})
                                                        </span>
                                                    )}
                                                </Link>
                                            ) : (
                                                <Link
                                                    href={`/courses/${params.slug}/lessons/${allLessons[0].lesson.id}`}
                                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                                                >
                                                    <PlayCircle className="h-5 w-5" />
                                                    Bắt đầu học
                                                </Link>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

function LessonRow({
    lesson,
    courseSlug,
    chapterId,
    courseProgress,
    course,
    coursePurchased,
}: {
    lesson: Lesson;
    courseSlug: string;
    chapterId: number;
    courseProgress?: {
        progress: number;
        completed_lessons: number;
        total_lessons: number;
        last_lesson_id?: number;
    } | null;
    course?: Course | null;
    coursePurchased?: boolean;
}) {
    const lessonUrl = `/courses/${courseSlug}/lessons/${lesson.id}`;
    const isLastLearned = courseProgress?.last_lesson_id === lesson.id;

    // Check if lesson is unlocked based on is_free_preview
    // If course is paid and not purchased, only lessons with is_free_preview = true can be accessed
    // After purchase, all lessons can be accessed
    const isCourseFree = !course?.price_token || course.price_token === 0;
    const isUnlocked = isCourseFree || coursePurchased || lesson.is_free_preview;

    // If lesson is locked, show locked UI
    if (!isUnlocked) {
        return (
            <div className={`flex items-center justify-between px-4 py-3 text-sm cursor-not-allowed ${isLastLearned ? "bg-blue-50 border-l-4 border-blue-600" : "opacity-60"
                }`}>
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <LockKeyhole className="h-5 w-5 flex-shrink-0 text-gray-400" />
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-400">
                                {lesson.order}
                            </span>
                            <span className="truncate font-medium text-gray-900">
                                {lesson.title}
                            </span>
                            {isLastLearned && (
                                <span className="text-xs text-blue-600 font-medium">
                                    (Đang học)
                                </span>
                            )}
                        </div>
                        {lesson.type === "video" && lesson.video_url && (
                            <p className="mt-0.5 text-xs text-gray-500">Bài học video</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <LockKeyhole className="h-4 w-4 text-gray-400" />
                </div>
            </div>
        );
    }

    // Lesson is unlocked - but check if user can access it
    // If course is paid and not purchased, redirect to course detail to purchase
    const handleLessonClick = (e: React.MouseEvent) => {
        const isCourseFree = !course?.price_token || course.price_token === 0;

        // If course is paid and not purchased, and lesson is not free preview
        if (!isCourseFree && !coursePurchased && !lesson.is_free_preview) {
            e.preventDefault();
            notify.error("Bạn cần đăng ký khóa học để xem bài học này");
            // Scroll to purchase button or show modal
            return;
        }
    };

    // Lesson is unlocked
    return (
        <Link
            href={lessonUrl}
            onClick={handleLessonClick}
            className={`flex items-center justify-between px-4 py-3 text-sm transition cursor-pointer ${isLastLearned
                ? "bg-blue-50 border-l-4 border-blue-600 hover:bg-blue-100"
                : "hover:bg-blue-50"
                }`}
        >
            <div className="flex min-w-0 flex-1 items-center gap-3">
                {lesson.type === "video" ? (
                    <PlayCircle className="h-5 w-5 flex-shrink-0 text-blue-600" />
                ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-blue-600" />
                )}
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-gray-400">
                            {lesson.order}
                        </span>
                        <span className="truncate font-medium text-gray-900">
                            {lesson.title}
                        </span>
                        {isLastLearned && (
                            <span className="text-xs text-blue-600 font-medium">
                                (Đang học)
                            </span>
                        )}
                    </div>
                    {lesson.type === "video" && lesson.video_url && (
                        <p className="mt-0.5 text-xs text-gray-500">Bài học video</p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                {lesson.is_free_preview && (
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        Xem trước
                    </span>
                )}
            </div>
        </Link>
    );
}
