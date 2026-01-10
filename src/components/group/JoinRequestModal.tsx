"use client";

import { useGroupJoinRequests } from '@/hooks/group/useGroupJoinRequests';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/admin/common/Avatar';
import { X, Check, XCircle, Loader2 } from 'lucide-react';
import { formatRelativeTime } from '@/libs/dateFormat';

interface JoinRequestModalProps {
    groupId: number;
    isOpen: boolean;
    onClose: () => void;
}

export default function JoinRequestModal({
    groupId,
    isOpen,
    onClose,
}: JoinRequestModalProps) {
    const { user } = useAuth();
    const { requests, isLoading, approveRequest, rejectRequest, isApproving, isRejecting } =
        useGroupJoinRequests(groupId);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                {/* Backdrop */}
                <div
                    className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
                    onClick={onClose}
                />

                {/* Modal */}
                <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Yêu cầu tham gia nhóm
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-4 max-h-96 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                            </div>
                        ) : requests.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 dark:text-gray-400">
                                    Không có yêu cầu nào đang chờ duyệt
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {requests
                                    .filter((req) => req.status === 'pending')
                                    .map((request) => (
                                        <div
                                            key={request.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar
                                                    src={request.user.avatar || undefined}
                                                    name={request.user.name}
                                                    size="md"
                                                />
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                                        {request.user.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {formatRelativeTime(request.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => approveRequest(request.id)}
                                                    disabled={isApproving || isRejecting}
                                                    className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 disabled:opacity-50"
                                                >
                                                    <Check className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => rejectRequest(request.id)}
                                                    disabled={isApproving || isRejecting}
                                                    className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-50"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

