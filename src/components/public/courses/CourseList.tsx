import { Course } from "@/types/public/course";
import CourseCard from "./CourseCard";

interface CourseListProps {
    courses: Course[];
    isLoading?: boolean;
    actionLabel?: string;
    emptyState?: {
        title: string;
        description?: string;
    };
}

const skeletons = Array.from({ length: 6 });

export default function CourseList({
    courses,
    isLoading = false,
    actionLabel,
    emptyState = {
        title: "Không có khóa học nào có sẵn",
        description: "Khóa học sẽ hiển thị ở đây khi chúng được xuất bản.",
    },
}: CourseListProps) {
    return (
        <div className="space-y-6">
            {isLoading ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {skeletons.map((_, index) => (
                        <div
                            key={`skeleton-${index}`}
                            className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                        >
                            <div className="h-48 w-full animate-pulse bg-slate-200" />
                            <div className="flex flex-1 flex-col gap-4 px-5 py-6">
                                <div className="space-y-2">
                                    <div className="h-4 w-3/5 animate-pulse rounded bg-slate-200" />
                                    <div className="h-3 w-full animate-pulse rounded bg-slate-200" />
                                    <div className="h-3 w-4/5 animate-pulse rounded bg-slate-200" />
                                </div>
                                <div className="mt-auto">
                                    <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : courses.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {courses.map((course) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            actionLabel={actionLabel}
                        />
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-8 py-16 text-center shadow-sm">
                    <p className="text-base font-semibold text-gray-800">
                        {emptyState.title}
                    </p>
                    {emptyState.description && (
                        <p className="mt-2 text-sm text-gray-500">
                            {emptyState.description}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

