"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import ThreadItem from "./ThreadItem";
import Loading from "@/components/common/LoadingScreen";
import type { ThreadListProps, ChatThread } from "@/types/public/chat-type";
import { Search, Users, MessageCircle, Bot } from "lucide-react";

export default function ThreadList({
    threads,
    currentThreadId,
    onSelectThread,
    unreadCounts,
    currentUserId,
    isLoading,
    onSelectAIChat,
    isAIChatActive,
}: ThreadListProps & { 
    currentUserId: number; 
    isLoading?: boolean;
    onSelectAIChat?: () => void;
    isAIChatActive?: boolean;
}) {
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    // Separate direct and group threads
    const { directThreads, groupThreads } = useMemo(() => {
        const direct: ChatThread[] = [];
        const group: ChatThread[] = [];

        threads.forEach((thread) => {
            if (thread.type === "group") {
                group.push(thread);
            } else {
                direct.push(thread);
            }
        });

        return { directThreads: direct, groupThreads: group };
    }, [threads]);

    // Filter threads based on search query
    const filterThreads = (threadsToFilter: ChatThread[]) => {
        return threadsToFilter.filter((thread) => {
            if (!searchQuery) return true;

            const otherParticipant = thread.participants.find(
                (p) => p.user_id !== currentUserId
            );
            const threadName =
                thread.type === "direct"
                    ? otherParticipant?.user.name || ""
                    : thread.name || "";

            return threadName.toLowerCase().includes(searchQuery.toLowerCase());
        });
    };

    const filteredDirectThreads = filterThreads(directThreads);
    const filteredGroupThreads = filterThreads(groupThreads);

    const handleGroupThreadClick = (thread: ChatThread) => {
        // Navigate to group detail page with chat tab
        if (thread.group_id && thread.group?.slug) {
            router.push(`/groups/${thread.group.slug}?tab=chat`);
        } else if (thread.group_id) {
            // If we have group_id but no slug, we might need to fetch it
            // For now, fallback to regular thread selection
            onSelectThread(thread.id);
        } else {
            // Fallback to regular thread selection
            onSelectThread(thread.id);
        }
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loading text="Đang tải..." type="dots" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                    Tin nhắn
                </h2>
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm cuộc trò chuyện..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Threads List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {/* AI Assistant Thread */}
                {onSelectAIChat && (
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <div
                            onClick={onSelectAIChat}
                            className={`
                                flex items-center gap-3 p-3 cursor-pointer transition-colors rounded-lg
                                hover:bg-gray-100 dark:hover:bg-gray-800
                                ${isAIChatActive ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500" : ""}
                            `}
                        >
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className={`
                                    font-semibold text-sm
                                    ${isAIChatActive ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-gray-100"}
                                `}>
                                    🤖 AI Assistant
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                                    Trợ lý học tập thông minh
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {filteredDirectThreads.length === 0 && filteredGroupThreads.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                        <p className="text-gray-500 dark:text-gray-400">
                            {searchQuery
                                ? "Không tìm thấy cuộc trò chuyện nào"
                                : "Chưa có cuộc trò chuyện nào"}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Direct Messages Section */}
                        {filteredDirectThreads.length > 0 && (
                            <div className="px-4 py-2">
                                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                    Tin nhắn trực tiếp
                                </h3>
                                {filteredDirectThreads.map((thread) => (
                                    <ThreadItem
                                        key={thread.id}
                                        thread={thread}
                                        isActive={thread.id === currentThreadId}
                                        unreadCount={unreadCounts[thread.id] || 0}
                                        onClick={() => onSelectThread(thread.id)}
                                        currentUserId={currentUserId}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Group Chats Section */}
                        {filteredGroupThreads.length > 0 && (
                            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <Users className="w-4 h-4" />
                                    Nhóm chat
                                </h3>
                                {filteredGroupThreads.map((thread) => (
                                    <ThreadItem
                                        key={thread.id}
                                        thread={thread}
                                        isActive={thread.id === currentThreadId}
                                        unreadCount={unreadCounts[thread.id] || 0}
                                        onClick={() => handleGroupThreadClick(thread)}
                                        currentUserId={currentUserId}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

