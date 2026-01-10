# Posts Reactions & Comments System

## 🎯 Tổng quan
Hệ thống reactions và comments đã được nâng cấp hoàn chỉnh với đầy đủ tính năng như Facebook/Instagram.

## ✨ Tính năng đã implement

### 🔥 Reactions System
- **6 loại reactions**: 👍 Like, ❤️ Love, 😂 Haha, 😮 Wow, 😢 Sad, 😠 Angry
- **Hover picker**: Hover vào nút reaction để chọn loại
- **Toggle reactions**: Click lại để bỏ reaction
- **Real-time updates**: Reactions cập nhật ngay lập tức
- **Optimistic UI**: UI cập nhật trước khi API response
- **Reaction summary**: Hiển thị số lượng từng loại reaction

### 💬 Comments System  
- **Nested comments**: Hỗ trợ replies (tối đa 2 levels)
- **Comment reactions**: Có thể react cho từng comment
- **Infinite scroll**: Load more comments khi cần
- **Real-time comments**: Comments mới hiện ngay lập tức
- **User avatars**: Hiển thị avatar và tên user
- **Timestamp**: Thời gian relative (vd: "2 phút trước")

### 🔄 Real-time Features
- **WebSocket integration**: Sử dụng Laravel Echo + Pusher
- **Live reactions**: Reactions cập nhật real-time cho tất cả users
- **Live comments**: Comments mới hiện ngay cho tất cả users
- **Connection status**: Hiển thị trạng thái kết nối

## 📁 Cấu trúc Files

### API Services
```
src/api/
├── reactions.ts     # API calls cho reactions
└── comments.ts      # API calls cho comments
```

### Components
```
src/components/common/
├── ReactionButton.tsx    # Component reaction với picker
├── CommentSection.tsx    # Component comments với replies
└── RealtimeStatus.tsx    # Hiển thị trạng thái kết nối
```

### Hooks
```
src/hooks/
├── useReactions.ts       # Hook quản lý reactions
├── useComments.ts        # Hook quản lý comments
└── usePostRealtime.ts    # Hook real-time events
```

### Context
```
src/context/
└── RealtimeContext.tsx   # Context cho WebSocket connection
```

## 🚀 Cách sử dụng

### 1. Setup Realtime (Optional)
```tsx
// Wrap app với RealtimeProvider
import { RealtimeProvider } from '@/context/RealtimeContext';

export default function App() {
  return (
    <RealtimeProvider>
      {/* Your app */}
    </RealtimeProvider>
  );
}
```

### 2. Sử dụng PostCard
```tsx
import PostCard from '@/components/group/PostCard';

<PostCard 
  post={post}
  onUpdatePost={(updatedPost) => {
    // Handle post updates
  }}
/>
```

### 3. Environment Variables
```env
NEXT_PUBLIC_PUSHER_APP_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_APP_CLUSTER=your_cluster
```

## 🧪 Demo Page
Truy cập `/posts-demo` để xem demo đầy đủ tính năng.

## 📡 Backend Requirements

### API Endpoints cần implement:
```
POST /api/reactions              # Thêm/cập nhật reaction
DELETE /api/reactions            # Xóa reaction
GET /api/reactions               # Lấy danh sách reactions

GET /api/posts/{id}/comments     # Lấy comments của post
POST /api/posts/{id}/comments    # Thêm comment
DELETE /api/comments/{id}        # Xóa comment
```

### Real-time Events:
```
post.reacted: {post_id, reaction, action, count, reaction_summary, user_reaction}
comment.created: {comment, post_id, count}
comment.reacted: {comment_id, reaction, action, count}
```

### Database Schema:
```sql
-- Reactions table (polymorphic)
reactions: id, user_id, reactable_type, reactable_id, reaction_type, timestamps

-- Comments table  
comments: id, post_id, user_id, parent_id, content, timestamps

-- Posts table updates
posts: ..., reactions_count, comments_count, user_reaction, reaction_summary
```

## 🎨 UI/UX Features

### Reactions
- **Hover animation**: Scale và highlight khi hover
- **Active states**: Màu sắc khác nhau cho từng reaction
- **Smooth transitions**: Animation mượt mà
- **Mobile friendly**: Touch-friendly trên mobile

### Comments
- **Expandable**: Click để mở/đóng comments section
- **Nested design**: Visual hierarchy rõ ràng cho replies
- **Loading states**: Skeleton loading cho UX tốt
- **Error handling**: Thông báo lỗi user-friendly

## 🔧 Customization

### Thay đổi reactions
```tsx
// Trong ReactionButton.tsx
const reactionEmojis = {
  like: '👍',
  love: '❤️', 
  // Thêm reactions mới...
};
```

### Styling
- Sử dụng Tailwind CSS
- Dark mode support
- Responsive design
- Customizable colors và spacing

## 📈 Performance

### Optimizations
- **Optimistic updates**: UI cập nhật ngay lập tức
- **Debounced API calls**: Tránh spam requests
- **Infinite scroll**: Load comments theo batch
- **SWR caching**: Cache API responses
- **Lazy loading**: Components load khi cần

## 🐛 Troubleshooting

### Common Issues
1. **Reactions không hoạt động**: Kiểm tra API endpoints
2. **Real-time không connect**: Kiểm tra Pusher config
3. **Comments không load**: Kiểm tra permissions
4. **UI không responsive**: Kiểm tra Tailwind classes

### Debug Tools
- Console logs cho real-time events
- Network tab để check API calls
- React DevTools để check state

## 🎉 Kết quả
Hệ thống posts giờ đây hoạt động như Facebook/Instagram với đầy đủ tương tác real-time, UX mượt mà và performance tối ưu!