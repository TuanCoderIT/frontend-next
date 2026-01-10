import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { chatApi } from '@/api/chat';
import { ChatThread, ChatMessage, TypingUser } from '@/types/public/chat-type'; // Từ chat system
import { getEcho } from '@/libs/echo'; // Hook setup Echo

export function useGroupChat(groupId: number) {
    const echo = getEcho();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);

    // Lấy group thread
    const { data: thread, mutate: refreshThread } = useSWR<ChatThread>(
        ['group-thread', groupId],
        async () => {
            // Option 1: Nếu có endpoint riêng
            return chatApi.getGroupThread(groupId).then(res => res.data);

            //   // Option 2: Filter từ all threads
            //   const threads = await chatApi.getThreads().then((res) => res.data);
            //   return (
            //     threads.find((t) => t.type === 'group' && t.group_id === groupId) ||
            //     null
            //   );
        }
    );

    // Load messages
    useEffect(() => {
        if (!thread) return;

        const loadMessages = async () => {
            try {
                const response = await chatApi.getMessages(thread.id);
                setMessages(response.data || []);
            } catch (err) {
                console.error('Failed to load messages:', err);
            }
        };

        loadMessages();
    }, [thread]);

    // Subscribe to realtime events
    useEffect(() => {
        if (!thread || !echo) return;

        const channel = echo.private(`chat.thread.${thread.id}`);

        channel
            .listen('.message.created', (e: { message: ChatMessage }) => {
                setMessages((prev) => [...prev, e.message]);
            })
            .listen('.user.typing', (e: { userId: number; userName: string }) => {
                const typingUser: TypingUser = {
                    userId: e.userId,
                    userName: e.userName,
                    timestamp: Date.now(),
                };
                setTypingUsers((prev) => {
                    const exists = prev.find((u) => u.userId === e.userId);
                    if (!exists) {
                        return [...prev, typingUser];
                    }
                    return prev.map((u) => (u.userId === e.userId ? typingUser : u));
                });
                // Clear typing after 3 seconds
                setTimeout(() => {
                    setTypingUsers((prev) => prev.filter((u) => u.userId !== e.userId));
                }, 3000);
            });

        return () => {
            channel.stopListening('.message.created');
            channel.stopListening('.user.typing');
        };
    }, [thread, echo]);

    const sendMessage = async (content: string, attachments?: string[]) => {
        if (!thread) return;

        try {
            const response = await chatApi.sendMessage(thread.id, {
                content,
                attachments,
            });
            // Message sẽ được thêm qua realtime event
            return response;
        } catch (err) {
            throw err;
        }
    };

    const markAsRead = async () => {
        if (!thread) return;
        try {
            await chatApi.markAsRead(thread.id);
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    return {
        thread,
        messages,
        typingUsers,
        sendMessage,
        markAsRead,
        refreshThread,
    };
}