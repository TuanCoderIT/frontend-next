"use client";

import Image from "next/image";
import Link from "next/link";

interface EmptyStateProps {
    title?: string;
    description?: string;
    ctaHref?: string;
    ctaLabel?: string;
}

export default function EmptyState({
    title = "Bạn chưa mua bất kỳ thứ gì cả.",
    description = "Khám phá bài kiểm tra và nội dung để bắt đầu học tập.",
    ctaHref = "/quiz",
    ctaLabel = "Khám phá nội dung",
}: EmptyStateProps) {
    return (
        <div className="text-center py-20">
            <div className="w-28 h-28 mx-auto mb-6 relative">
                <Image src="/globe.svg" alt="Explore" fill className="object-contain" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6">{description}</p>
            <Link
                href={ctaHref}
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
                {ctaLabel}
            </Link>
        </div>
    );
}


