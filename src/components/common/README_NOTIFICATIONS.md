# Hệ Thống Thông Báo - Hướng Dẫn Sử Dụng

## Tổng Quan
Hệ thống thông báo đã được tích hợp hoàn chỉnh với các tính năng:
- ✅ Notification Bell với badge unread count
- ✅ Dropdown menu hiển thị danh sách thông báo
- ✅ Trang thông báo đầy đủ
- ✅ Toast notifications cho thông báo mới
- ✅ Real-time updates và auto refresh
- ✅ Mark as read/unread functionality
- ✅ Delete notifications
- ✅ Responsive design

## Components Đã Tạo

### 1. **NotificationBell** (`src/components/common/NotificationBell.tsx`)
- Icon chuông với badge hiển thị số thông báo chưa đọc
- Click để mở/đóng dropdown
- Tự động cập nhật unread count

### 2. **NotificationDropdown** (`src/components/common/NotificationDropdown.tsx`)
- Dropdown menu hiển thị danh sách thông báo
- Actions: Mark all as read, Clear read notifications
- Infinite scroll/Load more
- Click notification để navigate và mark as read

### 3. **NotificationItem** (`src/components/common/NotificationItem.tsx`)
- Component hiển thị từng thông báo
- Phân biệt đã đọc/chưa đọc bằng styling
- Delete button khi hover

### 4. **NotificationPage** (`src/components/common/NotificationPage.tsx`)
- Trang thông báo đầy đủ tại `/notifications`
- Hiển thị tất cả thông báo với pagination
- Các action buttons và filters

### 5. **NotificationToast** (`src/components/common/NotificationToast.tsx`)
- Toast popup cho thông báo mới
- Auto dismiss sau 5 giây
- Progress bar animation

## API Integration

### API Functions (`src/api/notifications.ts`)
```typescript
- fetchNotifications(page, perPage, type)
- fetchUnreadNotifications(limit)
- getUnreadCount()
- markAsRead(id)
- markAllAsRead()
- deleteNotification(id)
- clearReadNotifications()
```

### Custom Hook (`src/hooks/useNotifications.ts`)
```typescript
const {
  notifications,
  unreadCount,
  isLoading,
  hasMore,
  loadMore,
  refresh,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearRead
} = useNotifications();
```

## Đã Tích Hợp Vào

### 1. **Public Navbar** (`src/components/public/Navbar.tsx`)
- Thêm NotificationBell vào user menu
- Chỉ hiển thị khi user đã đăng nhập

### 2. **Admin Header** (`src/components/admin/Header.tsx`)
- Thay thế notification cũ bằng NotificationBell mới
- Tích hợp vào admin interface

## Cách Sử Dụng

### 1. **Hiển thị Notification Bell**
```tsx
import NotificationBell from '@/components/common/NotificationBell';

<NotificationBell className="custom-class" />
```

### 2. **Sử dụng Hook**
```tsx
import { useNotifications } from '@/hooks/useNotifications';

const MyComponent = () => {
  const { notifications, unreadCount, markAsRead } = useNotifications();
  
  // Your component logic
};
```

### 3. **Toast Notifications**
```tsx
import { useNotificationToast } from '@/context/NotificationContext';

const { showToast } = useNotificationToast();

// Show new notification as toast
showToast(newNotification);
```

## Styling & Theming

### CSS Classes Sử Dụng
- `bg-blue-50 border-l-4 border-l-blue-500` - Unread notification
- `text-gray-700` - Read notification
- `bg-red-500` - Unread count badge
- `hover:bg-gray-50` - Hover effects

### Responsive Design
- Mobile: Dropdown width tự động điều chỉnh
- Desktop: Fixed width 384px (w-96)
- Icons và text size responsive

## Notification Types

```typescript
type NotificationType = 
  | 'new_message'      // 💬
  | 'joined_group'     // 👥  
  | 'course_completed' // 🎉
  | 'quiz_completed'   // 🏆
  | 'ai_quiz_generated'// 🤖
  | 'token_reward'     // 🪙
  | 'system_announcement' // 📢
```

## Performance Features

- **Auto Refresh**: Unread count cập nhật mỗi 30 giây
- **Optimistic Updates**: UI cập nhật ngay lập tức
- **Debounced Actions**: Tránh spam API calls
- **Pagination**: Load 15 notifications mỗi lần
- **Caching**: Hook tự động cache data

## Error Handling

- Network errors → Retry mechanism
- API errors → User-friendly messages  
- Loading states → Skeleton/spinner
- Empty states → Friendly messages

## Next Steps

1. **WebSocket Integration**: Thêm real-time notifications
2. **Push Notifications**: Browser push notifications
3. **Email Notifications**: Tích hợp email templates
4. **Advanced Filters**: Filter theo type, date, etc.
5. **Notification Settings**: User preferences

---

**Hệ thống đã sẵn sàng sử dụng!** 🎉