"use client";

import { MoreVertical } from "lucide-react";
import Avatar from "@/components/admin/common/Avatar";
import type { ChatThread } from "@/types/public/chat-type";

interface ChatHeaderProps {
    thread: ChatThread | null;
    currentUserId: number;
}

export default function ChatHeader({ thread, currentUserId }: ChatHeaderProps) {
    if (!thread) {
        return (
            <div className="h-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center px-4">
                <p className="text-gray-500 dark:text-gray-400">
                    Chọn một cuộc trò chuyện để bắt đầu
                </p>
            </div>
        );
    }

    // Get the other participant for direct messages
    const otherParticipant = thread.participants.find(
        (p) => p.user_id !== currentUserId
    );

    // Get thread name
    const threadName =
        thread.type === "direct"
            ? otherParticipant?.user.name || "Unknown User"
            : thread.name || "Group Chat";

    return (
        <div className="h-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
                <Avatar name={threadName} size="md" />
                <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {threadName}
                    </h3>
                    {/* You can add online status here if available */}
                </div>
            </div>

            <button
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="More options"
            >
                <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
        </div>
    );
}

