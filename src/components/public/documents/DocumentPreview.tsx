"use client";

import { useState } from "react";
import { FileText, Download, X } from "lucide-react";
import { downloadDocument } from "@/api/documents";

interface DocumentPreviewProps {
    fileUrl: string;
    fileName: string;
    onDownload?: () => void;
    canDownload?: boolean;
    id: number;
}

export default function DocumentPreview({
    fileUrl,
    fileName,
    onDownload,
    canDownload = true,
    id,
}: DocumentPreviewProps) {
    const [showFullscreen, setShowFullscreen] = useState(false);

    const handleDownload = async () => {
        await downloadDocument(`/documents/${id}/download`, fileName);
    };    

    const isPdf = fileUrl.toLowerCase().includes(".pdf");

    return (
        <div className="relative bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">

            {/* Header */}
            <div className="bg-white border-b px-4 py-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium">{fileName}</span>
                </div>
                <div className="flex items-center gap-2">
                    {/* Fullscreen toggle */}
                    <button
                        onClick={() => setShowFullscreen(!showFullscreen)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                        {showFullscreen ? <X /> : "⛶"}
                    </button>
                    {/* Download */}
                    {canDownload && (
                        <button
                            onClick={handleDownload}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                        >
                            <Download />
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div
                className={`relative ${showFullscreen
                    ? "fixed inset-0 z-50 bg-white"
                    : "h-[600px] max-h-[57vh]"
                    }`}
            >
                {isPdf ? (
                    <iframe src={fileUrl} className="w-full h-full"></iframe>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full p-10 text-center">
                        <FileText className="w-12 h-12 text-gray-400 mb-4" />
                        <p className="text-gray-600">
                            Không có khả năng xem trước cho loại tài liệu này.
                        </p>
                        <button
                            onClick={handleDownload}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Tải về tài liệu
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
