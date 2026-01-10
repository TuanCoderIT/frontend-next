"use client";

import { useState, useEffect } from "react";
import { Bot, X, Minimize2, Maximize2 } from "lucide-react";
import AIChatWindow from "./AIChatWindow";
import { useAIChat } from "@/hooks/useAIChat";
import { useAIChatContext } from "@/hooks/useAIChatContext";

interface GlobalAIChatbotProps {
  className?: string;
}

export default function GlobalAIChatbot({ className = "" }: GlobalAIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  // Auto-detect context from current page
  const autoContext = useAIChatContext();
  
  const {
    messages,
    isLoading,
    currentContext,
    sendMessage,
    updateContext,
  } = useAIChat(autoContext);

  // Update context when page changes
  useEffect(() => {
    if (autoContext.type !== currentContext.type || autoContext.id !== currentContext.id) {
      updateContext(autoContext);
    }
  }, [autoContext, currentContext, updateContext]);

  // Show notification dot when there are messages and chat is closed
  useEffect(() => {
    if (messages.length > 0 && !isOpen) {
      setHasNewMessage(true);
    }
  }, [messages.length, isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    setHasNewMessage(false);
    if (isMinimized) {
      setIsMinimized(false);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
          <button
            onClick={handleToggle}
            className="relative group w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 
                     hover:from-blue-600 hover:to-blue-700 text-white rounded-full shadow-lg 
                     flex items-center justify-center transition-all duration-300 
                     hover:scale-110 hover:shadow-xl animate-bounce-slow"
            aria-label="Open AI Assistant"
          >
            <Bot className="w-8 h-8" />
            
            {/* Notification dot */}
            {hasNewMessage && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full 
                           flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
            
            {/* Pulse ring animation */}
            <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"></div>
            
            {/* Tooltip */}
            <div className="absolute right-full mr-3 px-3 py-2 bg-gray-900 text-white text-sm 
                         rounded-lg opacity-0 group-hover:opacity-100 transition-opacity 
                         whitespace-nowrap pointer-events-none z-10">
              Chat với AI Assistant
              <div className="absolute top-1/2 -right-1 transform -translate-y-1/2 
                           border-l-4 border-l-gray-900 border-y-4 border-y-transparent"></div>
            </div>
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
          <div className={`
            bg-white dark:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700
            transition-all duration-300 ease-in-out
            ${isMinimized 
              ? "w-80 h-16" 
              : "w-96 h-[600px] max-h-[80vh]"
            }
          `}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 
                         bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">AI Assistant</h3>
                  {!isMinimized && (
                    <p className="text-xs text-blue-100">
                      {currentContext.type === "course" && currentContext.name
                        ? `Khóa học: ${currentContext.name}`
                        : currentContext.type === "exam" && currentContext.name
                        ? `Đề thi: ${currentContext.name}`
                        : "Trợ lý học tập thông minh"
                      }
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {!isMinimized ? (
                  <button
                    onClick={handleMinimize}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                    aria-label="Minimize"
                  >
                    <Minimize2 className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleMaximize}
                    className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                    aria-label="Maximize"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <div className="h-[calc(100%-4rem)]">
                <AIChatWindow
                  messages={messages}
                  isLoading={isLoading}
                  currentContext={currentContext}
                  onSendMessage={sendMessage}
                  onContextChange={updateContext}
                  availableContexts={[]}
                  showHeader={false} // Don't show header since we have custom header
                />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}