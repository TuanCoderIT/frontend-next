"use client";

import { X, LockKeyhole, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

interface LessonLockedModalProps {
    isOpen: boolean;
    onClose: () => void;
    lessonTitle: string;
    courseSlug: string;
    courseTitle?: string;
    onPurchase?: () => void;
}

export default function LessonLockedModal({
    isOpen,
    onClose,
    lessonTitle,
    courseSlug,
    courseTitle,
    onPurchase,
}: LessonLockedModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    const handlePurchase = () => {
        onPurchase?.();
        // Navigate to course page to purchase
        router.push(`/courses/${courseSlug}`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Content */}
                <div className="p-6">
                    {/* Icon */}
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                        <LockKeyhole className="h-8 w-8 text-red-600" />
                    </div>

                    {/* Title */}
                    <h2 className="mb-2 text-center text-xl font-bold text-gray-900">
                        Bài học này đã bị khóa
                    </h2>

                    {/* Description */}
                    <p className="mb-1 text-center text-sm text-gray-600">
                        <span className="font-medium">{lessonTitle}</span>
                    </p>
                    <p className="mb-6 text-center text-sm text-gray-600">
                        Bài học này chỉ xem được khi bạn mua khóa học.
                    </p>

                    {/* Preview Info */}
                    <div className="mb-6 rounded-lg bg-blue-50 p-4">
                        <p className="text-sm text-blue-900">
                            <span className="font-medium">Miễn phí xem 3 bài học đầu tiên</span> để
                            bạn có thể trải nghiệm chất lượng khóa học trước khi quyết định mua.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handlePurchase}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            Mua khóa học ngay
                        </button>
                        <button
                            onClick={onClose}
                            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

