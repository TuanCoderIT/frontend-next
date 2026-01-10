"use client";

import { formatRelativeTime } from "@/libs/dateFormat";
import Avatar from "@/components/admin/common/Avatar";
import type { ThreadItemProps } from "@/types/public/chat-type";

export default function ThreadItem({
    thread,
    isActive,
    unreadCount,
    onClick,
    currentUserId,
}: ThreadItemProps) {
    // Get the other participant for direct messages
    const otherParticipant = thread.participants.find(
        (p) => p.user_id !== currentUserId
    );

    // Get thread name
    const threadName =
        thread.type === "direct"
            ? otherParticipant?.user.name || "Unknown User"
            : thread.name || "Group Chat";

    // Get last message preview (you might need to add this to thread data)
    const lastMessage = ""; // This would come from thread.last_message if available

    // Get last updated time
    const lastUpdated = thread.updated_at;

    return (
        <div
            onClick={onClick}
            className={`
        flex items-center gap-3 p-3 cursor-pointer transition-colors
        hover:bg-gray-100 dark:hover:bg-gray-800
        ${isActive ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500" : ""}
      `}
        >
            <div className="relative flex-shrink-0">
                <Avatar
                    name={threadName}
                    size="md"
                    className="ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900"
                />
                {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <h3
                        className={`
              font-semibold text-sm truncate
              ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-gray-100"}
              ${unreadCount > 0 ? "font-bold" : ""}
            `}
                    >
                        {threadName}
                    </h3>
                    {lastUpdated && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                            {formatRelativeTime(lastUpdated)}
                        </span>
                    )}
                </div>
                {lastMessage && (
                    <p
                        className={`
              text-sm truncate mt-1
              ${unreadCount > 0
                                ? "text-gray-900 dark:text-gray-100 font-medium"
                                : "text-gray-600 dark:text-gray-400"
                            }
            `}
                    >
                        {lastMessage}
                    </p>
                )}
            </div>
        </div>
    );
}

