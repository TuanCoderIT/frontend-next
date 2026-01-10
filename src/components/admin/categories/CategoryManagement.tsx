"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Category, CategoryFilters } from "@/types/admin/admin";
import { formatDate } from "@/utils/admin";
import SearchBar from "@/components/admin/common/SearchBar";
import FilterSelect from "@/components/admin/common/FilterSelect";
import ActionButton from "@/components/admin/common/ActionButton";
import StatusBadge from "@/components/admin/common/StatusBadge";
import { FolderTree, Info, Plus } from "lucide-react";
import CustomLink from "../common/CustomLink";
import PageHeader from "../common/PageHeader";
import AdminBreadcrumb from "../common/AdminBreadcrumb";
import { axiosAPI } from "@/api/axios";
import { deleteCategory } from "@/api/categories";
import { DataLoading } from "@/components/common/LoadingScreen";
import Pagination from "@/components/common/Pagination";

export default function CategoryManagement() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
    const [filters, setFilters] = useState<CategoryFilters>({});
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axiosAPI.get("/admin/categories", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCategories(response.data);
                setFilteredCategories(response.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching categories", error);
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Filter categories based on current filters
    useEffect(() => {
        let filtered = categories;

        if (filters.search) {
            filtered = filtered.filter(
                (category) =>
                    category.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
                    category.slug.toLowerCase().includes(filters.search!.toLowerCase())
            );
        }
        if (filters.is_active !== undefined && filters.is_active !== "") {
            const isActive = filters.is_active === "true";
            filtered = filtered.filter((category) => category.is_active === isActive);
        }

        setFilteredCategories(filtered);
    }, [categories, filters]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters, pageSize]);

    const paginatedCategories = filteredCategories.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleSearch = (query: string) => {
        setFilters((prev) => ({ ...prev, search: query }));
    };

    const handleStatusFilter = (status: string) => {
        setFilters((prev) => ({ ...prev, is_active: status }));
    };

    const handleDeleteCategory = async (category: Category) => {
        if (confirm(`Are you sure you want to delete ${category.name}?`)) {
            try {
                await deleteCategory(category.id);
                setCategories((prev) => prev.filter((c) => c.id !== category.id));
            } catch (error) {
                console.error("Failed to delete category:", error);
                alert("Failed to delete category. Please try again.");
            }
        }
    };

    const handleToggleStatus = async (category: Category) => {
        try {
            const newStatus = !category.is_active;
            await axiosAPI.put(`/admin/categories/${category.id}`, {
                ...category,
                is_active: newStatus,
            });
            setCategories((prev) =>
                prev.map((c) =>
                    c.id === category.id ? { ...c, is_active: newStatus } : c
                )
            );
        } catch (error) {
            console.error("Failed to toggle category status:", error);
            alert("Failed to update category status. Please try again.");
        }
    };

    const statusOptions = [
        { value: "true", label: "Active" },
        { value: "false", label: "Inactive" },
    ];

    if (isLoading) {
        return <DataLoading text="Loading Categories List..." />;
    }

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <AdminBreadcrumb currentPage="Categories Management" />
            {/* Header */}
            <PageHeader
                title="Categories Management"
                icon={<FolderTree />}
                actionLabel="Add new Category"
                actionHref="/admin/categories/add"
                actionIcon={<Plus />}
            />

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <SearchBar
                        placeholder="Search by name or slug..."
                        onSearch={handleSearch}
                        value={filters.search || ""}
                    />
                    <FilterSelect
                        value={filters.is_active || ""}
                        onChange={handleStatusFilter}
                        options={statusOptions}
                        placeholder="All Status"
                    />
                </div>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-indigo-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Slug
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Color
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Created At
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {paginatedCategories.map((category) => (
                                <tr
                                    key={category.id}
                                    className="hover:bg-gray-50 transition-colors duration-150"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {category.name}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{category.slug}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {category.color ? (
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className="w-6 h-6 rounded-full border border-gray-300"
                                                    style={{ backgroundColor: category.color }}
                                                />
                                                <span className="text-sm text-gray-600">
                                                    {category.color}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400">N/A</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge
                                            status={category.is_active ? "active" : "inactive"}
                                            type="status"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatDate(category.created_at)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-1">
                                            <CustomLink
                                                href={`/admin/categories/${category.id}/edit`}
                                                title="Edit Category"
                                                type="edit"
                                            />
                                            <ActionButton
                                                variant={
                                                    category.is_active ? "deactivate" : "activate"
                                                }
                                                onClick={() => handleToggleStatus(category)}
                                            />
                                            <ActionButton
                                                variant="delete"
                                                onClick={() => handleDeleteCategory(category)}
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
                        totalItems={filteredCategories.length}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={setPageSize}
                        pageSizeOptions={[5, 10, 20]}
                    />
                </div>

                {filteredCategories.length === 0 && (
                    <div className="text-center py-12">
                        <Info className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                            No categories found
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Try adjusting your search or filter criteria.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

