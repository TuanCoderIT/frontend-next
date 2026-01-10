"use client";

import { useState, useEffect } from "react";
import { adminGroupsApi } from "@/api/admin/groups";
import { Post, PaginatedResponse } from "@/types/public/group";
import Avatar from "@/components/admin/common/Avatar";
import ActionButton from "@/components/admin/common/ActionButton";
import SearchBar from "@/components/admin/common/SearchBar";
import { DataLoading } from "@/components/common/LoadingScreen";
import Pagination from "@/components/common/Pagination";
import { notify } from "@/utils/toast";
import { Eye, EyeOff, FileText } from "lucide-react";
import { formatRelativeTime } from "@/libs/dateFormat";

interface PostListProps {
    groupId: number;
}

export default function PostList({ groupId }: PostListProps) {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState<{
        currentPage: number;
        total: number;
        lastPage: number;
    } | null>(null);

    useEffect(() => {
        fetchPosts();
    }, [groupId, currentPage, searchQuery]);

    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            const response = await adminGroupsApi.getPosts(groupId, {
                page: currentPage,
                search: searchQuery || undefined,
            });
            setPosts(response.data.data || []);
            setPagination({
                currentPage: response.data.current_page,
                total: response.data.total,
                lastPage: response.data.last_page,
            });
        } catch (error: any) {
            notify.error(error?.response?.data?.message || "Không thể tải danh sách bài viết");
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleVisibility = async (postId: number, isHidden: boolean) => {
        try {
            await adminGroupsApi.togglePostVisibility(groupId, postId, !isHidden);
            notify.success(`Đã ${!isHidden ? 'ẩn' : 'hiện'} bài viết`);
            fetchPosts();
        } catch (error: any) {
            notify.error(error?.response?.data?.message || "Không thể cập nhật bài viết");
        }
    };

    return (
        <div className="space-y-4">
            {/* Search */}
            <SearchBar
                placeholder="Tìm kiếm bài viết..."
                onSearch={setSearchQuery}
                value={searchQuery}
            />

            {/* Posts List */}
            {isLoading ? (
                <DataLoading />
            ) : posts.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 dark:text-gray-400">Không có bài viết nào</p>
                </div>
            ) : (
                <>
                    <div className="space-y-4">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className={`p-4 rounded-lg border ${post.is_hidden
                                    ? 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 opacity-60'
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                    }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Avatar
                                                src={post.user?.avatar || undefined}
                                                name={post.user.name}
                                                size="sm"
                                            />
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {post.user.name}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatRelativeTime(post.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                        {post.content && (
                                            <p className="text-gray-700 dark:text-gray-300 mb-2 line-clamp-3">
                                                {post.content}
                                            </p>
                                        )}
                                        {post.attachments && post.attachments.length > 0 && (
                                            <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                                                <FileText className="w-4 h-4" />
                                                {post.attachments.length} tệp đính kèm
                                            </div>
                                        )}
                                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            <span>{post.reactions_count || 0} lượt thích</span>
                                            <span>{post.comments_count || 0} bình luận</span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <ActionButton
                                            onClick={() => handleToggleVisibility(post.id, post.is_hidden || false)}
                                            icon={post.is_hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            variant={post.is_hidden ? "activate" : "deactivate"}
                                        />
                                    </div>
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

