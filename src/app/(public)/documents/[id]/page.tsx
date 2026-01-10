"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Document } from "@/types/admin/document";
import { getDocumentById, downloadDocument } from "@/api/documents";
import { checkPurchase, purchaseItem } from "@/api/purchase";
import { useAuth } from "@/context/AuthContext";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import DocumentPreview from "@/components/public/documents/DocumentPreview";
import { notify } from "@/utils/toast";
import {
    FileText,
    Crown,
    Download,
    Calendar,
    User,
    Clock,
    Coins,
} from "lucide-react";
import RatingSection from "@/components/public/ratings/RatingSection";

export default function DocumentDetailPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const { user } = useAuth();
    const id = params.id;
    const [document, setDocument] = useState<Document | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [purchased, setPurchased] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await getDocumentById(Number(id));
                console.log("Document data:", data);
                console.log("All document keys:", Object.keys(data));
                console.log("Full document object:", JSON.stringify(data, null, 2));
                setDocument(data);

                // Check if user has purchased this document
                if (data.is_premium && data.price_token > 0) {
                    try {
                        const res = await checkPurchase("document", data.id);
                        setPurchased(res.purchased);
                    } catch (error) {
                        console.error("Failed to check purchase:", error);
                    }
                } else {
                    // Free documents are automatically "purchased"
                    setPurchased(true);
                }
            } catch (error) {
                console.error("Failed to fetch document:", error);
                notify.error("Failed to load document details");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    const handlePurchase = async () => {
        if (!user) {
            notify.error("Bạn phải đăng nhập để mua tài liệu");
            router.push(`/auth/login?redirect=/documents/${id}`);
            return;
        }

        if (!document) return;

        try {
            setIsLoading(true);
            const res = await purchaseItem("document", document.id);
            notify.success(res.message || "Mua tài liệu thành công");
            setPurchased(true);
        } catch (err: any) {
            if (err.response?.status === 400) {
                notify.error("Không đủ tokens. Vui lòng nạp thêm.");
                router.push("/wallet/payment");
            } else {
                notify.error(err.response?.data?.message || "Mua tài liệu thất bại");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fileName = `${document?.title}`;
    const handleDownload = async () => {
        await downloadDocument(`/documents/${id}/download`, fileName);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (isLoading || !document) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang tải chi tiết tài liệu...</p>
                </div>
            </div>
        );
    }

    const canAccess = !document.is_premium || purchased;
    const fileUrl = document.file_url;
    const hasFile = !!fileUrl;

    // Debug logs
    console.log("canAccess:", canAccess);
    console.log("hasFile:", hasFile);
    console.log("fileUrl:", fileUrl);
    console.log("Should show preview:", canAccess && hasFile);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-screen-xl mx-auto px-6 py-8">
                {/* Breadcrumb */}
                <Breadcrumbs lastItemLabel={document.title} />

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* Left Column - Document Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-8 text-white">
                                <div className="flex items-center mb-4">
                                    <div className="bg-white bg-opacity-20 rounded-lg p-3 mr-4">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-orange-100 text-sm">
                                                {document.category?.name}
                                            </span>
                                            {document.is_premium && (
                                                <span className="px-2 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-semibold flex items-center gap-1">
                                                    <Crown className="w-3 h-3" />
                                                    Premium
                                                </span>
                                            )}
                                        </div>
                                        <h1 className="text-3xl font-bold">{document.title}</h1>
                                    </div>
                                </div>
                                <p className="text-orange-100 text-lg leading-relaxed">
                                    {document.description || "No description available"}
                                </p>
                            </div>
                        </div>

                        {/* Document Preview */}
                        {canAccess && hasFile && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">
                                    Xem trước tài liệu
                                </h2>
                                <div className="h-[600px] max-h-[70vh]">
                                    <DocumentPreview
                                        fileUrl={fileUrl!}
                                        fileName={document.title || "document.pdf"}
                                        onDownload={handleDownload}
                                        canDownload={true}
                                        id={document.id}
                                    />
                                </div>
                            </div>
                        )}

                        {!canAccess && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
                                <Crown className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-yellow-900 mb-2">
                                    Tài liệu trả phí
                                </h3>
                                <p className="text-yellow-800 mb-6">
                                    Mua tài liệu để xem và tải về.
                                </p>
                                <button
                                    onClick={handlePurchase}
                                    disabled={isLoading}
                                    className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold flex items-center gap-2 mx-auto"
                                >
                                    <Coins className="w-5 h-5" />
                                    {isLoading ? "Đang xử lý..." : `Mua tài liệu (${document.price_token} tokens)`}
                                </button>
                            </div>
                        )}

                    </div>

                    {/* Right Column - Document Info */}
                    <div className="space-y-6">
                        {/* Document Info Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">
                                Thông tin tài liệu
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <User className="w-4 h-4" />
                                        <span className="font-medium">Chủ sở hữu:</span>
                                    </div>
                                    <span className="text-gray-900 font-semibold">
                                        {document.owner?.name}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Crown className="w-4 h-4" />
                                        <span className="font-medium">Loại:</span>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${document.is_premium
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-green-100 text-green-800"
                                            }`}
                                    >
                                        {document.is_premium ? "Trả phí" : "Miễn phí"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Coins className="w-4 h-4" />
                                        <span className="font-medium">Giá:</span>
                                    </div>
                                    <span className="text-gray-900 font-semibold">
                                        {document.price_token > 0
                                            ? `${document.price_token} tokens`
                                            : "Miễn phí"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <span className="font-medium">Ngày tạo:</span>
                                    </div>
                                    <span className="text-gray-900 text-sm">
                                        {formatDate(document.created_at)}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between py-2">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Clock className="w-4 h-4" />
                                        <span className="font-medium">Ngày cập nhật:</span>
                                    </div>
                                    <span className="text-gray-900 text-sm">
                                        {formatDate(document.updated_at)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            {canAccess ? (
                                <>
                                    {hasFile && (
                                        <button
                                            onClick={handleDownload}
                                            disabled={isLoading}
                                            className="w-full py-4 rounded-xl font-bold text-lg transition-all bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-700 hover:to-orange-600 shadow-lg hover:shadow-xl mb-4 flex items-center justify-center gap-2"
                                        >
                                            <Download className="w-5 h-5" />
                                            Tải về tài liệu
                                        </button>
                                    )}
                                    <p className="text-center text-sm text-gray-500">
                                        Bạn có quyền truy cập vào tài liệu này
                                    </p>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handlePurchase}
                                        disabled={isLoading}
                                        className="w-full py-4 rounded-xl font-bold text-lg transition-all bg-gradient-to-r from-yellow-600 to-yellow-500 text-white hover:from-yellow-700 hover:to-yellow-600 shadow-lg hover:shadow-xl mb-4 flex items-center justify-center gap-2"
                                    >
                                        <Coins className="w-5 h-5" />
                                        {isLoading
                                            ? "Processing..."
                                            : `Mua - ${document.price_token} tokens`}
                                    </button>
                                    <p className="text-center text-sm text-gray-500">
                                        Mua để truy cập vào tài liệu này
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Tips */}
                        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2" />
                                Mẹo xem tài liệu
                            </h3>
                            <ul className="space-y-2 text-orange-800 text-sm">
                                <li>• Xem trước tài liệu trước khi tải về</li>
                                <li>• Tài liệu trả phí cần mua</li>
                                <li>• Tải về để truy cập ngoại tuyến</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Ratings Section */}
                {/* <RatingSection type="document" id={document.id} /> */}
            </div>
        </div>
    );
}
