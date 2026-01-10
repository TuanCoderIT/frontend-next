"use client";

import { useState } from "react";
import GlobalAIChatSettings from "@/components/chat/GlobalAIChatSettings";
import { useGlobalAIChat } from "@/context/GlobalAIChatContext";
import { Settings, Bot, Eye, EyeOff, Power, PowerOff } from "lucide-react";

export default function AIChatbotDemo() {
  const [showSettings, setShowSettings] = useState(false);
  const { isEnabled, setIsEnabled, isVisible, setIsVisible } = useGlobalAIChat();

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          AI Chatbot Demo
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Test và control global AI chatbot
        </p>
      </div>

      {/* Quick Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setIsEnabled(!isEnabled)}
          className={`
            flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all
            ${isEnabled
              ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
              : "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
            }
          `}
        >
          {isEnabled ? <Power className="w-5 h-5" /> : <PowerOff className="w-5 h-5" />}
          {isEnabled ? "Enabled" : "Disabled"}
        </button>

        <button
          onClick={() => setIsVisible(!isVisible)}
          disabled={!isEnabled}
          className={`
            flex items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all
            ${!isEnabled
              ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
              : isVisible
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
              : "border-gray-500 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            }
          `}
        >
          {isVisible ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          {isVisible ? "Visible" : "Hidden"}
        </button>

        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 
                   border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 
                   text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 
                   transition-all"
        >
          <Settings className="w-5 h-5" />
          Settings
        </button>
      </div>

      {/* Status Display */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-500" />
          Current Status
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Enabled:</span>
            <span className={isEnabled ? "text-green-600" : "text-red-600"}>
              {isEnabled ? "Yes" : "No"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Visible:</span>
            <span className={isVisible ? "text-blue-600" : "text-gray-600"}>
              {isVisible ? "Yes" : "No"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-400">Should Show:</span>
            <span className={isEnabled && isVisible ? "text-green-600" : "text-red-600"}>
              {isEnabled && isVisible ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
          <GlobalAIChatSettings />
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Hướng dẫn test:
        </h3>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Chatbot sẽ xuất hiện ở góc dưới bên phải khi enabled + visible</li>
          <li>• Click vào button để mở chat window</li>
          <li>• Có thể minimize/maximize chat window</li>
          <li>• Settings được lưu trong localStorage</li>
          <li>• Chatbot tự động ẩn trên trang /chat, /auth, /admin</li>
        </ul>
      </div>
    </div>
  );
}