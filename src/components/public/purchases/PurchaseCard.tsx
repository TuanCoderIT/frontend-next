"use client";

import Link from "next/link";
import Image from "next/image";
import { BookOpen, FileText, PlayCircle, Target } from "lucide-react";
import { PurchaseItem, typeColorMap } from "@/types/public/purchase";

function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
    });
}

function formatPrice(tokens?: number | null) {
    if (!tokens || tokens <= 0) return "Miễn phí";
    return `Mua với ${tokens} tokens`;
}

function getTypeIcon(type: PurchaseItem["type"]) {
    switch (type) {
        case "quiz":
            return <Target className="w-5 h-5" />;
        case "course":
            return <BookOpen className="w-5 h-5" />;
        case "video":
            return <PlayCircle className="w-5 h-5" />;
        case "document":
            return <FileText className="w-5 h-5" />;
    }
}

function getTypeBadgeClass(type: PurchaseItem["type"]) {
    const color = typeColorMap[type];
    const map: Record<string, string> = {
        blue: "bg-blue-100 text-blue-700",
        green: "bg-green-100 text-green-700",
        purple: "bg-purple-100 text-purple-700",
        orange: "bg-orange-100 text-orange-700",
    };
    return map[color];
}

export default function PurchaseCard({ item }: { item: PurchaseItem }) {
    const href =
        item.type === "quiz"
            ? `/quiz/${item.meta.examId}`
            : "#";

    const cta = item.type === "quiz" ? ("Bắt đầu" as const) : ("Xem" as const);

    return (
        <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
            {/* Media */}
            <div className="relative h-20 bg-gray-100">
                {item.thumbnailUrl ? (
                    <Image
                        src={item.thumbnailUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeBadgeClass(item.type)} flex items-center gap-2`}>
                            {getTypeIcon(item.type)}
                            <span className="capitalize">{item.type}</span>
                        </div>
                    </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>

                {/* Meta */}
                <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-gray-700 font-medium">{formatPrice(item.priceTokens)}</span>
                    <span className="text-gray-500">{formatDate(item.purchasedAt)}</span>
                </div>

                {/* Quiz meta */}
                {item.type === "quiz" && (
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-3">
                        <span>{item.meta.questionsCount} câu hỏi</span>
                        <span>•</span>
                        <span>{item.meta.durationMinutes} phút</span>
                        <span>•</span>
                        <span>{item.meta.difficulty}</span>
                    </div>
                )}

                {/* CTA */}
                <div className="mt-5">
                    <Link
                        href={href}
                        className="inline-flex items-center justify-center w-full bg-gray-900 text-white py-2.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                    >
                        {cta}
                    </Link>
                </div>
            </div>
        </div>
    );
}


