"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminGroupsApi } from "@/api/admin/groups";
import { GroupDetail } from "@/types/public/group";
import PageHeader from "@/components/admin/common/PageHeader";
import AdminBreadcrumb from "@/components/admin/common/AdminBreadcrumb";
import { DataLoading } from "@/components/common/LoadingScreen";
import { notify } from "@/utils/toast";
import { ArrowLeft, Trash2, Users, FileText } from "lucide-react";
import ActionButton from "../common/ActionButton";
import MemberList from "./MemberList";
import PostList from "./PostList";

interface GroupDetailPageProps {
    groupId: number;
}

export default function GroupDetailPage({ groupId }: GroupDetailPageProps) {
    const router = useRouter();
    const [group, setGroup] = useState<GroupDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"info" | "members" | "posts">("info");

    const fetchGroup = async () => {
        setIsLoading(true);
        try {
            console.log("Fetching group with ID:", groupId); // debug
            const response = await adminGroupsApi.getGroupDetail(groupId);
            setGroup(response.data);
        } catch (error: any) {
            notify.error(error?.response?.data?.message || "Không thể tải thông tin nhóm");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!groupId) {
            console.error("groupId is invalid:", groupId);
            return;
        }
        fetchGroup();
    }, [groupId]);

    const handleDelete = async () => {
        if (!confirm("Bạn có chắc chắn muốn xóa nhóm này? Hành động này không thể hoàn tác.")) return;

        try {
            await adminGroupsApi.deleteGroup(groupId);
            notify.success("Đã xóa nhóm");
            router.push("/admin/groups");
        } catch (error: any) {
            notify.error(error?.response?.data?.message || "Không thể xóa nhóm");
        }
    };

    if (isLoading) {
        return <DataLoading />;
    }

    if (!group) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">Không tìm thấy nhóm</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <AdminBreadcrumb
                currentPage="Group Details"
                parent={{ href: "/admin/groups", label: group.name }}
            />
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <ActionButton
                            onClick={() => router.push("/admin/groups")}
                            icon={<ArrowLeft className="w-4 h-4" />}
                            variant="danger"
                        />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {group.name}
                            </h1>
                            {group.description && (
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    {group.description}
                                </p>
                            )}
                        </div>
                    </div>
                    <ActionButton
                        onClick={handleDelete}
                        icon={<Trash2 className="w-4 h-4" />}
                        variant="danger"
                    />
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{group.members_count} thành viên</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        <span>{group.posts_count || 0} bài viết</span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${group.visibility === 'public'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                        }`}>
                        {group.visibility === 'public' ? 'Công khai' : 'Riêng tư'}
                    </span>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="flex -mb-px">
                        {[
                            { id: "info", label: "Thông tin" },
                            { id: "members", label: "Thành viên" },
                            { id: "posts", label: "Bài viết" },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                                        ? "border-blue-500 text-blue-600 dark:text-blue-400"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === "info" && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Tên nhóm
                                </label>
                                <p className="mt-1 text-gray-900 dark:text-white">{group.name}</p>
                            </div>
                            {group.description && (
                                <div>
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Mô tả
                                    </label>
                                    <p className="mt-1 text-gray-900 dark:text-white">{group.description}</p>
                                </div>
                            )}
                            <div>
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Ngày tạo
                                </label>
                                <p className="mt-1 text-gray-900 dark:text-white">
                                    {new Date(group.created_at).toLocaleDateString('vi-VN')}
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === "members" && (
                        <MemberList groupId={groupId} onUpdate={fetchGroup} />
                    )}

                    {activeTab === "posts" && (
                        <PostList groupId={groupId} />
                    )}
                </div>
            </div>
        </div>
    );
}

