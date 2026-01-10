"use client";

import { useGroupChat } from '@/hooks/group/useGroupChat';
import { useAuth } from '@/context/AuthContext';
import ChatWindow from '@/components/chat/ChatWindow';
import Loading from '@/components/common/LoadingScreen';
import { useEffect } from 'react';

interface GroupChatTabProps {
    groupId: number;
}

export default function GroupChatTab({ groupId }: GroupChatTabProps) {
    const { user } = useAuth();
    const { thread, messages, typingUsers, sendMessage, markAsRead, refreshThread } = useGroupChat(groupId);

    useEffect(() => {
        if (thread) {
            markAsRead();
        }
    }, [thread, markAsRead]);

    if (!user) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-gray-500 dark:text-gray-400">
                    Vui lòng đăng nhập để sử dụng tính năng chat
                </p>
            </div>
        );
    }

    if (!thread) {
        return (
            <div className="py-8">
                <Loading text="Đang tải chat..." />
            </div>
        );
    }

    const handleSendMessage = async (content: string, attachments?: string[]) => {
        await sendMessage(content, attachments);
    };

    const handleReact = async (messageId: number, reactionType: string) => {
        // Implement reaction logic if needed
        console.log('React to message', messageId, reactionType);
    };

    const handleRemoveReaction = async (messageId: number) => {
        // Implement remove reaction logic if needed
        console.log('Remove reaction from message', messageId);
    };

    return (
        <div className="h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            <ChatWindow
                thread={thread}
                messages={messages}
                currentUserId={user.id}
                onSendMessage={handleSendMessage}
                onMarkAsRead={markAsRead}
                onReact={handleReact}
                onRemoveReaction={handleRemoveReaction}
                typingUsers={typingUsers}
                threadId={thread.id}
            />
        </div>
    );
}

