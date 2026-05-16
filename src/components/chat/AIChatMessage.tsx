"use client";

import { formatRelativeTime } from "@/libs/dateFormat";
import type { AIChatMessage } from "@/types/public/ai-chat";
import { Bot, User, BookOpen, FileText } from "lucide-react";

interface AIChatMessageProps {
  message: AIChatMessage;
}

export default function AIChatMessage({ message }: AIChatMessageProps) {
  const isAI = message.type === "ai";

  return (
    <div
      className={`flex gap-3 mb-4 ${isAI ? "justify-start" : "justify-end"}`}
    >
      {isAI && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
        </div>
      )}

      <div className={`max-w-[70%] ${isAI ? "order-2" : "order-1"}`}>
        <div
          className={`
            px-4 py-2 rounded-lg
            ${
              isAI
                ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                : "bg-blue-500 text-white"
            }
          `}
        >
          {isAI && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">AI Assistant</span>
              {message.contextUsed && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                  <BookOpen className="w-3 h-3" />
                  Context
                </span>
              )}
            </div>
          )}
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        <div
          className={`text-xs text-gray-500 mt-1 ${isAI ? "text-left" : "text-right"}`}
        >
          {formatRelativeTime(message.timestamp)}
        </div>
      </div>

      {!isAI && (
        <div className="flex-shrink-0 order-2">
          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      )}
    </div>
  );
}
