import { useState, useEffect, useCallback } from 'react';
import { 
  fetchNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearReadNotifications
} from '@/api/notifications';
import { Notification, NotificationState } from '@/types/public/notification';

export const useNotifications = () => {
  const [state, setState] = useState<NotificationState>({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    hasMore: true,
    currentPage: 1,
  });

  // Fetch notifications
  const loadNotifications = useCallback(async (page: number = 1, reset: boolean = false) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await fetchNotifications(page);
      const newNotifications = response.data.notifications;
      
      setState(prev => ({
        ...prev,
        notifications: reset ? newNotifications : [...prev.notifications, ...newNotifications],
        hasMore: response.data.pagination.has_more,
        currentPage: response.data.pagination.current_page,
        isLoading: false,
      }));
    } catch (error) {
      console.error('Error loading notifications:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Load more notifications
  const loadMore = useCallback(() => {
    if (!state.isLoading && state.hasMore) {
      loadNotifications(state.currentPage + 1, false);
    }
  }, [state.isLoading, state.hasMore, state.currentPage, loadNotifications]);

  // Refresh notifications
  const refresh = useCallback(() => {
    loadNotifications(1, true);
  }, [loadNotifications]);

  // Update unread count
  const updateUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadCount();
      setState(prev => ({ ...prev, unreadCount: count }));
    } catch (error) {
      console.error('Error updating unread count:', error);
    }
  }, []);

  // Mark notification as read
  const markNotificationAsRead = useCallback(async (id: number) => {
    try {
      await markAsRead(id);
      
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(notification =>
          notification.id === id
            ? { ...notification, is_read: true, read_at: new Date().toISOString() }
            : notification
        ),
        unreadCount: Math.max(0, prev.unreadCount - 1),
      }));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Mark all as read
  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      await markAllAsRead();
      
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.map(notification => ({
          ...notification,
          is_read: true,
          read_at: new Date().toISOString(),
        })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, []);

  // Delete notification
  const removeNotification = useCallback(async (id: number) => {
    try {
      await deleteNotification(id);
      
      setState(prev => {
        const notification = prev.notifications.find(n => n.id === id);
        const wasUnread = notification && !notification.is_read;
        
        return {
          ...prev,
          notifications: prev.notifications.filter(n => n.id !== id),
          unreadCount: wasUnread ? Math.max(0, prev.unreadCount - 1) : prev.unreadCount,
        };
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, []);

  // Clear read notifications
  const clearRead = useCallback(async () => {
    try {
      await clearReadNotifications();
      
      setState(prev => ({
        ...prev,
        notifications: prev.notifications.filter(n => !n.is_read),
      }));
    } catch (error) {
      console.error('Error clearing read notifications:', error);
    }
  }, []);

  // Initial load and setup auto refresh
  useEffect(() => {
    loadNotifications(1, true);
    updateUnreadCount();

    // Auto refresh unread count every 30 seconds
    const interval = setInterval(updateUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, [loadNotifications, updateUnreadCount]);

  return {
    ...state,
    loadMore,
    refresh,
    markAsRead: markNotificationAsRead,
    markAllAsRead: markAllNotificationsAsRead,
    deleteNotification: removeNotification,
    clearRead,
    updateUnreadCount,
  };
};