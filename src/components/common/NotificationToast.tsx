"use client";

import { useState, useEffect } from "react";
import { X, Bell } from "lucide-react";
import { Notification } from "@/types/public/notification";

interface NotificationToastProps {
  notification: Notification;
  onClose: () => void;
  onClick?: () => void;
  autoClose?: boolean;
  duration?: number;
}

export default function NotificationToast({
  notification,
  onClose,
  onClick,
  autoClose = true,
  duration = 5000,
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100);

    // Auto close
    if (autoClose) {
      const closeTimer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearTimeout(timer);
        clearTimeout(closeTimer);
      };
    }

    return () => clearTimeout(timer);
  }, [autoClose, duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for animation
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
    handleClose();
  };

  const getNotificationIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      new_message: "💬",
      joined_group: "👥",
      course_completed: "🎉",
      quiz_completed: "🏆",
      ai_quiz_generated: "🤖",
      token_reward: "🪙",
      system_announcement: "📢",
    };
    return iconMap[type] || "🔔";
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 w-80 bg-white rounded-lg shadow-lg border border-gray-200 transform transition-all duration-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      }`}
    >
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg"
        onClick={handleClick}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="text-2xl flex-shrink-0">
              {notification.data.icon || getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {notification.data.title}
              </p>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {notification.data.message}
              </p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClose();
            }}
            className="text-gray-400 hover:text-gray-600 p-1 rounded flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      {autoClose && (
        <div className="h-1 bg-gray-200 rounded-b-lg overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all ease-linear"
            style={{
              width: isVisible ? "0%" : "100%",
              transitionDuration: `${duration}ms`,
            }}
          />
        </div>
      )}
    </div>
  );
}
