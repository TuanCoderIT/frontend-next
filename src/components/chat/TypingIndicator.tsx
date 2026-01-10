"use client";

import type { TypingUser } from "@/types/public/chat-type";

interface TypingIndicatorProps {
    typingUsers: TypingUser[];
}

export default function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
    if (typingUsers.length === 0) return null;

    const names = typingUsers.map((u) => u.userName).join(", ");

    return (
        <div className="px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                {names} {typingUsers.length === 1 ? "đang gõ..." : "đang gõ..."}
            </span>
        </div>
    );
}

