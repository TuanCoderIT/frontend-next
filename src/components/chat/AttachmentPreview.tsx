"use client";

import { X, Download, File } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/utils/imageUtils";

interface AttachmentPreviewProps {
    attachments: string[];
    onRemove?: (index: number) => void;
    isPreview?: boolean;
}

export default function AttachmentPreview({
    attachments,
    onRemove,
    isPreview = false,
}: AttachmentPreviewProps) {
    if (attachments.length === 0) return null;

    const getFileType = (url: string): "image" | "file" => {
        const extension = url.split(".").pop()?.toLowerCase();
        const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
        return imageExtensions.includes(extension || "") ? "image" : "file";
    };

    const getFileName = (url: string): string => {
        return url.split("/").pop() || "file";
    };

    return (
        <div className="flex flex-wrap gap-2 p-2">
            {attachments.map((url, index) => {
                const fileType = getFileType(url);
                const fileName = getFileName(url);

                if (fileType === "image") {
                    const imageUrl = getImageUrl(url);
                    return (
                        <div key={index} className="relative group">
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                {imageUrl ? (
                                    <Image
                                        src={imageUrl}
                                        alt={`Attachment ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="80px"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                        <File className="w-6 h-6 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            {isPreview && onRemove && (
                                <button
                                    onClick={() => onRemove(index)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="Remove attachment"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    );
                }

                return (
                    <div
                        key={index}
                        className="relative group flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                    >
                        <File className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        <span className="text-xs text-gray-700 dark:text-gray-300 truncate max-w-[100px]">
                            {fileName}
                        </span>
                        {isPreview && onRemove && (
                            <button
                                onClick={() => onRemove(index)}
                                className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove attachment"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                        {!isPreview && (
                            <a
                                href={getImageUrl(url)}
                                download
                                className="text-blue-500 hover:text-blue-700"
                                aria-label="Download file"
                            >
                                <Download className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

