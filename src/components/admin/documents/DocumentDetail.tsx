"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Document } from "@/types/admin/document";
import { getDocumentById, downloadDocument } from "@/api/documents";
import { formatDate } from "@/utils/admin";
import StatusBadge from "@/components/admin/common/StatusBadge";
import ActionButton from "@/components/admin/common/ActionButton";
import BackButton from "@/components/admin/common/BackButton";
import {
    FileText,
    Download,
    Crown,
    Calendar,
    User,
    Clock,
    Folder,
} from "lucide-react";
import { DataLoading } from "@/components/common/LoadingScreen";
import { toast } from "react-hot-toast";

interface DocumentDetailProps {
    documentId: number;
}

export default function DocumentDetail({ documentId }: DocumentDetailProps) {
    const router = useRouter();
    const [document, setDocument] = useState<Document | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDocument();
    }, [documentId]);

    const fetchDocument = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const doc = await getDocumentById(documentId);
            setDocument(doc);
        } catch (err) {
            setError("Failed to load document details");
            console.error("Error fetching document:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!document || !document.file_url) {
            toast.error("Document file not available");
            return;
        }
        try {
            const filename = `${document.title}.${document.file_type || 'pdf'}`;
            await downloadDocument(document.file_url, filename);
            toast.success("Document downloaded successfully");
        } catch (error) {
            console.error("Failed to download document:", error);
            toast.error("Failed to download document");
        }
    };

    if (isLoading) {
        return <DataLoading text="Loading Document Details..." />;
    }

    if (error || !document) {
        return (
            <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                    {error || "Document not found"}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                    The document you're looking for doesn't exist or has been removed.
                </p>
                <div className="mt-6">
                    <BackButton />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <BackButton />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                            <FileText className="w-8 h-8 text-blue-600" />
                            <span>{document.title}</span>
                            {document.is_premium && (
                                <Crown className="w-6 h-6 text-yellow-500" />
                            )}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Document ID: {document.id}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    {document.file_url && (
                        <button
                            onClick={handleDownload}
                            title="Download document"
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Document Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Folder className="w-4 h-4" />
                            <span>Category</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                            {document.category?.name || "N/A"}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>Owner</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                            {document.owner?.name || "N/A"}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Crown className="w-4 h-4" />
                            <span>Type</span>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${document.is_premium
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                            }`}>
                            {document.is_premium ? "Premium" : "Free"}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>Status</span>
                        </div>
                        <StatusBadge status={document.status} />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>Price</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                            {document.price_token} Tokens
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Created</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                            {formatDate(document.created_at)}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>Updated</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">
                            {formatDate(document.updated_at)}
                        </p>
                    </div>
                </div>

                {document.description && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                        <p className="text-sm text-gray-600">{document.description}</p>
                    </div>
                )}
            </div>

            {/* File Info */}
            {document.file_url && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">File Information</h2>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">File Name:</span>
                            <span className="text-sm font-medium text-gray-900">{document.title}</span>
                        </div>
                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">File Type:</span>
                            <span className="text-sm font-medium text-gray-900">{document.file_type}</span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-gray-600">File Size:</span>
                            <span className="text-sm font-medium text-gray-900">
                                {(document.file_size / 1024 / 1024).toFixed(2)} MB
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
