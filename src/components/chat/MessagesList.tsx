"use client";

import { useEffect, useRef } from "react";
import { isSameDay, formatDateSeparator } from "@/libs/dateFormat";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import type { ChatMessage, TypingUser } from "@/types/public/chat-type";

interface MessagesListProps {
    messages: ChatMessage[];
    currentUserId: number;
    typingUsers: TypingUser[];
    onReact: (messageId: number, reactionType: string) => void;
    onLoadMore?: () => void;
    hasMore?: boolean;
    isLoadingMore?: boolean;
}

export default function MessagesList({
    messages,
    currentUserId,
    typingUsers,
    onReact,
    onLoadMore,
    hasMore = false,
    isLoadingMore = false,
}: MessagesListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const prevMessagesLengthRef = useRef(messages.length);

    // Auto scroll to bottom when new messages arrive
    useEffect(() => {
        if (messages.length > prevMessagesLengthRef.current) {
            scrollToBottom();
        }
        prevMessagesLengthRef.current = messages.length;
    }, [messages.length]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Handle infinite scroll
    const handleScroll = () => {
        if (!messagesContainerRef.current || !onLoadMore || !hasMore || isLoadingMore) {
            return;
        }

        const container = messagesContainerRef.current;
        const scrollTop = container.scrollTop;

        // Load more when scrolled to top (within 100px)
        if (scrollTop < 100) {
            onLoadMore();
        }
    };

    // Group messages by date and determine if we should show avatar/name
    const processedMessages = messages.map((message, index) => {
        const prevMessage = index > 0 ? messages[index - 1] : null;
        const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;

        const isOwn = message.user_id === currentUserId;
        const isFirstInGroup =
            !prevMessage ||
            prevMessage.user_id !== message.user_id ||
            !isSameDay(prevMessage.created_at, message.created_at);

        const showDateSeparator =
            !prevMessage || !isSameDay(prevMessage.created_at, message.created_at);

        const showAvatar = !isOwn && isFirstInGroup;
        const showName = !isOwn && isFirstInGroup;

        return {
            message,
            showDateSeparator,
            showAvatar,
            showName,
        };
    });

    return (
        <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50 dark:bg-gray-900"
        >
            {/* Load More Indicator */}
            {isLoadingMore && (
                <div className="flex justify-center py-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Đang tải thêm tin nhắn...
                    </div>
                </div>
            )}

            <div className="py-4">
                {processedMessages.map(({ message, showDateSeparator, showAvatar, showName }, index) => (
                    <div key={message.id}>
                        {/* Date Separator */}
                        {showDateSeparator && (
                            <div className="flex justify-center my-4">
                                <div className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs text-gray-600 dark:text-gray-400">
                                    {formatDateSeparator(message.created_at)}
                                </div>
                            </div>
                        )}

                        {/* Message Bubble */}
                        <MessageBubble
                            message={message}
                            isOwn={message.user_id === currentUserId}
                            showAvatar={showAvatar}
                            showName={showName}
                            onReact={(reactionType) => onReact(message.id, reactionType)}
                            currentUserId={currentUserId}
                        />
                    </div>
                ))}

                {/* Typing Indicator */}
                <TypingIndicator typingUsers={typingUsers} />

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
}

