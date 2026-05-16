"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { CheckCheck, Trash2, Loader2, Bell, RefreshCw } from "lucide-react";
import NotificationItem from "./NotificationItem";
import { useRouter } from "next/navigation";
import { Notification } from "@/types/public/notification";

export default function NotificationPage() {
  const router = useRouter();
  const {
    notifications,
    isLoading,
    hasMore,
    unreadCount,
    loadMore,
    refresh,
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
  };

  const handleDeleteNotification = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    await deleteNotification(id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bell className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Thông báo
                  </h1>
                  <p className="text-sm text-gray-600">
                    {unreadCount > 0
                      ? `${unreadCount} thông báo chưa đọc`
                      : "Tất cả thông báo đã được đọc"}
                  </p>
                </div>
              </div>

              <button
                onClick={refresh}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Làm mới</span>
              </button>
            </div>

            {/* Action buttons */}
            {notifications.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <CheckCheck className="h-4 w-4" />
                    <span>Đánh dấu tất cả đã đọc</span>
                  </button>
                )}
                <button
                  onClick={clearRead}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Xóa đã đọc</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {isLoading && notifications.length === 0 ? (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Đang tải thông báo...</p>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center p-12">
              <Bell className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không có thông báo
              </h3>
              <p className="text-gray-500">
                Bạn sẽ nhận được thông báo khi có hoạt động mới.
              </p>
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
                <div className="p-6 text-center border-t border-gray-200">
                  <button
                    onClick={loadMore}
                    disabled={isLoading}
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Đang tải...</span>
                      </>
                    ) : (
                      <span>Xem thêm thông báo</span>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
