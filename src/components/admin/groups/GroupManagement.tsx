"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminGroupsApi } from "@/api/admin/groups";
import { Group } from "@/types/public/group";
import SearchBar from "@/components/admin/common/SearchBar";
import FilterSelect from "@/components/admin/common/FilterSelect";
import ActionButton from "@/components/admin/common/ActionButton";
import StatusBadge from "@/components/admin/common/StatusBadge";
import PageHeader from "@/components/admin/common/PageHeader";
import AdminBreadcrumb from "@/components/admin/common/AdminBreadcrumb";
import { DataLoading } from "@/components/common/LoadingScreen";
import Pagination from "@/components/common/Pagination";
import { notify } from "@/utils/toast";
import { Users, FileText, Trash2, Eye, FolderTree, Plus, Ungroup } from "lucide-react";

export default function GroupManagement() {
    const router = useRouter();
    const [groups, setGroups] = useState<Group[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [visibilityFilter, setVisibilityFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<{
        currentPage: number;
        total: number;
        lastPage: number;
    } | null>(null);

    useEffect(() => {
        fetchGroups();
    }, [currentPage, searchQuery, visibilityFilter]);

    const fetchGroups = async () => {
        setIsLoading(true);
        try {
            const response = await adminGroupsApi.getGroups({
                page: currentPage,
                search: searchQuery || undefined,
                visibility: visibilityFilter !== "all" ? visibilityFilter as 'public' | 'private' : undefined,
            });
            setGroups(response.data.data || []);
            setPagination({
                currentPage: response.data.current_page,
                total: response.data.total,
                lastPage: response.data.last_page,
            });
        } catch (error: any) {
            notify.error(error?.response?.data?.message || "Không thể tải danh sách nhóm");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (groupId: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa nhóm này?")) return;

        try {
            await adminGroupsApi.deleteGroup(groupId);
            notify.success("Đã xóa nhóm");
            fetchGroups();
        } catch (error: any) {
            notify.error(error?.response?.data?.message || "Không thể xóa nhóm");
        }
    };

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <AdminBreadcrumb currentPage="Groups Management" />
            {/* Header */}
            <PageHeader
                title="Groups Management"
                icon={<FolderTree />}
                actionLabel="Add new Group"
                actionHref="/admin/groups/add"
                actionIcon={<Plus />}
            />

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 mt-6">
                        <SearchBar
                            placeholder="Tìm kiếm nhóm..."
                            onSearch={setSearchQuery}
                            value={searchQuery}
                        />
                    </div>
                    <FilterSelect
                        label="Quyền riêng tư"
                        value={visibilityFilter}
                        onChange={setVisibilityFilter}
                        options={[
                            { value: "all", label: "Tất cả" },
                            { value: "public", label: "Công khai" },
                            { value: "private", label: "Riêng tư" },
                        ]}
                    />
                </div>
            </div>

            {/* Groups Table */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                {isLoading ? (
                    <DataLoading />
                ) : groups.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400">Không có nhóm nào</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Tên nhóm
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Quyền riêng tư
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Thành viên
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Bài viết
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {groups.map((group) => (
                                        <tr key={group.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1">
                                                    <Ungroup className="w-4 h-4" />
                                                    {group.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge
                                                    status={group.visibility === 'public' ? 'Công khai' : 'Riêng tư'}
                                                    type="status"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {group.members_count}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <FileText className="w-4 h-4" />
                                                    {group.posts_count || 0}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <ActionButton
                                                        onClick={() => router.push(`/admin/groups/${group.id}`)}
                                                        icon={<Eye className="w-4 h-4" />} variant={"view"}
                                                    />
                                                    <ActionButton
                                                        onClick={() => handleDelete(group.id)}
                                                        icon={<Trash2 className="w-4 h-4" />}
                                                        variant="danger"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.total > 0 && (
                            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                                <Pagination
                                    currentPage={pagination.currentPage}
                                    pageSize={10}
                                    totalItems={pagination.total}
                                    onPageChange={setCurrentPage}
                                    showPageSizeDropdown={false}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

