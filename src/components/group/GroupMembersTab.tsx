"use client";

import { useState } from 'react';
import { useGroupMembers } from '@/hooks/group/useGroupMembers';
import { useAuth } from '@/context/AuthContext';
import MemberCard from './MemberCard';
import SearchBar from '@/components/admin/common/SearchBar';
import Loading from '@/components/common/LoadingScreen';
import { Users, Search } from 'lucide-react';

interface GroupMembersTabProps {
    groupId: number;
    isOwner: boolean;
    isAdmin: boolean;
}

export default function GroupMembersTab({
    groupId,
    isOwner,
    isAdmin,
}: GroupMembersTabProps) {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'owner' | 'admin' | 'member'>('all');

    const { members, isLoading, kickMember, promoteMember, demoteMember } = useGroupMembers(
        groupId,
        {
            search: searchQuery || undefined,
            role: roleFilter !== 'all' ? roleFilter : undefined,
        }
    );

    if (isLoading) {
        return (
            <div className="py-8">
                <Loading text="Đang tải thành viên..." />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
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
                        onChange={(e) => setRoleFilter(e.target.value as any)}
                        className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Tất cả vai trò</option>
                        <option value="owner">Chủ nhóm</option>
                        <option value="admin">Quản trị viên</option>
                        <option value="member">Thành viên</option>
                    </select>
                </div>
            </div>

            {/* Members List */}
            {members.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
                    <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                        {searchQuery || roleFilter !== 'all'
                            ? 'Không tìm thấy thành viên nào'
                            : 'Chưa có thành viên nào'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {members.map((member) => (
                        <MemberCard
                            key={member.id}
                            member={member}
                            isOwner={isOwner}
                            isAdmin={isAdmin}
                            onKick={kickMember}
                            onPromote={promoteMember}
                            onDemote={demoteMember}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

