"use client";

import { GroupMember } from '@/types/public/group';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/admin/common/Avatar';
import StatusBadge from '@/components/admin/common/StatusBadge';
import { MoreVertical, UserMinus, UserPlus, UserMinus as UserDown } from 'lucide-react';
import { useState } from 'react';

interface MemberCardProps {
    member: GroupMember;
    isOwner: boolean;
    isAdmin: boolean;
    onKick?: (userId: number) => void;
    onPromote?: (userId: number) => void;
    onDemote?: (userId: number) => void;
}

export default function MemberCard({
    member,
    isOwner,
    isAdmin,
    onKick,
    onPromote,
    onDemote,
}: MemberCardProps) {
    const { user } = useAuth();
    const [showMenu, setShowMenu] = useState(false);
    const canManage = (isOwner || isAdmin) && member.user_id !== user?.id && member.role !== 'owner';

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'owner':
                return 'Chủ nhóm';
            case 'admin':
                return 'Quản trị viên';
            default:
                return 'Thành viên';
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'owner':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
            case 'admin':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 flex-1">
                <Avatar src={member.user.avatar} name={member.user.name} size="lg" />
                <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                        {member.user.name}
                    </h4>
                    <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(
                            member.role
                        )}`}
                    >
                        {getRoleLabel(member.role)}
                    </span>
                </div>
            </div>

            {canManage && (
                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <MoreVertical className="w-5 h-5" />
                    </button>

                    {showMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowMenu(false)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-20 border border-gray-200 dark:border-gray-700">
                                {member.role === 'member' && (
                                    <button
                                        onClick={() => {
                                            onPromote?.(member.user_id);
                                            setShowMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        Thăng làm admin
                                    </button>
                                )}
                                {member.role === 'admin' && isOwner && (
                                    <button
                                        onClick={() => {
                                            onDemote?.(member.user_id);
                                            setShowMenu(false);
                                        }}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                                    >
                                        <UserDown className="w-4 h-4" />
                                        Hạ về thành viên
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        if (confirm('Bạn có chắc chắn muốn xóa thành viên này?')) {
                                            onKick?.(member.user_id);
                                        }
                                        setShowMenu(false);
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                                >
                                    <UserMinus className="w-4 h-4" />
                                    Xóa khỏi nhóm
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

