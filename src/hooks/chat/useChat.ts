import { useState, useEffect, useCallback, useRef } from 'react';
import { getEcho } from '@/libs/echo';
import { chatApi } from '@/api/chat';
import type {
    ChatThread,
    ChatMessage,
    TypingUser,
    UseChatReturn,
} from '@/types/public/chat-type';

export const useChat = (currentUserId: number): UseChatReturn => {
    const [threads, setThreads] = useState<ChatThread[]>([]);
    const [currentThreadId, setCurrentThreadId] = useState<number | null>(null);
    const [messages, setMessages] = useState<Record<number, ChatMessage[]>>({});
    const [typingUsers, setTypingUsers] = useState<Record<number, TypingUser[]>>({});
    const [unreadCounts, setUnreadCounts] = useState<Record<number, number>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [hasMoreMessages, setHasMoreMessages] = useState<Record<number, boolean>>({});
    const [currentPage, setCurrentPage] = useState<Record<number, number>>({});

    const echoRef = useRef<any>(null);
    const typingTimeoutRef = useRef<Record<number, NodeJS.Timeout>>({});
    const channelRef = useRef<any>(null);

    // Load threads
    const loadThreads = useCallback(async () => {
        try {
            const data = await chatApi.getThreads();
            setThreads(data);
        } catch (error) {
            console.error('Failed to load threads:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load messages for a thread
    const loadMessages = useCallback(async (threadId: number, page: number = 1) => {
        try {
            const response = await chatApi.getMessages(threadId, { limit: 30, page });
            const existingMessages = messages[threadId] || [];

            if (page === 1) {
                setMessages((prev) => ({
                    ...prev,
                    [threadId]: response.data.reverse(), // Reverse để oldest first
                }));
            } else {
                setMessages((prev) => ({
                    ...prev,
                    [threadId]: [...response.data.reverse(), ...existingMessages],
                }));
            }

            setHasMoreMessages((prev) => ({
                ...prev,
                [threadId]: response.current_page < response.last_page,
            }));

            setCurrentPage((prev) => ({
                ...prev,
                [threadId]: response.current_page,
            }));
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    }, [messages]);

    // Select thread
    const selectThread = useCallback(async (threadId: number) => {
        // Unsubscribe from previous channel
        if (channelRef.current) {
            channelRef.current.stopListening('.message.created');
            channelRef.current.stopListening('.thread.read');
            channelRef.current.stopListening('.user.typing');
            channelRef.current = null;
        }

        setCurrentThreadId(threadId);

        // Load messages if not loaded
        if (!messages[threadId]) {
            await loadMessages(threadId, 1);
        }

        // Mark as read
        try {
            await chatApi.markAsRead(threadId);
            setUnreadCounts((prev) => ({ ...prev, [threadId]: 0 }));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }

        // Subscribe to channel
        if (echoRef.current) {
            const channel = echoRef.current.private(`chat.thread.${threadId}`);
            channelRef.current = channel;

            // Listen for new messages
            channel.listen('.message.created', (e: { message: ChatMessage }) => {
                setMessages((prev) => {
                    const existing = prev[threadId] || [];
                    return {
                        ...prev,
                        [threadId]: [...existing, e.message],
                    };
                });

                // Auto mark as read if thread is active
                chatApi.markAsRead(threadId).catch(console.error);
            });

            // Listen for read receipts
            channel.listen('.thread.read', (e: { userId: number; userName: string }) => {
                // Update read receipts in messages
                // Implementation depends on your read receipt logic
            });

            // Listen for typing
            channel.listen('.user.typing', (e: { userId: number; userName: string }) => {
                if (e.userId === currentUserId) return;

                setTypingUsers((prev) => {
                    const existing = prev[threadId] || [];
                    const filtered = existing.filter((u) => u.userId !== e.userId);
                    return {
                        ...prev,
                        [threadId]: [
                            ...filtered,
                            { userId: e.userId, userName: e.userName, timestamp: Date.now() },
                        ],
                    };
                });

                // Auto remove typing indicator after 3 seconds
                if (typingTimeoutRef.current[threadId]) {
                    clearTimeout(typingTimeoutRef.current[threadId]);
                }

                typingTimeoutRef.current[threadId] = setTimeout(() => {
                    setTypingUsers((prev) => ({
                        ...prev,
                        [threadId]: (prev[threadId] || []).filter((u) => u.userId !== e.userId),
                    }));
                }, 3000);
            });
        }
    }, [messages, loadMessages, currentUserId]);

    // Send message
    const sendMessage = useCallback(
        async (content: string, attachments?: string[]) => {
            if (!currentThreadId) return;
    
            setIsSending(true);
            try {
                await chatApi.sendMessage(currentThreadId, {
                    content,
                    attachments,
                });
    
                // ❌ Bỏ đoạn optimistic update (KHÔNG append tin nhắn nữa)
                // UI sẽ nhận tin từ socket trả về là dữ liệu đầy đủ
            } catch (error) {
                console.error('Failed to send message:', error);
                throw error;
            } finally {
                setIsSending(false);
            }
        },
        [currentThreadId]
    );    

    // Mark as read
    const markAsRead = useCallback(async () => {
        if (!currentThreadId) return;
        try {
            await chatApi.markAsRead(currentThreadId);
            setUnreadCounts((prev) => ({ ...prev, [currentThreadId]: 0 }));
        } catch (error) {
            console.error('Failed to mark as read:', error);
        }
    }, [currentThreadId]);

    // React to message
    const reactToMessage = useCallback(
        async (messageId: number, reactionType: string) => {
            try {
                await chatApi.reactToMessage(messageId, reactionType);
                // Update local state
                setMessages((prev) => {
                    const updated = { ...prev };
                    Object.keys(updated).forEach((threadId) => {
                        updated[Number(threadId)] = updated[Number(threadId)].map((msg) => {
                            if (msg.id === messageId) {
                                // Add or update reaction
                                const existingReactions = msg.reactions || [];
                                const userReaction = existingReactions.find(
                                    (r) => r.user_id === currentUserId
                                );

                                if (userReaction) {
                                    // Update existing
                                    return {
                                        ...msg,
                                        reactions: existingReactions.map((r) =>
                                            r.user_id === currentUserId
                                                ? { ...r, reaction_type: reactionType }
                                                : r
                                        ),
                                    };
                                } else {
                                    // Add new
                                    return {
                                        ...msg,
                                        reactions: [
                                            ...existingReactions,
                                            {
                                                id: Date.now(), // Temporary ID
                                                user_id: currentUserId,
                                                reaction_type: reactionType,
                                            },
                                        ],
                                    };
                                }
                            }
                            return msg;
                        });
                    });
                    return updated;
                });
            } catch (error) {
                console.error('Failed to react to message:', error);
            }
        },
        [currentUserId]
    );

    // Remove reaction
    const removeReaction = useCallback(async (messageId: number) => {
        try {
            await chatApi.removeReaction(messageId);
            // Update local state
            setMessages((prev) => {
                const updated = { ...prev };
                Object.keys(updated).forEach((threadId) => {
                    updated[Number(threadId)] = updated[Number(threadId)].map((msg) => {
                        if (msg.id === messageId) {
                            return {
                                ...msg,
                                reactions: (msg.reactions || []).filter(
                                    (r) => r.user_id !== currentUserId
                                ),
                            };
                        }
                        return msg;
                    });
                });
                return updated;
            });
        } catch (error) {
            console.error('Failed to remove reaction:', error);
        }
    }, [currentUserId]);

    // Load more messages
    const loadMoreMessages = useCallback(async () => {
        if (!currentThreadId || !hasMoreMessages[currentThreadId]) return;

        const nextPage = (currentPage[currentThreadId] || 1) + 1;
        await loadMessages(currentThreadId, nextPage);
    }, [currentThreadId, hasMoreMessages, currentPage, loadMessages]);

    // Initialize Echo
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                echoRef.current = getEcho();
            } catch (error) {
                console.error('Failed to initialize Echo:', error);
            }
        }

        return () => {
            // Cleanup typing timeouts
            Object.values(typingTimeoutRef.current).forEach((timeout) => {
                clearTimeout(timeout);
            });
        };
    }, []);

    // Load threads on mount
    useEffect(() => {
        loadThreads();
    }, [loadThreads]);

    const currentThread = threads.find((t) => t.id === currentThreadId) || null;
    const currentMessages = currentThreadId ? messages[currentThreadId] || [] : [];
    const currentTypingUsers = currentThreadId ? typingUsers[currentThreadId] || [] : [];

    return {
        threads,
        currentThread,
        messages: currentMessages,
        isLoading,
        isSending,
        typingUsers: currentTypingUsers,
        unreadCounts,
        selectThread,
        sendMessage,
        markAsRead,
        reactToMessage,
        removeReaction,
        loadMoreMessages,
        hasMoreMessages: currentThreadId ? hasMoreMessages[currentThreadId] || false : false,
    };
};