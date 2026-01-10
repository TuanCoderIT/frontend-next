"use client";

import ChatHeader from "./ChatHeader";
import MessagesList from "./MessagesList";
import MessageInput from "./MessageInput";
import type { ChatWindowProps } from "@/types/public/chat-type";

interface ExtendedChatWindowProps extends ChatWindowProps {
    threadId: number | null;
    onLoadMore?: () => void;
    hasMore?: boolean;
    isLoadingMore?: boolean;
}

export default function ChatWindow({
    thread,
    messages,
    currentUserId,
    onSendMessage,
    onMarkAsRead,
    onReact,
    onRemoveReaction,
    typingUsers,
    threadId,
    onLoadMore,
    hasMore = false,
    isLoadingMore = false,
}: ExtendedChatWindowProps) {
    if (!thread) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                        Chọn một cuộc trò chuyện để bắt đầu
                    </p>
                </div>
            </div>
        );
    }

    const handleReact = async (messageId: number, reactionType: string) => {
        // Check if user already reacted with this type
        const message = messages.find((m) => m.id === messageId);
        const userReaction = message?.reactions?.find(
            (r) => r.user_id === currentUserId && r.reaction_type === reactionType
        );

        if (userReaction) {
            // Remove reaction if already exists
            await onRemoveReaction(messageId);
        } else {
            // Add or update reaction
            await onReact(messageId, reactionType);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900">
            {/* Header */}
            <ChatHeader thread={thread} currentUserId={currentUserId} />

            {/* Messages List */}
            <MessagesList
                messages={messages}
                currentUserId={currentUserId}
                typingUsers={typingUsers}
                onReact={handleReact}
                onLoadMore={onLoadMore}
                hasMore={hasMore}
                isLoadingMore={isLoadingMore}
            />

            {/* Input Area */}
            <MessageInput
                onSend={onSendMessage}
                disabled={false}
                threadId={threadId}
            />
        </div>
    );
}

