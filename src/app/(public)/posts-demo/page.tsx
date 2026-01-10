"use client";

import { useState } from 'react';
import PostCard from '@/components/group/PostCard';
import { Post } from '@/types/public/group';

// Mock data for demo
const mockPost: Post = {
    id: 1,
    user_id: 1,
    content: "Đây là một bài viết demo để test hệ thống reactions và comments mới! 🎉\n\nHãy thử click vào các reaction buttons và thêm comments để xem tính năng hoạt động như thế nào.",
    attachments: null,
    group_id: 1,
    is_pinned: false,
    visibility: 'public',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user: {
        id: 1,
        name: 'Demo User',
        avatar: null
    },
    comments_count: 0,
    reactions_count: 0,
    user_reaction: null,
    reaction_summary: {
        like: 0,
        love: 0,
        haha: 0,
        wow: 0,
        sad: 0,
        angry: 0
    }
};

export default function PostsDemoPage() {
    const [posts, setPosts] = useState<Post[]>([mockPost]);

    const handleUpdatePost = (updatedPost: Partial<Post>) => {
        setPosts(prevPosts => 
            prevPosts.map(post => 
                post.id === updatedPost.id 
                    ? { ...post, ...updatedPost }
                    : post
            )
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Posts Demo - Reactions & Comments
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Test tính năng reactions và comments mới
                        </p>
                    </div>

                    {posts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            onUpdatePost={handleUpdatePost}
                        />
                    ))}

                    <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Tính năng đã implement:
                        </h2>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <li>✅ 6 loại reactions: 👍❤️😂😮😢😠</li>
                            <li>✅ Hover để chọn reaction</li>
                            <li>✅ Toggle reactions (click lại để bỏ)</li>
                            <li>✅ Hiển thị tổng số reactions</li>
                            <li>✅ Comments với nested replies</li>
                            <li>✅ Reactions cho comments</li>
                            <li>✅ Optimistic UI updates</li>
                            <li>✅ Realtime events setup</li>
                            <li>✅ Infinite scroll cho comments</li>
                            <li>✅ Responsive design</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}