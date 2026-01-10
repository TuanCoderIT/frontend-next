import Link from "next/link";
import Image from "next/image";
import { BookOpen, UserRound, PlayCircle, ArrowRight, Coins } from "lucide-react";
import { Course } from "@/types/public/course";
import { getImageUrl } from "@/utils/imageUtils";

interface CourseCardProps {
    course: Course;
    actionLabel?: string;
}

const fallbackThumbnail =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzc2IiBoZWlnaHQ9IjI0MCIgdmlld0JveD0iMCAwIDM3NiAyNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3QgeD0iMCIgd2lkdGg9IjM3NiIgaGVpZ2h0PSIyNDAiIGZpbGw9IiNFRUYzRjciLz48cGF0aCBkPSJNMTQ0LjE2IDE1OC41YzAtNy41NjcgNi4xMzMtMTMuNyAxMy43LTEzLjdoNDQuMjhjNy41NjcgMCAxMy43IDYuMTMzIDEzLjcgMTMuN3YxMC45NmMwIDQuMDY5LTMuMjk2IDcuMzcxLTcuMzY2IDcuMzcxSDIxMS4yMnYxMC4xNEMyMTEuMjIgMTgzLjYzIDE5Ny44NSA0MiAxODguMzggNDJjLTkuNDc0IDAtMjIuODQgMTQxLjYzLTEyLjg4IDEzNC4zNkgxNTEuNTJsLTcuMzY2IDBjLTQuMDc0IDAtNy4zNjYtMy4zLTcuMzY2LTcuMzd2LTEwLjk2ek0xNjQuMTEgMTA0LjEzYy03LjU2NyAwLTEzLjctNi4xMzMtMTMuNy0xMy43LDAtNy41NjcgNi4xMzMtMTMuNyAxMy43LTEzLjdoNDQuMjhjNy41NjcgMCAxMy43IDYuMTMzIDEzLjcgMTMuNyAwIDcuNTY3LTYuMTMzIDEzLjctMTMuNyAxMy43aC00NC4yOHoiIGZpbGw9IiNDRUQ3RUIiLz48L3N2Zz4=";

export default function CourseCard({ course, actionLabel }: CourseCardProps) {
    const lessonsCount = course.chapters?.reduce(
        (total, chapter) => total + (chapter.lessons?.length ?? 0),
        0
    );

    return (
        <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <Image
                    src={course.thumbnail ? getImageUrl(course.thumbnail) : fallbackThumbnail}
                    alt={course.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                />
                {course.category && (
                    <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 backdrop-blur">
                        <BookOpen className="mr-1.5 h-3.5 w-3.5" />
                        {course.category.name}
                    </span>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-4 px-5 py-6">
                <div className="space-y-2">
                    <h3 className="line-clamp-2 text-lg font-semibold text-gray-900 transition-colors group-hover:text-blue-600">
                        {course.title}
                    </h3>
                    {course.description && (
                        <p className="line-clamp-2 text-sm text-gray-500">
                            {course.description}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 font-medium text-gray-600">
                        <UserRound className="h-3.5 w-3.5" />
                        {course.instructor?.name}
                    </div>
                    {/* <div className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-600">
                        <PlayCircle className="h-3.5 w-3.5" />
                        {lessonsCount ?? 0} lesson{(lessonsCount ?? 0) === 1 ? "" : "s"}
                    </div> */}
                </div>

                {course.price_token && course.price_token > 0 && (
                    <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
                        <Coins className="h-3.5 w-3.5" />
                        {course.price_token} tokens
                    </div>
                )}

                <div className="mt-auto">
                    <Link
                        href={`/courses/${course.slug}`}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                    >
                        <ArrowRight className="h-4 w-4" />
                        {actionLabel ?? "View course"}
                    </Link>
                </div>
            </div>
        </div>
    );
}

