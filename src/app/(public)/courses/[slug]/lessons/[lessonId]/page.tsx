"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
    ChevronLeft,
    ChevronRight,
    ArrowLeft,
    Menu,
    X,
    PanelRightClose,
    PanelRightOpen,
    CheckCircle2,
    LockKeyhole,
} from "lucide-react";
import {
    getCourseBySlug,
    getCourseChapters,
} from "@/api/courses";
import {
    getLessonWithStatus,
    learnLesson,
    saveProgress,
    getNextLesson,
    resumeLesson,
    unlockLesson,
    type LessonStatus,
} from "@/api/lesson";
import { checkPurchase } from "@/api/purchase";
import { Chapter, Course, Lesson } from "@/types/public/course";
import { notify } from "@/utils/toast";
import { PageLoading } from "@/components/common/LoadingScreen";
import LessonVideoPlayer from "@/components/public/courses/LessonVideoPlayer";
import LessonSidebar from "@/components/public/courses/LessonSidebar";
import LessonLockedModal from "@/components/public/courses/LessonLockedModal";
import { getLessonStatus, canViewLesson } from "@/utils/lessonHelpers";

export default function LessonReaderPage() {
    const params = useParams<{ slug: string; lessonId: string }>();
    const router = useRouter();
    const [course, setCourse] = useState<Course | null>(null);
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [lessonStatus, setLessonStatus] = useState<LessonStatus | null>(null);
    const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showSidebar, setShowSidebar] = useState(true);
    const [showLockedModal, setShowLockedModal] = useState(false);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [watchedSeconds, setWatchedSeconds] = useState(0);
    const [videoProgress, setVideoProgress] = useState(0);
    const [videoDuration, setVideoDuration] = useState(0);
    const [isLessonCompleted, setIsLessonCompleted] = useState(false);
    const [resumeTime, setResumeTime] = useState(0);
    const [coursePurchased, setCoursePurchased] = useState(false);

    // Get all lessons in order
    const allLessons = useMemo(() => {
        const lessons: Array<{ lesson: Lesson; chapter: Chapter }> = [];
        chapters.forEach((chapter) => {
            const sortedLessons = [...(chapter.lessons ?? [])].sort(
                (a, b) => a.order - b.order
            );
            sortedLessons.forEach((lesson) => {
                lessons.push({ lesson, chapter });
            });
        });
        return lessons;
    }, [chapters]);

    // Find current lesson index
    const currentIndex = useMemo(() => {
        return allLessons.findIndex(
            (item) => item.lesson.id === Number(params.lessonId)
        );
    }, [allLessons, params.lessonId]);

    // Get previous and next lessons
    const previousLesson = useMemo(() => {
        if (currentIndex > 0) {
            return allLessons[currentIndex - 1];
        }
        return null;
    }, [allLessons, currentIndex]);

    const nextLesson = useMemo(() => {
        if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
            return allLessons[currentIndex + 1];
        }
        return null;
    }, [allLessons, currentIndex]);

    // Build lessons status map using helper function
    const lessonsStatusMap = useMemo(() => {
        const statusMap: Record<number, any> = {};
        allLessons.forEach(({ lesson }) => {
            // Use local lesson data with default status based on is_free_preview
            statusMap[lesson.id] = {
                ...lesson,
                status: lesson.is_free_preview ? "unlocked" : "locked",
            };
        });

        // Update current lesson status from API using helper
        if (lessonStatus) {
            statusMap[lessonStatus.lesson.id] = {
                ...lessonStatus.lesson,
                status: getLessonStatus(lessonStatus),
                progress: lessonStatus.progress,
            };
        }

        return statusMap;
    }, [allLessons, lessonStatus]);

    // Load lesson data
    useEffect(() => {
        if (!params?.slug || !params?.lessonId) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [courseData, chaptersData] = await Promise.all([
                    getCourseBySlug(params.slug),
                    getCourseChapters(params.slug),
                ]);

                setCourse(courseData);
                setChapters(chaptersData);


                // Build allLessons for this course
                const lessonsList: Array<{ lesson: Lesson; chapter: Chapter }> = [];
                chaptersData.forEach((chapter) => {
                    const sortedLessons = [...(chapter.lessons ?? [])].sort(
                        (a, b) => a.order - b.order
                    );
                    sortedLessons.forEach((lesson) => {
                        lessonsList.push({ lesson, chapter });
                    });
                });

                // Find current lesson locally
                const lessonId = Number(params.lessonId);
                let foundLesson: Lesson | undefined;
                let foundChapter: Chapter | undefined;

                for (const chapter of chaptersData) {
                    const lesson = chapter.lessons?.find((l) => l.id === lessonId);
                    if (lesson) {
                        foundLesson = lesson;
                        foundChapter = chapter;
                        break;
                    }
                }

                if (!foundLesson) {
                    notify.error("Lesson not found.");
                    router.push(`/courses/${params.slug}`);
                    return;
                }

                setCurrentChapter(foundChapter ?? null);

                // Get lesson status from API (this will return is_free_preview from backend)
                try {
                    const status = await getLessonWithStatus(params.slug, lessonId);

                    // Use helper function to determine status based on is_free_preview
                    const lessonStatusValue = getLessonStatus(status);
                    const canView = canViewLesson(status);

                    // Update lessonStatus
                    setLessonStatus(status);

                    // For video lessons, progress is watched_seconds in seconds
                    // For text lessons, progress is scroll_percent (0-100)
                    const progressValue = status.progress || 0;
                    if (status.lesson.type === "video") {
                        setWatchedSeconds(progressValue);
                        // Calculate percentage when duration is available
                        // For now, we'll update it from the video player
                    } else {
                        setVideoProgress(progressValue);
                    }

                    // Check if lesson is already completed from API response
                    setIsLessonCompleted(status.is_completed === true);

                    // If lesson is locked (is_free_preview = false), show modal and redirect to course
                    if (!canView || lessonStatusValue === "locked") {
                        setShowLockedModal(true);
                        // Redirect to course detail page to purchase
                        setTimeout(() => {
                            router.push(`/courses/${params.slug}`);
                        }, 2000);
                        return;
                    }

                    // If lesson can be viewed (is_free_preview = true), mark as learned
                    if (canView) {
                        try {
                            await learnLesson(params.slug, lessonId);
                        } catch (error) {
                            console.error("Failed to mark lesson as learned:", error);
                        }
                    }

                    // Get resume time for video lessons
                    if (status.lesson.type === "video" && status.progress && status.progress > 0) {
                        try {
                            const resumeData = await resumeLesson(lessonId);
                            setResumeTime(resumeData.resume_time || 0);
                            // Update watched seconds from resume data
                            if (resumeData.resume_time) {
                                setWatchedSeconds(resumeData.resume_time);
                            }
                        } catch (error) {
                            console.error("Failed to get resume time:", error);
                        }
                    }
                } catch (error: any) {
                    console.error("Failed to load lesson status:", error);
                    if (error.response?.status === 403 || error.response?.status === 401) {
                        setShowLockedModal(true);
                        // Redirect to course detail page to purchase
                        setTimeout(() => {
                            router.push(`/courses/${params.slug}`);
                        }, 2000);
                    } else {
                        notify.error("Failed to load lesson status.");
                    }
                }
            } catch (error) {
                console.error(error);
                notify.error("Failed to load lesson.");
                router.push(`/courses/${params.slug}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [params?.slug, params?.lessonId, router]);

    // Handle lesson click (when locked)
    const handleLessonClick = useCallback(
        async (lessonId: number) => {
            // Try to unlock first
            setIsUnlocking(true);
            try {
                const result = await unlockLesson(lessonId);
                if (result.unlocked) {
                    notify.success(result.message || "Lesson unlocked successfully");
                    // Reload page
                    router.push(`/courses/${params.slug}/lessons/${lessonId}`);
                } else {
                    setShowLockedModal(true);
                }
            } catch (error: any) {
                console.error("Failed to unlock lesson:", error);
                if (error.response?.status === 403) {
                    setShowLockedModal(true);
                } else {
                    notify.error(error.response?.data?.message || "Failed to unlock lesson");
                }
            } finally {
                setIsUnlocking(false);
            }
        },
        [params.slug, router]
    );

    // Handle progress update
    // QUAN TRỌNG: watchedSeconds là số giây đã xem THẬT (không tính tua)
    // Component đã debounce việc gọi API, nên hàm này chỉ được gọi mỗi 2 giây
    // Backend tự tính percentage và đánh dấu completed (>= 50% cho video)
    const handleProgressUpdate = useCallback(
        async (watchedSeconds: number, percentage: number) => {
            setWatchedSeconds(watchedSeconds);
            setVideoProgress(percentage);

            try {
                // CHỈ gửi watched_seconds lên backend (integer)
                // Backend sẽ tự clamp và tính percentage
                const response = await saveProgress(Number(params.lessonId), {
                    watched_seconds: watchedSeconds
                });

                // Backend đánh dấu completed khi >= 50% (cho video)
                if (response.is_completed && !isLessonCompleted) {
                    setIsLessonCompleted(true);

                    // Update lesson status
                    if (lessonStatus) {
                        setLessonStatus({
                            ...lessonStatus,
                            progress: watchedSeconds,
                            is_completed: true,
                        });
                    }

                    notify.success("Bài học đã hoàn thành!");
                }
            } catch (error) {
                console.error("Failed to save progress:", error);
                // Không hiển thị lỗi để tránh làm phiền người dùng
            }
        },
        [params.lessonId, isLessonCompleted, lessonStatus]
    );

    // Handle next lesson navigation
    const handleNextLesson = useCallback(async () => {
        if (!lessonStatus) return;

        try {
            // Try to get next lesson from API
            const next = await getNextLesson(Number(params.lessonId));
            if (next) {
                router.push(`/courses/${next.course_slug || params.slug}/lessons/${next.id}`);
                return;
            }

            // Fallback to local next lesson
            if (nextLesson) {
                router.push(`/courses/${params.slug}/lessons/${nextLesson.lesson.id}`);
            } else {
                // Course completed
                notify.success("Chúc mừng! Bạn đã hoàn thành khóa học!");
                router.push(`/courses/${params.slug}`);
            }
        } catch (error) {
            console.error("Failed to get next lesson:", error);
            // Fallback to local navigation
            if (nextLesson) {
                router.push(`/courses/${params.slug}/lessons/${nextLesson.lesson.id}`);
            }
        }
    }, [params.slug, params.lessonId, lessonStatus, nextLesson, router]);

    if (isLoading) {
        return <PageLoading text="Đang tải bài học..." />;
    }

    if (!course || !lessonStatus || !currentChapter) {
        return (
            <div className="mx-auto max-w-4xl px-4 py-12">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Bài học không tồn tại</h1>
                    <p className="mt-2 text-gray-600">
                        Bài học mà bạn đang tìm kiếm không tồn tại.
                    </p>
                    <Link
                        href={`/courses/${params.slug}`}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Quay lại khóa học
                    </Link>
                </div>
            </div>
        );
    }

    const currentLesson = lessonStatus.lesson;
    const lessonStatusValue = getLessonStatus(lessonStatus);
    const isLocked = lessonStatusValue === "locked";
    const isCompleted = lessonStatusValue === "completed";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="border-b border-gray-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-1 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href={`/courses/${params.slug}`}
                                className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Quay lại khóa học
                            </Link>
                            <div className="h-4 w-px bg-gray-300" />
                            <div>
                                <Link
                                    href={`/courses/${params.slug}`}
                                    className="text-sm font-medium text-gray-900 hover:text-blue-600"
                                >
                                    {course.title}
                                </Link>
                                <p className="text-xs text-gray-500">
                                    Chương {currentChapter.order}: {currentChapter.title}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-gray-500">
                                Bài học thứ {currentIndex + 1} trên tổng số {allLessons.length}
                            </div>
                            {videoProgress > 0 && (
                                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                                    <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
                                        <div
                                            className="h-full bg-blue-600 transition-all duration-300"
                                            style={{ width: `${videoProgress}%` }}
                                        />
                                    </div>
                                    <span className="font-medium">{Math.round(videoProgress)}%</span>
                                </div>
                            )}
                            <button
                                onClick={() => setShowSidebar(!showSidebar)}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                                aria-label={showSidebar ? "Ẩn sidebar" : "Hiển thị sidebar"}
                            >
                                {showSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto min-w-7xl px-4 py-2 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Main Content */}
                    <div
                        className={`${showSidebar ? "lg:w-2/3" : "lg:w-full lg:max-w-7xl lg:mx-auto"
                            } transition-all duration-300`}
                    >
                        <div className="space-y-6">
                            {/* Lesson Title */}
                            <div className="mb-2">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h1 className="font-semibold text-gray-900 text-xl">
                                            {currentLesson.title}
                                        </h1>
                                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1.5">
                                                <span>
                                                    Chương {currentChapter.order}:{" "}
                                                    {currentChapter.title}
                                                </span>
                                            </div>
                                            {currentLesson.is_free_preview && (
                                                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                                    Xem trước
                                                </span>
                                            )}
                                            {isCompleted && (
                                                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                                    <CheckCircle2 className="h-3 w-3" />
                                                    Đã hoàn thành
                                                </span>
                                            )}
                                            {isLocked && (
                                                <span className="flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                                                    <LockKeyhole className="h-3 w-3" />
                                                    Đã khóa
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Video Player or Locked Message */}
                            {isLocked ? (
                                <div className="rounded-xl border border-gray-200 bg-white p-12 shadow-sm text-center">
                                    <LockKeyhole className="mx-auto h-16 w-16 text-gray-400" />
                                    <h2 className="mt-4 text-xl font-semibold text-gray-900">
                                        Bài học này đã bị khóa
                                    </h2>
                                    <p className="mt-2 text-gray-600">
                                        Bài học này chỉ xem được khi bạn mua khóa học.
                                    </p>
                                    <button
                                        onClick={() => setShowLockedModal(true)}
                                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                                    >
                                        Mua khóa học ngay
                                    </button>
                                </div>
                            ) : currentLesson.type === "video" &&
                                currentLesson.video_url ? (
                                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                    <LessonVideoPlayer
                                        videoUrl={currentLesson.video_url}
                                        title={currentLesson.title}
                                        lessonId={currentLesson.id}
                                        initialWatchedSeconds={watchedSeconds || resumeTime}
                                        videoDuration={videoDuration}
                                        isCompleted={isLessonCompleted}
                                        onProgress={handleProgressUpdate}
                                    />
                                </div>
                            ) : (
                                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <p className="text-gray-500">Video không khả dụng.</p>
                                </div>
                            )}

                            {/* Lesson Content */}
                            {!isLocked && currentLesson.content && (
                                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                    <h2 className="mb-4 text-lg font-semibold text-gray-900">
                                        Nội dung bài học
                                    </h2>
                                    <div
                                        className="prose prose-sm max-w-none text-gray-700"
                                        dangerouslySetInnerHTML={{ __html: currentLesson.content }}
                                    />
                                </div>
                            )}

                            {/* Navigation */}
                            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                                {previousLesson ? (
                                    <Link
                                        href={`/courses/${params.slug}/lessons/${previousLesson.lesson.id}`}
                                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Bài học trước
                                    </Link>
                                ) : (
                                    <div />
                                )}

                                <div className="flex items-center gap-3">
                                    {isLessonCompleted && (
                                        <button
                                            onClick={handleNextLesson}
                                            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
                                        >
                                            Tiếp tục bài học tiếp theo
                                            <ChevronRight className="h-4 w-4" />
                                        </button>
                                    )}
                                    {nextLesson && !isLessonCompleted && (
                                        <Link
                                            href={`/courses/${params.slug}/lessons/${nextLesson.lesson.id}`}
                                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                        >
                                            Bài học tiếp theo
                                            <ChevronRight className="h-4 w-4" />
                                        </Link>
                                    )}
                                    {!nextLesson && !isLessonCompleted && (
                                        <Link
                                            href={`/courses/${params.slug}`}
                                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                                        >
                                            Hoàn thành khóa học
                                            <ChevronRight className="h-4 w-4" />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Course Content */}
                    {showSidebar && (
                        <div className="lg:w-1/3 transition-all duration-300">
                            <div className="sticky top-8 h-[calc(100vh-120px)]">
                                <LessonSidebar
                                    chapters={chapters}
                                    courseSlug={params.slug}
                                    currentLessonId={currentLesson.id}
                                    lessonsStatus={lessonsStatusMap}
                                    onLessonClick={handleLessonClick}
                                    course={course}
                                    coursePurchased={coursePurchased}
                                    onClose={() => setShowSidebar(false)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Floating button to show sidebar when hidden */}
                    {!showSidebar && (
                        <button
                            onClick={() => setShowSidebar(true)}
                            className="hidden lg:flex fixed right-4 top-1/2 transform -translate-y-1/2 z-10 items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600 transition-all"
                            aria-label="Hiển thị sidebar"
                        >
                            <PanelRightOpen className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Locked Modal */}
            <LessonLockedModal
                isOpen={showLockedModal}
                onClose={() => setShowLockedModal(false)}
                lessonTitle={currentLesson.title}
                courseSlug={params.slug}
                courseTitle={course.title}
                onPurchase={() => {
                    setShowLockedModal(false);
                    router.push(`/courses/${params.slug}`);
                }}
            />
        </div>
    );
}
