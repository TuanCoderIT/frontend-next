import { axiosAPI } from './axios';
import { 
  Notification, 
  NotificationListResponse, 
  UnreadCountResponse,
  NotificationType 
} from '@/types/public/notification';

const BASE_URL = '/notifications';

// Fetch notifications with pagination
export const fetchNotifications = async (
  page: number = 1,
  perPage: number = 15,
  type?: NotificationType
): Promise<NotificationListResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });
  
  if (type) {
    params.append('type', type);
  }

  const response = await axiosAPI.get(`${BASE_URL}?${params}`);
  return response.data;
};

// Fetch unread notifications
export const fetchUnreadNotifications = async (limit: number = 10): Promise<Notification[]> => {
  const response = await axiosAPI.get(`${BASE_URL}/unread?limit=${limit}`);
  return response.data.data;
};

// Get unread count
export const getUnreadCount = async (): Promise<number> => {
  const response = await axiosAPI.get(`${BASE_URL}/unread-count`);
  return response.data.data.unread_count;
};

// Get single notification
export const getNotification = async (id: number): Promise<Notification> => {
  const response = await axiosAPI.get(`${BASE_URL}/${id}`);
  return response.data.data;
};

// Get notification stats
export const getNotificationStats = async () => {
  const response = await axiosAPI.get(`${BASE_URL}/stats`);
  return response.data.data;
};

// Mark notification as read
export const markAsRead = async (id: number): Promise<void> => {
  await axiosAPI.post(`${BASE_URL}/${id}/read`);
};

// Mark all notifications as read
export const markAllAsRead = async (): Promise<void> => {
  await axiosAPI.post(`${BASE_URL}/mark-all-read`);
};

// Delete notification
export const deleteNotification = async (id: number): Promise<void> => {
  await axiosAPI.delete(`${BASE_URL}/${id}`);
};

// Clear read notifications
export const clearReadNotifications = async (): Promise<void> => {
  await axiosAPI.delete(`${BASE_URL}/clear-read`);
};