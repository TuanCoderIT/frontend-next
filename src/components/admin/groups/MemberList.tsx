"use client";

import { useState, useEffect } from "react";
import { adminGroupsApi } from "@/api/admin/groups";
import { GroupMember, PaginatedResponse } from "@/types/public/group";
import Avatar from "@/components/admin/common/Avatar";
import StatusBadge from "@/components/admin/common/StatusBadge";
import ActionButton from "@/components/admin/common/ActionButton";
import SearchBar from "@/components/admin/common/SearchBar";
import { DataLoading } from "@/components/common/LoadingScreen";
import Pagination from "@/components/common/Pagination";
import { notify } from "@/utils/toast";
import { UserCog, UserMinus, ArrowUp, ArrowDown } from "lucide-react";

interface MemberListProps {
    groupId: number;
    onUpdate?: () => void;
}

export default function MemberList({ groupId, onUpdate }: MemberListProps) {
    const [members, setMembers] = useState<GroupMember[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<{
        currentPage: number;
        total: number;
        lastPage: number;
    } | null>(null);

    useEffect(() => {
        fetchMembers();
    }, [groupId, currentPage, searchQuery, roleFilter]);

    const fetchMembers = async () => {
        setIsLoading(true);
        try {
            const response = await adminGroupsApi.getMembers(groupId, {
                page: currentPage,
                search: searchQuery || undefined,
                role: roleFilter !== "all" ? roleFilter as 'owner' | 'admin' | 'member' : undefined,
            });
            setMembers(response.data.data || []);
            setPagination({
                currentPage: response.data.current_page,
                total: response.data.total,
                lastPage: response.data.last_page,
            });
        } catch (error: any) {
            notify.error(error?.response?.data?.message || "Không thể tải danh sách thành viên");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateRole = async (userId: number, newRole: 'admin' | 'member') => {
        try {
            await adminGroupsApi.updateMemberRole(groupId, userId, newRole);
            notify.success(`Đã ${newRole === 'admin' ? 'thăng' : 'hạ'} cấp thành viên`);
            fetchMembers();
            onUpdate?.();
        } catch (error: any) {
            notify.error(error?.response?.data?.message || "Không thể cập nhật vai trò");
        }
    };

    const handleRemove = async (userId: number) => {
        if (!confirm("Bạn có chắc chắn muốn xóa thành viên này khỏi nhóm?")) return;

        try {
            await adminGroupsApi.removeMember(groupId, userId);
            notify.success("Đã xóa thành viên");
            fetchMembers();
            onUpdate?.();
        } catch (error: any) {
            notify.error(error?.response?.data?.message || "Không thể xóa thành viên");
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'owner': return 'Chủ nhóm';
            case 'admin': return 'Quản trị viên';
            default: return 'Thành viên';
        }
    };

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                    <SearchBar
                        placeholder="Tìm kiếm thành viên..."
                        onSearch={setSearchQuery}
                        value={searchQuery}
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">Tất cả vai trò</option>
                    <option value="owner">Chủ nhóm</option>
                    <option value="admin">Quản trị viên</option>
                    <option value="member">Thành viên</option>
                </select>
            </div>

            {/* Members List */}
            {isLoading ? (
                <DataLoading />
            ) : members.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">Không có thành viên nào</p>
                </div>
            ) : (
                <>
                    <div className="space-y-3">
                        {members.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                            >
                                <div className="flex items-center gap-3">
                                    {/* <Avatar
                                        src={member.user?.avatar || undefined}
                                        name={member.user?.name}
                                        size="md"
                                    /> */}
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {member.user?.name}
                                        </p>
                                        <StatusBadge
                                            status={getRoleLabel(member.role)}
                                            type="role"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {member.role !== 'owner' && (
                                        <>
                                            {member.role === 'member' ? (
                                                <ActionButton
                                                    onClick={() => handleUpdateRole(member.user_id, 'admin')}
                                                    icon={<ArrowUp className="w-4 h-4" />}
                                                    variant="activate"
                                                />
                                            ) : (
                                                <ActionButton
                                                    onClick={() => handleUpdateRole(member.user_id, 'member')}
                                                    icon={<ArrowDown className="w-4 h-4" />}
                                                    variant="deactivate"
                                                />
                                            )}
                                            <ActionButton
                                                onClick={() => handleRemove(member.user_id)}
                                                icon={<UserMinus className="w-4 h-4" />}
                                                variant="danger"
                                            />
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.total > 0 && (
                        <Pagination
                            currentPage={pagination.currentPage}
                            pageSize={10}
                            totalItems={pagination.total}
                            onPageChange={setCurrentPage}
                            showPageSizeDropdown={false}
                        />
                    )}
                </>
            )}
        </div>
    );
}

