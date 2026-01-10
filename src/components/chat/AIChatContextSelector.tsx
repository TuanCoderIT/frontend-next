"use client";

import { ChevronDown, BookOpen, FileText, MessageCircle } from "lucide-react";
import type { AIChatContext } from "@/types/ai-chat";

interface AIChatContextSelectorProps {
  currentContext: AIChatContext;
  onContextChange: (context: AIChatContext) => void;
  availableContexts?: AIChatContext[];
}

export default function AIChatContextSelector({
  currentContext,
  onContextChange,
  availableContexts = [],
}: AIChatContextSelectorProps) {
  const getContextIcon = (type: string) => {
    switch (type) {
      case "course":
        return <BookOpen className="w-4 h-4" />;
      case "exam":
        return <FileText className="w-4 h-4" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getContextLabel = (context: AIChatContext) => {
    switch (context.type) {
      case "course":
        return context.name ? `Khóa học: ${context.name}` : "Khóa học";
      case "exam":
        return context.name ? `Đề thi: ${context.name}` : "Đề thi";
      default:
        return "Tổng quát";
    }
  };

  const allContexts = [
    { type: "general" as const },
    ...availableContexts,
  ];

  return (
    <div className="relative">
      <select
        value={`${currentContext.type}-${currentContext.id || ""}`}
        onChange={(e) => {
          const [type, id] = e.target.value.split("-");
          const selectedContext = allContexts.find(
            (ctx) => ctx.type === type && (ctx.id?.toString() || "") === id
          );
          if (selectedContext) {
            onContextChange(selectedContext);
          }
        }}
        className="appearance-none w-full px-3 py-2 pr-8 bg-gray-50 dark:bg-gray-800 
                 border border-gray-300 dark:border-gray-600 rounded-lg
                 text-sm text-gray-900 dark:text-gray-100
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {allContexts.map((context) => (
          <option
            key={`${context.type}-${context.id || ""}`}
            value={`${context.type}-${context.id || ""}`}
          >
            {getContextLabel(context)}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );
}