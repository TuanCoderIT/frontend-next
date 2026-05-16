"use client";

import { useRouter } from "next/navigation";
import { CheckCheck, Trash2, X, Loader2, Bell } from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";
import { Notification } from "@/types/public/notification";
import NotificationItem from "./NotificationItem";

interface NotificationDropdownProps {
  onClose: () => void;
}

export default function NotificationDropdown({
  onClose,
}: NotificationDropdownProps) {
  const router = useRouter();
  const {
    notifications,
    isLoading,
    hasMore,
    unreadCount,
    loadMore,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearRead,
  } = useNotifications();

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if not already read
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }

    // Navigate to action URL if exists
    if (notification.data.action_url) {
      router.push(notification.data.action_url);
    }

    onClose();
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleClearRead = async () => {
    await clearRead();
  };

  const handleDeleteNotification = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    await deleteNotification(id);
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
    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            Thông báo
            {unreadCount > 0 && (
              <span className="ml-2 text-sm bg-red-100 text-red-600 px-2 py-1 rounded-full">
                {unreadCount} mới
              </span>
            )}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action buttons */}
        {notifications.length > 0 && (
          <div className="flex gap-2 mt-3">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center text-xs text-blue-600 hover:text-blue-800 px-2 py-1 rounded hover:bg-blue-50"
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Đánh dấu tất cả đã đọc
              </button>
            )}
            <button
              onClick={handleClearRead}
              className="flex items-center text-xs text-gray-600 hover:text-gray-800 px-2 py-1 rounded hover:bg-gray-50"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Xóa đã đọc
            </button>
          </div>
        )}
      </div>

      {/* Notification List */}
      <div className="max-h-80 overflow-y-auto">
        {isLoading && notifications.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Không có thông báo nào</p>
          </div>
        ) : (
          <>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={() => handleNotificationClick(notification)}
                onDelete={(e) => handleDeleteNotification(e, notification.id)}
              />
            ))}

            {/* Load more button */}
            {hasMore && (
              <div className="p-4 text-center border-t border-gray-200">
                <button
                  onClick={loadMore}
                  disabled={isLoading}
                  className="text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Đang tải...
                    </span>
                  ) : (
                    "Xem thêm"
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
