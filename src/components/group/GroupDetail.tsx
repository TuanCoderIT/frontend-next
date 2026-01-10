"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useGroupDetail } from '@/hooks/group/useGroupDetail';
import GroupHeader from './GroupHeader';
import GroupTabs from './GroupTabs';
import GroupPostsTab from './GroupPostsTab';
import GroupMembersTab from './GroupMembersTab';
import GroupChatTab from './GroupChatTab';
import Loading from '@/components/common/LoadingScreen';

type TabType = 'posts' | 'members' | 'chat';

interface GroupDetailProps {
    slug: string;
}

export default function GroupDetail({ slug }: GroupDetailProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('posts');

    const { group, isLoading, isMember, isOwner, isAdmin } = useGroupDetail(slug);

    // Get tab from URL query param
    useEffect(() => {
        const tabParam = searchParams.get('tab') as TabType;
        if (tabParam && ['posts', 'members', 'chat'].includes(tabParam)) {
            setActiveTab(tabParam);
        }
    }, [searchParams]);

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        router.push(`/groups/${slug}?tab=${tab}`, { scroll: false });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen">
                <Loading text="Đang tải thông tin nhóm..." />
            </div>
        );
    }

    if (!group) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Không tìm thấy nhóm
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Nhóm này không tồn tại hoặc đã bị xóa
                    </p>
                    <button
                        onClick={() => router.push('/groups')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Quay lại danh sách nhóm
                    </button>
                </div>
            </div>
        );
    }

    // Check permissions for tabs
    const canViewPosts = group.visibility === 'public' || isMember;
    const canViewMembers = group.visibility === 'public' || isMember;
    const canViewChat = isMember;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <GroupHeader group={group} />

            {/* Tabs */}
            <GroupTabs
                activeTab={activeTab}
                onTabChange={handleTabChange}
                postsCount={group.posts_count}
                membersCount={group.members_count}
            />

            {/* Tab Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'posts' && (
                    <>
                        {canViewPosts ? (
                            <GroupPostsTab groupId={group.id} isMember={isMember} />
                        ) : (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
                                <p className="text-gray-500 dark:text-gray-400">
                                    Bạn cần tham gia nhóm để xem bài viết
                                </p>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'members' && (
                    <>
                        {canViewMembers ? (
                            <GroupMembersTab
                                groupId={group.id}
                                isOwner={isOwner}
                                isAdmin={isAdmin}
                            />
                        ) : (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
                                <p className="text-gray-500 dark:text-gray-400">
                                    Bạn cần tham gia nhóm để xem thành viên
                                </p>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'chat' && (
                    <>
                        {canViewChat ? (
                            <GroupChatTab groupId={group.id} />
                        ) : (
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
                                <p className="text-gray-500 dark:text-gray-400">
                                    Bạn cần tham gia nhóm để sử dụng chat
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

