"use client";

import { useGroupPosts } from '@/hooks/group/useGroupPosts';
import { useAuth } from '@/context/AuthContext';
import CreatePostForm from './CreatePostForm';
import PostCard from './PostCard';
import Loading from '@/components/common/LoadingScreen';
import { Loader2 } from 'lucide-react';

interface GroupPostsTabProps {
    groupId: number;
    isMember: boolean;
}

export default function GroupPostsTab({ groupId, isMember }: GroupPostsTabProps) {
    const { user } = useAuth();
    const { posts, isLoading, loadMore, hasMore, isLoadingMore, createPost } = useGroupPosts(groupId);

    const handleCreatePost = async (content: string, attachments?: string[]) => {
        await createPost(content, attachments);
    };

    if (isLoading) {
        return (
            <div className="py-8">
                <Loading text="Đang tải bài viết..." />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto">
            {/* Create Post Form - Only for members */}
            {isMember && user && (
                <CreatePostForm onSubmit={handleCreatePost} />
            )}

            {/* Posts Feed */}
            {posts.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                        Chưa có bài viết nào
                    </p>
                    {isMember && (
                        <p className="text-gray-400 dark:text-gray-500 text-sm">
                            Hãy là người đầu tiên đăng bài trong nhóm này!
                        </p>
                    )}
                </div>
            ) : (
                <>
                    {posts.map((post) => (
                        <PostCard 
                            key={post.id} 
                            post={post}
                            onUpdatePost={(updatedPost) => {
                                // Update post in the list optimistically
                                mutate();
                            }}
                        />
                    ))}

                    {/* Load More */}
                    {hasMore && (
                        <div className="text-center py-4">
                            <button
                                onClick={loadMore}
                                disabled={isLoadingMore}
                                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                            >
                                {isLoadingMore ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Đang tải...</span>
                                    </>
                                ) : (
                                    'Tải thêm bài viết'
                                )}
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

