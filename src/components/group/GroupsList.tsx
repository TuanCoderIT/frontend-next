"use client";

import { useState, useMemo } from 'react';
import { useGroups } from '@/hooks/group/useGroups';
import GroupCard from './GroupCard';
import CreateGroupModal from './CreateGroupModal';
import SearchBar from '@/components/admin/common/SearchBar';
import Pagination from '@/components/common/Pagination';
import Loading from '@/components/common/LoadingScreen';
import { Grid, List, Filter, Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type ViewMode = 'grid' | 'list';
type SortBy = 'latest' | 'members' | 'oldest';

export default function GroupsList() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'public' | 'private'>('all');
    const [sortBy, setSortBy] = useState<SortBy>('latest');
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const { groups, pagination, isLoading, refresh } = useGroups({
        search: searchQuery || undefined,
        visibility: visibilityFilter !== 'all' ? visibilityFilter : undefined,
        page: currentPage,
    });

    // Check membership for each group (simplified - in real app, this would come from API)
    const groupsWithMembership = useMemo(() => {
        return groups.map((group) => {
            // This is a simplified check - in production, the API should return membership status
            const isMember = false; // Would need to check from group detail or separate endpoint
            return { ...group, isMember };
        });
    }, [groups]);

    if (isLoading && !groups.length) {
        return (
            <div className="min-h-screen">
                <Loading text="Đang tải nhóm..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Nhóm Học Tập
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Khám phá và tham gia các nhóm học tập cùng nhau
                        </p>
                    </div>
                    {user && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Tạo nhóm
                        </button>
                    )}
                </div>

                {/* Filters and Search */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <SearchBar
                                placeholder="Tìm kiếm nhóm..."
                                onSearch={setSearchQuery}
                                value={searchQuery}
                            />
                        </div>

                        {/* Visibility Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-500" />
                            <select
                                value={visibilityFilter}
                                onChange={(e) => {
                                    setVisibilityFilter(e.target.value as any);
                                    setCurrentPage(1);
                                }}
                                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">Tất cả</option>
                                <option value="public">Công khai</option>
                                <option value="private">Riêng tư</option>
                            </select>
                        </div>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value as SortBy);
                                setCurrentPage(1);
                            }}
                            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="latest">Mới nhất</option>
                            <option value="members">Nhiều thành viên</option>
                            <option value="oldest">Cũ nhất</option>
                        </select>

                        {/* View Toggle */}
                        <div className="flex items-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded ${viewMode === 'grid'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded ${viewMode === 'list'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Groups Grid/List */}
                {groupsWithMembership.length === 0 ? (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                            {searchQuery
                                ? 'Không tìm thấy nhóm nào phù hợp'
                                : 'Chưa có nhóm nào'}
                        </p>
                        {!searchQuery && user && (
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Tạo nhóm đầu tiên
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <div
                            className={
                                viewMode === 'grid'
                                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6'
                                    : 'space-y-4 mb-6'
                            }
                        >
                            {groupsWithMembership.map((group) => (
                                <GroupCard
                                    key={group.id}
                                    group={group}
                                    isMember={group.isMember}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.total > 0 && (
                            <Pagination
                                currentPage={pagination.currentPage}
                                pageSize={20}
                                totalItems={pagination.total}
                                onPageChange={setCurrentPage}
                                showPageSizeDropdown={false}
                            />
                        )}
                    </>
                )}
            </div>

            {/* Create Group Modal */}
            <CreateGroupModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onSuccess={() => {
                    refresh();
                    setShowCreateModal(false);
                }}
            />
        </div>
    );
}

