"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Document, DocumentFilters } from "@/types/admin/document";
import { getDocuments, downloadDocument, deleteDocument } from "@/api/documents";
import { getCategories } from "@/api/quiz";
import { formatDate } from "@/utils/admin";
import SearchBar from "@/components/admin/common/SearchBar";
import FilterSelect from "@/components/admin/common/FilterSelect";
import ActionButton from "@/components/admin/common/ActionButton";
import StatusBadge from "@/components/admin/common/StatusBadge";
import Pagination from "@/components/common/Pagination";
import { FileText, Download, Eye, Plus, Crown, Folder } from "lucide-react";
import CustomLink from "../common/CustomLink";
import PageHeader from "../common/PageHeader";
import AdminBreadcrumb from "../common/AdminBreadcrumb";
import { DataLoading } from "@/components/common/LoadingScreen";
import { toast } from "react-hot-toast";
import { Category } from "@/types/public/category";

export default function DocumentList() {
    const router = useRouter();
    const [documents, setDocuments] = useState<Document[]>([]);
    const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
    const [filters, setFilters] = useState<DocumentFilters>({});
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | string>("all");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                setCategories(data);
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
                const categoryId = selectedCategoryId === "all" ? undefined : selectedCategoryId;
                const data = await getDocuments(categoryId);
                // Ensure data is always an array
                const documentsArray = Array.isArray(data) ? data : [];
                setDocuments(documentsArray);
                setFilteredDocuments(documentsArray);
            } catch (error) {
                console.error("Failed to fetch documents:", error);
                toast.error("Failed to load documents");
                setDocuments([]);
                setFilteredDocuments([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDocuments();
    }, [selectedCategoryId]);

    useEffect(() => {
        let filtered = [...documents];

        if (filters.search) {
            filtered = filtered.filter(
                (docs) =>
                    docs.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
                    docs.description
                        .toLowerCase()
                        .includes(filters.search!.toLowerCase()) ||
                    docs.category?.name
                        .toLowerCase()
                        .includes(filters.search!.toLowerCase())
            );
        }

        if (filters.category && filters.category !== "all") {
            filtered = filtered.filter(
                (docs) => docs.category?.name === filters.category
            );
        }

        if (filters.status) {
            filtered = filtered.filter((docs) => docs.status === filters.status);
        }

        setFilteredDocuments(filtered);
    }, [documents, filters]);

    const paginatedDoc = filteredDocuments.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleSearch = (query: string) => {
        setFilters((prev) => ({ ...prev, search: query }));
    };

    const handleStatusFilter = (status: string) => {
        setFilters((prev) => ({
            ...prev,
            status: status === "all" ? undefined : status,
        }));
    };

    const handlePremiumFilter = (premium: string) => {
        setFilters((prev) => ({
            ...prev,
            is_premium: premium === "all" ? undefined : premium === "premium",
        }));
    };

    const handleDeleteDocument = async (docs: Document) => {
        if (!window.confirm(`Are you sure you want to delete "${docs.title}"?`)) return;

        try {
            await deleteDocument(docs.id); // ✅ Gọi API xoá thật sự trên backend
            setDocuments((prev) => prev.filter((q) => q.id !== docs.id)); // ✅ Cập nhật UI
            toast.success(`Deleted "${docs.title}" successfully`);
        } catch (error: any) {
            console.error("Failed to delete document:", error);
            toast.error(error.response?.data?.message || "Failed to delete document");
        }
    };

    const handleDownload = async (document: Document) => {
        if (!document.file_url) {
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

    const getStatusColor = (status: string) => {
        switch (status) {
            case "published":
                return "bg-green-100 text-green-800";
            case "draft":
                return "bg-yellow-100 text-yellow-800";
            case "archived":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const statusOptions = [
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
        { value: "archived", label: "Archived" },
    ];

    const premiumOptions = [
        { value: "all", label: "All Documents" },
        { value: "free", label: "Free" },
        { value: "premium", label: "Premium" },
    ];

    if (isLoading) {
        return <DataLoading text="Loading Documents..." />;
    }

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <AdminBreadcrumb currentPage="Documents Management" />

            {/* Header */}
            <PageHeader
                title="Documents Management"
                icon={<FileText />}
                actionLabel="Add new document"
                actionHref="/admin/documents/add"
                actionIcon={<Plus />}
                bgGradient="from-blue-50 to-indigo-50"
                buttonGradient="from-blue-500 to-indigo-600"
            />
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <SearchBar
                        placeholder="Search documents..."
                        onSearch={handleSearch}
                        value={filters.search || ""}
                    />
                    <FilterSelect
                        value={selectedCategoryId.toString()}
                        onChange={(value) => setSelectedCategoryId(value === "all" ? "all" : Number(value))}
                        options={[
                            { value: "all", label: "All Categories" },
                            ...categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))
                        ]}
                        placeholder="All Categories"
                    />
                    <FilterSelect
                        value={filters.status || ""}
                        onChange={handleStatusFilter}
                        options={statusOptions}
                        placeholder="All Status"
                    />
                    <FilterSelect
                        value={filters.is_premium === undefined ? "" : filters.is_premium ? "premium" : "free"}
                        onChange={handlePremiumFilter}
                        options={premiumOptions}
                        placeholder="All Types"
                    />
                </div>
            </div>

            {/* Documents Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-indigo-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Document
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Owner
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Price
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Created
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedDoc.map((document) => (
                                <tr
                                    key={document.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-start space-x-3">
                                            <div className="flex-shrink-0">
                                                <div className="w-10 h-10 text-blue-700 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center space-x-2">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {document.title}
                                                    </p>
                                                    {document.is_premium && (
                                                        <Crown className="w-4 h-4 text-yellow-500" />
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500 truncate block max-w-xs">
                                                    {document.description || "No description"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <Folder className="w-4 h-4 text-indigo-500" />
                                            <span className="text-sm text-gray-900">
                                                {document.category?.name || "N/A"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            {document.owner?.name || "N/A"}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${document.is_premium
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-green-100 text-green-800"
                                            }`}>
                                            {document.is_premium ? "Premium" : "Free"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={document.status} />
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="text-sm text-green-900">
                                            {document.price_token}
                                        </div>
                                        <div className="text-xs text-gray-500">Tokens</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            {formatDate(document.created_at)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <CustomLink
                                                href={`/admin/documents/${document.id}`}
                                                title="View document"
                                                type="view"
                                            />
                                            {document.file_url && (
                                                <button
                                                    onClick={() => handleDownload(document)}
                                                    title="Download document"
                                                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            )}
                                            <CustomLink
                                                href={`/admin/documents/${document.id}/edit`}
                                                title="Edit document"
                                                type="edit"
                                            />
                                            <ActionButton
                                                variant="delete"
                                                onClick={() => handleDeleteDocument(document)}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-4 py-3 border-t border-gray-200">
                    <Pagination
                        currentPage={currentPage}
                        pageSize={pageSize}
                        totalItems={filteredDocuments.length}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={setPageSize}
                        pageSizeOptions={[5, 10, 20]}
                    />
                </div>

                {filteredDocuments.length === 0 && (
                    <div className="text-center py-12">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            No documents found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Get started by creating a new document.
                        </p>
                    </div>
                )}
            </div>
        </div >
    );
}
