"use client";

import Link from "next/link";
import { Document } from "@/types/admin/document";
import { FileText, Crown, Download, Eye } from "lucide-react";

interface DocumentCardProps {
    document: Document;
}

export default function DocumentCard({ document }: DocumentCardProps) {
    const isPremium = document.is_premium;
    const isPublished = document.status === "published";

    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
            {/* Header with gradient */}
            <div className="h-32 bg-gradient-to-r from-orange-400 to-orange-600 relative">
                <div className="absolute top-4 left-4 flex items-center gap-2">
                    {isPremium && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            Premium
                        </span>
                    )}
                    {!isPremium && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            Free
                        </span>
                    )}
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold mb-1 line-clamp-1">{document.title}</h3>
                    <span className="text-sm opacity-90">{document.category?.name}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                    {document.description || "No description available"}
                </p>

                {/* Document Info */}
                <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center">
                        <FileText className="w-4 h-4 mr-1" />
                        <span>Tài liệu</span>
                    </div>
                    {document.price_token > 0 && (
                        <div className="flex items-center">
                            <Crown className="w-4 h-4 mr-1 text-yellow-500" />
                            <span className="font-medium text-gray-700">
                                {document.price_token} tokens
                            </span>
                        </div>
                    )}
                    {document.price_token === 0 && (
                        <span className="text-green-600 font-medium">Miễn phí</span>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <Link
                        href={`/documents/${document.id}`}
                        className="flex-1 bg-gray-900 text-white text-center py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                    >
                        Xem chi tiết
                    </Link>
                    {document.file_url && isPublished && (
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                window.open(document.file_url!, "_blank");
                            }}
                            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            title="Xem trước"
                        >
                            <Eye className="w-5 h-5 text-gray-600" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

