"use client";

import { useEffect, useState } from "react";
import { getDocuments } from "@/api/documents";
import { getCategories } from "@/api/quiz";
import DocumentCard from "@/components/public/documents/DocumentCard";
import CategoryFilter from "@/components/public/quiz/CategoryFilter";
import { Document } from "@/types/admin/document";
import { Category } from "@/types/public/category";
import Pagination from "@/components/common/Pagination";
import { FileText } from "lucide-react";

export default function DocumentsPage() {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string | number>("All");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(9);
    const [isLoading, setIsLoading] = useState(true);
    const [filterType, setFilterType] = useState<"all" | "free" | "premium">("all");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories([{ id: "All", name: "All" }, ...data]);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                setIsLoading(true);
                const data = await getDocuments(selectedCategory);
                // Ensure data is always an array
                const documentsArray = Array.isArray(data) ? data : [];
                // Filter only published documents
                const publishedDocs = documentsArray.filter(
                    (doc: Document) => doc.status === "published"
                );
                setDocuments(publishedDocs);
            } catch (error) {
                console.error("Failed to fetch documents:", error);
                setDocuments([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDocuments();
    }, [selectedCategory]);

    const filteredDocuments = documents.filter(
        (doc: Document) => {
            const matchesSearch =
                doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                doc.category?.name.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesType =
                filterType === "all" ||
                (filterType === "free" && !doc.is_premium) ||
                (filterType === "premium" && doc.is_premium);

            return matchesSearch && matchesType;
        }
    );

    // Pagination
    const indexOfLastDoc = currentPage * pageSize;
    const indexOfFirstDoc = indexOfLastDoc - pageSize;
    const paginatedDocuments = filteredDocuments.slice(
        indexOfFirstDoc,
        indexOfLastDoc
    );

    const selectedCategoryName =
        selectedCategory === "All"
            ? "Tất cả tài liệu"
            : categories.find((c) => c.id === selectedCategory)?.name || "Category";

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Khám phá <span className="text-orange-600">tài liệu</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Truy cập thư viện tài liệu giáo dục, tài liệu học tập và
                        tài nguyên trên nhiều chủ đề.
                    </p>
                </div>
                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                />
                {/* Search Bar */}
                <div className="mb-8 mt-8">
                    <div className="max-w-2xl mx-auto relative">
                        <div className="relative">
                            <svg
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <input
                                type="text"
                                placeholder="Tìm kiếm tài liệu theo tiêu đề hoặc mô tả..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white shadow-sm"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-64 flex-shrink-0">
                        {/* Type Filter */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Loại tài liệu
                            </h3>
                            <div className="space-y-2">
                                {[
                                    { value: "all", label: "Tất cả tài liệu" },
                                    { value: "free", label: "Miễn phí" },
                                    { value: "premium", label: "Trả phí" },
                                ].map((type) => (
                                    <button
                                        key={type.value}
                                        onClick={() => setFilterType(type.value as any)}
                                        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${filterType === type.value
                                            ? "bg-orange-50 text-orange-700 border-l-4 border-orange-500"
                                            : "text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{type.label}</span>
                                            {filterType === type.value && (
                                                <svg
                                                    className="w-4 h-4 text-orange-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M5 13l4 4L19 7"
                                                    />
                                                </svg>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Documents Grid */}
                    <div className="flex-1">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-2xl font-semibold text-gray-900">
                                {selectedCategoryName}
                                <span className="text-gray-500 text-lg ml-2">
                                    ({filteredDocuments.length})
                                </span>
                            </h2>
                        </div>

                        {isLoading ? (
                            <div className="text-center py-16">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Đang tải tài liệu...</p>
                            </div>
                        ) : filteredDocuments.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FileText className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Không tìm thấy tài liệu
                                </h3>
                                <p className="text-gray-600">
                                    Thử điều chỉnh tìm kiếm hoặc tiêu chí lọc
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {paginatedDocuments.map((document) => (
                                        <DocumentCard key={document.id} document={document} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {filteredDocuments.length > pageSize && (
                                    <div className="mt-8">
                                        <Pagination
                                            currentPage={currentPage}
                                            pageSize={pageSize}
                                            totalItems={filteredDocuments.length}
                                            onPageChange={setCurrentPage}
                                            showPageSizeDropdown={false}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

