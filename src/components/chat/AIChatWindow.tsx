"use client";

import { useEffect, useRef } from "react";
import { Bot, Loader2 } from "lucide-react";
import AIChatMessage from "./AIChatMessage";
import AIChatInput from "./AIChatInput";
import AIChatContextSelector from "./AIChatContextSelector";
import type {
  AIChatMessage as AIChatMessageType,
  AIChatContext,
} from "@/types/public/ai-chat";

interface AIChatWindowProps {
  messages: AIChatMessageType[];
  isLoading: boolean;
  currentContext: AIChatContext;
  onSendMessage: (message: string) => Promise<void>;
  onContextChange: (context: AIChatContext) => void;
  availableContexts?: AIChatContext[];
  showHeader?: boolean; // New prop to control header visibility
}

export default function AIChatWindow({
  messages,
  isLoading,
  currentContext,
  onSendMessage,
  onContextChange,
  availableContexts = [],
  showHeader = true, // Default to true for backward compatibility
}: AIChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getWelcomeMessage = () => {
    switch (currentContext.type) {
      case "course":
        return currentContext.name
          ? `Tôi đang xem khóa học "${currentContext.name}". Hãy hỏi tôi về nội dung này!`
          : "Hãy hỏi tôi về nội dung khóa học!";
      case "exam":
        return currentContext.name
          ? `Tôi đang xem đề thi "${currentContext.name}". Có câu hỏi gì về đề thi này không?`
          : "Hãy hỏi tôi về đề thi!";
      default:
        return "Xin chào! Tôi là trợ lý học tập AI. Bạn có câu hỏi gì về khóa học không?";
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header - only show if showHeader is true */}
      {showHeader && (
        <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                AI Assistant
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Trợ lý học tập thông minh
              </p>
            </div>
          </div>

          {/* Context Selector */}
          <AIChatContextSelector
            currentContext={currentContext}
            onContextChange={onContextChange}
            availableContexts={availableContexts}
          />
        </div>
      )}

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-blue-500" />
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {getWelcomeMessage()}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Gõ câu hỏi của bạn bên dưới để bắt đầu
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <AIChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex gap-3 mb-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="max-w-[70%]">
                  <div className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        AI đang suy nghĩ...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <AIChatInput
        onSend={onSendMessage}
        disabled={isLoading}
        placeholder="Hỏi AI về nội dung học tập..."
      />
    </div>
  );
}
