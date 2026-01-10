"use client";

import { useState } from 'react';
import { Group } from '@/types/public/group';
import { useAuth } from '@/context/AuthContext';
import { useGroups } from '@/hooks/group/useGroups';
import { useRouter } from 'next/navigation';
import { Users, FileText, Lock, Globe, Loader2, UserPlus, UserCheck, UserMinus } from 'lucide-react';
import Avatar from '@/components/admin/common/Avatar';

interface GroupCardProps {
    group: Group;
    isMember?: boolean;
}

export default function GroupCard({ group, isMember = false }: GroupCardProps) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const { user } = useAuth();
    const router = useRouter();
    const { joinGroup, leaveGroup } = useGroups();
    const [isJoining, setIsJoining] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    const handleJoinLeave = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsJoining(true);
        try {
            if (isMember) {
                await leaveGroup(group.id);
            } else {
                await joinGroup(group.id);
            }
        } catch (err) {
            console.error('Error joining/leaving group:', err);
        } finally {
            setIsJoining(false);
        }
    };

    const handleCardClick = () => {
        router.push(`/groups/${group.slug}`);
    };

    return (
        <div
            onClick={handleCardClick}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
        >
            {/* Cover Image */}
            <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600">
                {group.cover_image && (
                    <img
                        src={`${API_URL}${group.cover_image}`}
                        alt={group.name}
                        className="w-full h-full object-cover"
                    />
                )}
                <div className="absolute top-2 right-2">
                    {group.visibility === 'private' ? (
                        <span className="bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Riêng tư
                        </span>
                    ) : (
                        <span className="bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            Công khai
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {group.name}
                </h3>

                {group.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {group.description}
                    </p>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{group.members_count} thành viên</span>
                    </div>
                    {group.posts_count !== undefined && (
                        <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>{group.posts_count} bài viết</span>
                        </div>
                    )}
                </div>

                {/* Owner */}
                {group.owner && (
                    <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
                        <Avatar src={group.owner.avatar || undefined} name={group.owner.name} size="sm" />
                        <span>Tạo bởi {group.owner.name}</span>
                    </div>
                )}

                {/* Action Button */}
                {user && (
                    <button
                        onClick={handleJoinLeave}
                        onMouseEnter={() => setIsHovering(true)}
                        onMouseLeave={() => setIsHovering(false)}
                        disabled={isJoining}
                        className={`w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                            isMember
                                ? isHovering
                                    ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30'
                                    : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
                                : 'bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-sm hover:shadow-md'
                        } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm`}
                    >
                        {isJoining ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Đang xử lý...</span>
                            </>
                        ) : isMember ? (
                            isHovering ? (
                                <>
                                    <UserMinus className="w-4 h-4" />
                                    <span>Rời nhóm</span>
                                </>
                            ) : (
                                <>
                                    <UserCheck className="w-4 h-4" />
                                    <span>Đã tham gia</span>
                                </>
                            )
                        ) : (
                            <>
                                <UserPlus className="w-4 h-4" />
                                <span>Tham gia nhóm</span>
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}

