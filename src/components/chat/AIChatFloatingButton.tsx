"use client";

import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import AIChatWindow from "./AIChatWindow";
import { useAIChat } from "@/hooks/useAIChat";
import type { AIChatContext } from "@/types/ai-chat";

interface AIChatFloatingButtonProps {
  context: AIChatContext;
  className?: string;
}

export default function AIChatFloatingButton({ 
  context, 
  className = "" 
}: AIChatFloatingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const {
    messages,
    isLoading,
    currentContext,
    sendMessage,
    updateContext,
  } = useAIChat(context);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && context !== currentContext) {
      updateContext(context);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleToggle}
        className={`
          fixed bottom-6 right-6 z-40
          w-14 h-14 bg-blue-500 hover:bg-blue-600 
          text-white rounded-full shadow-lg
          flex items-center justify-center
          transition-all duration-200 hover:scale-110
          ${className}
        `}
        aria-label="Open AI Chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Chat Window */}
          <div className="relative w-full max-w-md h-[600px] bg-white dark:bg-gray-900 rounded-lg shadow-xl overflow-hidden">
            <AIChatWindow
              messages={messages}
              isLoading={isLoading}
              currentContext={currentContext}
              onSendMessage={sendMessage}
              onContextChange={updateContext}
              availableContexts={[context]}
            />
          </div>
        </div>
      )}
    </>
  );
}