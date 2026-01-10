"use client";

import { useState } from 'react';
import { GroupDetail } from '@/types/public/group';
import { useAuth } from '@/context/AuthContext';
import { useGroupDetail } from '@/hooks/group/useGroupDetail';
import { useRouter } from 'next/navigation';
import { Users, FileText, Settings, Edit, LogOut, UserPlus, Clock, Lock, Globe } from 'lucide-react';
import Avatar from '@/components/admin/common/Avatar';
import { notify } from '@/utils/toast';
import GroupSettingsModal from './GroupSettingsModal';
import JoinRequestModal from './JoinRequestModal';

interface GroupHeaderProps {
    group: GroupDetail;
    onEdit?: () => void;
}

export default function GroupHeader({ group, onEdit }: GroupHeaderProps) {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    const { user } = useAuth();
    const router = useRouter();
    const { isMember, isOwner, isAdmin, joinGroup, leaveGroup, refresh } = useGroupDetail(group.slug);
    const [isJoining, setIsJoining] = useState(false);
    const [isLeaving, setIsLeaving] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showJoinRequests, setShowJoinRequests] = useState(false);

    const handleJoin = async () => {
        setIsJoining(true);
        try {
            await joinGroup();
            notify.success('Đã tham gia nhóm');
        } catch (err: any) {
            notify.error(err?.response?.data?.message || 'Không thể tham gia nhóm');
        } finally {
            setIsJoining(false);
        }
    };

    const handleLeave = async () => {
        if (!confirm('Bạn có chắc chắn muốn rời nhóm?')) return;
        setIsLeaving(true);
        try {
            await leaveGroup();
            notify.success('Đã rời nhóm');
            router.push('/groups');
        } catch (err: any) {
            notify.error(err?.response?.data?.message || 'Không thể rời nhóm');
        } finally {
            setIsLeaving(false);
        }
    };

    return (
        <div className="relative">
            {/* Cover Image */}
            <div className="relative h-96 bg-gradient-to-r from-blue-500 to-purple-600">
                {group.cover_image ? (
                    <img
                        src={`${API_URL}${group.cover_image}`}
                        alt={group.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600" />
                )}
                {isOwner && (
                    <button
                        onClick={onEdit}
                        className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Edit className="w-4 h-4" />
                        Chỉnh sửa
                    </button>
                )}
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-gray-800 mt-10 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-1">
                                    <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-4xl font-bold text-blue-600">
                                        {group.name.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex items-start justify-between gap-4 mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        {group.name}
                                    </h1>
                                    {group.description && (
                                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                                            {group.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="flex flex-wrap items-center gap-6 mb-4">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <Users className="w-5 h-5" />
                                    <span className="font-medium">{group.members_count} thành viên</span>
                                </div>
                                {group.posts_count !== undefined && (
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <FileText className="w-5 h-5" />
                                        <span className="font-medium">{group.posts_count} bài viết</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    {group.visibility === 'private' ? (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-full text-sm">
                                            <Lock className="w-4 h-4" />
                                            Riêng tư
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm">
                                            <Globe className="w-4 h-4" />
                                            Công khai
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Actions */}
                            {user && (
                                <div className="flex flex-wrap items-center gap-3">
                                    {!isMember ? (
                                        <button
                                            onClick={handleJoin}
                                            disabled={isJoining}
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            {isJoining ? 'Đang xử lý...' : 'Tham gia nhóm'}
                                        </button>
                                    ) : (
                                        <>
                                            {!isOwner && (
                                                <button
                                                    onClick={handleLeave}
                                                    disabled={isLeaving}
                                                    className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    {isLeaving ? 'Đang xử lý...' : 'Rời nhóm'}
                                                </button>
                                            )}
                                            {isAdmin && (
                                                <>
                                                    {group.visibility === 'private' && (
                                                        <button
                                                            onClick={() => setShowJoinRequests(true)}
                                                            className="px-6 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors flex items-center gap-2"
                                                        >
                                                            <Clock className="w-4 h-4" />
                                                            Yêu cầu tham gia
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => setShowSettings(true)}
                                                        className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                                                    >
                                                        <Settings className="w-4 h-4" />
                                                        Cài đặt
                                                    </button>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showSettings && (
                <GroupSettingsModal
                    group={group}
                    isOpen={showSettings}
                    onClose={() => setShowSettings(false)}
                    onUpdate={refresh}
                />
            )}
            {showJoinRequests && (
                <JoinRequestModal
                    groupId={group.id}
                    isOpen={showJoinRequests}
                    onClose={() => setShowJoinRequests(false)}
                />
            )}
        </div>
    );
}

