"use client";

import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Trash2 } from "lucide-react";
import { Notification } from "@/types/public/notification";

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export default function NotificationItem({
  notification,
  onClick,
  onDelete,
}: NotificationItemProps) {
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
      onClick={onClick}
      className={`group p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
        !notification.is_read ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="text-2xl flex-shrink-0">
            {notification.data.icon || getNotificationIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <p
              className={`text-sm font-medium ${
                !notification.is_read ? "text-gray-900" : "text-gray-700"
              }`}
            >
              {notification.data.title}
            </p>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {notification.data.message}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              {formatDistanceToNow(new Date(notification.created_at), {
                addSuffix: true,
                locale: vi,
              })}
            </p>
          </div>
        </div>

        {/* Delete button */}
        <button
          onClick={onDelete}
          className="text-gray-400 hover:text-red-500 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
          title="Xóa thông báo"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
