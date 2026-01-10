"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/hooks/chat/useChat";
import { useAIChat } from "@/hooks/useAIChat";
import { useAIChatContext } from "@/hooks/useAIChatContext";
import ThreadList from "@/components/chat/ThreadList";
import ChatWindow from "@/components/chat/ChatWindow";
import AIChatWindow from "@/components/chat/AIChatWindow";
import Loading from "@/components/common/LoadingScreen";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function ChatPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [showThreadList, setShowThreadList] = useState(true);
    const [chatMode, setChatMode] = useState<"regular" | "ai">("regular");

    // Regular chat hook
    const {
        threads,
        currentThread,
        messages,
        isLoading,
        isSending,
        typingUsers,
        unreadCounts,
        selectThread,
        sendMessage,
        markAsRead,
        reactToMessage,
        removeReaction,
        loadMoreMessages,
        hasMoreMessages,
    } = useChat(user?.id || 0);

    // AI chat hooks
    const aiContext = useAIChatContext();
    const {
        messages: aiMessages,
        isLoading: aiIsLoading,
        currentContext: aiCurrentContext,
        sendMessage: aiSendMessage,
        updateContext: aiUpdateContext,
    } = useAIChat(aiContext);

    // Redirect if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/auth/login");
        }
    }, [user, authLoading, router]);

    // On mobile, hide thread list when thread is selected
    useEffect(() => {
        if ((currentThread || chatMode === "ai") && window.innerWidth < 768) {
            setShowThreadList(false);
        }
    }, [currentThread, chatMode]);

    if (authLoading || isLoading) {
        return (
            <div className="h-screen">
                <Loading text="Đang tải..." fullScreen />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    const handleSelectThread = (threadId: number) => {
        selectThread(threadId);
        setChatMode("regular");
        if (window.innerWidth < 768) {
            setShowThreadList(false);
        }
    };

    const handleSelectAIChat = () => {
        setChatMode("ai");
        if (window.innerWidth < 768) {
            setShowThreadList(false);
        }
    };

    const handleBackToThreads = () => {
        setShowThreadList(true);
        setChatMode("regular");
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
            {/* Thread List Sidebar */}
            <div
                className={`
          ${showThreadList ? "flex" : "hidden"} 
          md:flex 
          w-full md:w-[30%] lg:w-[350px] 
          flex-shrink-0
          flex-col
        `}
            >
                <ThreadList
                    threads={threads}
                    currentThreadId={currentThread?.id || null}
                    onSelectThread={handleSelectThread}
                    unreadCounts={unreadCounts}
                    currentUserId={user.id}
                    isLoading={isLoading}
                    onSelectAIChat={handleSelectAIChat}
                    isAIChatActive={chatMode === "ai"}
                />
            </div>

            {/* Chat Window */}
            <div className="flex-1 flex flex-col min-w-0 relative">
                {/* Mobile back button */}
                {(currentThread || chatMode === "ai") && (
                    <button
                        onClick={handleBackToThreads}
                        className="md:hidden absolute top-4 left-4 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label="Back to threads"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    </button>
                )}
                
                {chatMode === "ai" ? (
                    <AIChatWindow
                        messages={aiMessages}
                        isLoading={aiIsLoading}
                        currentContext={aiCurrentContext}
                        onSendMessage={aiSendMessage}
                        onContextChange={aiUpdateContext}
                        availableContexts={[]}
                    />
                ) : (
                    <ChatWindow
                        thread={currentThread}
                        messages={messages}
                        currentUserId={user.id}
                        onSendMessage={sendMessage}
                        onMarkAsRead={markAsRead}
                        onReact={reactToMessage}
                        onRemoveReaction={removeReaction}
                        typingUsers={typingUsers}
                        threadId={currentThread?.id || null}
                        onLoadMore={loadMoreMessages}
                        hasMore={hasMoreMessages}
                        isLoadingMore={false}
                    />
                )}
            </div>
        </div>
    );
}

