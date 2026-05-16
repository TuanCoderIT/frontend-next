export interface Notification {
  id: number;
  type: string;
  data: {
    title: string;
    message: string;
    icon: string;
    action_url?: string;
    extra_data?: any;
  };
  read_at: string | null;
  created_at: string;
  is_read: boolean;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  hasMore: boolean;
  currentPage: number;
}

export interface NotificationListResponse {
  message: string;
  data: {
    notifications: Notification[];
    pagination: {
      current_page: number;
      total: number;
      has_more: boolean;
    };
  };
}

export interface UnreadCountResponse {
  data: {
    unread_count: number;
  };
}

export type NotificationType = 
  | 'new_message'
  | 'joined_group'
  | 'course_completed'
  | 'quiz_completed'
  | 'ai_quiz_generated'
  | 'token_reward'
  | 'system_announcement';