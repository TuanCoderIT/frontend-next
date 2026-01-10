"use client";

import { useGlobalAIChat } from "@/context/GlobalAIChatContext";
import { Bot, Eye, EyeOff } from "lucide-react";

interface GlobalAIChatSettingsProps {
  className?: string;
}

export default function GlobalAIChatSettings({ className = "" }: GlobalAIChatSettingsProps) {
  const { isEnabled, setIsEnabled, isVisible, setIsVisible } = useGlobalAIChat();

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-3">
        <Bot className="w-5 h-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          AI Assistant Settings
        </h3>
      </div>

      <div className="space-y-3">
        {/* Enable/Disable Chatbot */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100">
              Enable AI Assistant
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Show AI chatbot on all pages
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 
                         peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer 
                         dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white 
                         after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                         after:bg-white after:border-gray-300 after:border after:rounded-full 
                         after:h-5 after:w-5 after:transition-all dark:border-gray-600 
                         peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Show/Hide Chatbot */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100">
              Visibility
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Temporarily hide/show chatbot
            </p>
          </div>
          <button
            onClick={() => setIsVisible(!isVisible)}
            disabled={!isEnabled}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg transition-colors
              ${isEnabled
                ? isVisible
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
              }
            `}
          >
            {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {isVisible ? "Visible" : "Hidden"}
          </button>
        </div>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400">
        <p>• AI Assistant will not appear on chat, auth, or admin pages</p>
        <p>• Settings are saved locally in your browser</p>
      </div>
    </div>
  );
}