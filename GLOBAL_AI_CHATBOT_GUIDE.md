# Global AI Chatbot - Hướng Dẫn Sử Dụng

## Tổng Quan
Global AI Chatbot là một chatbot popup xuất hiện ở góc dưới bên phải màn hình, tương tự như các chatbot phổ biến trên các website hiện tại. Chatbot này hoạt động độc lập và có thể xuất hiện trên mọi trang của website.

## ✨ Tính Năng Chính

### 🎯 Floating Button
- **Vị trí**: Góc dưới bên phải màn hình
- **Animation**: Bounce effect nhẹ nhàng + pulse ring
- **Tooltip**: Hiển thị khi hover
- **Notification**: Dot đỏ khi có tin nhắn mới
- **Responsive**: Tự động ẩn trên mobile khi cần

### 💬 Chat Interface
- **Minimize/Maximize**: Thu nhỏ thành header bar
- **Custom Header**: Hiển thị context hiện tại
- **Auto Context**: Tự động detect course/exam từ trang hiện tại
- **Persistent**: Giữ lại conversation khi navigate
- **Close**: Đóng hoàn toàn chatbot

### ⚙️ Settings & Control
- **Enable/Disable**: Bật/tắt toàn bộ chatbot
- **Show/Hide**: Ẩn/hiện tạm thời
- **LocalStorage**: Lưu settings trong browser
- **Page Filtering**: Tự động ẩn trên các trang không phù hợp

## 🏗️ Cấu Trúc Components

### Core Components
```
src/components/chat/
├── GlobalAIChatbot.tsx          # Main chatbot component
├── GlobalAIChatWrapper.tsx      # Wrapper with page filtering
├── GlobalAIChatSettings.tsx     # Settings control panel
└── AIChatWindow.tsx            # Updated with showHeader prop
```

### Context & Providers
```
src/context/
└── GlobalAIChatContext.tsx     # Global state management
```

### Integration
```
src/app/layout.tsx              # Root layout integration
```

## 🚀 Cách Sử Dụng

### 1. Automatic Integration
Chatbot đã được tích hợp tự động vào root layout và sẽ xuất hiện trên mọi trang (trừ các trang được exclude).

### 2. Control Settings
```tsx
import GlobalAIChatSettings from "@/components/chat/GlobalAIChatSettings";

// Trong settings page hoặc user profile
<GlobalAIChatSettings />
```

### 3. Programmatic Control
```tsx
import { useGlobalAIChat } from "@/context/GlobalAIChatContext";

function MyComponent() {
  const { isEnabled, setIsEnabled, isVisible, setIsVisible } = useGlobalAIChat();
  
  // Disable chatbot programmatically
  const handleDisable = () => setIsEnabled(false);
  
  // Hide temporarily
  const handleHide = () => setIsVisible(false);
}
```

### 4. Custom Page Exclusion
Cập nhật `HIDDEN_PAGES` trong `GlobalAIChatWrapper.tsx`:
```tsx
const HIDDEN_PAGES = [
  "/chat",
  "/auth/login",
  "/admin",
  "/your-custom-page", // Add your page here
];
```

## 🎨 UI/UX Features

### Visual Design
- **Gradient Background**: Blue gradient với hover effects
- **Smooth Animations**: Bounce, pulse, scale transitions
- **Shadow Effects**: Depth với shadow-lg và shadow-xl
- **Responsive Size**: 
  - Button: 64x64px
  - Chat Window: 384x600px (max 80vh)
  - Minimized: 320x64px

### Interaction States
- **Idle**: Gentle bounce animation
- **Hover**: Scale up + tooltip
- **Active**: Pulse ring animation
- **New Message**: Red notification dot
- **Loading**: Spinner trong chat

### Accessibility
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Tab support
- **Focus Management**: Proper focus handling
- **Color Contrast**: WCAG compliant colors

## 📱 Responsive Behavior

### Desktop (≥768px)
- Full-size floating button
- Large chat window (384x600px)
- Tooltip on hover
- Smooth animations

### Mobile (<768px)
- Smaller button if needed
- Full-screen chat modal
- Touch-friendly interactions
- Optimized for thumb navigation

## 🔧 Configuration Options

### Default Settings
```tsx
<GlobalAIChatProvider 
  defaultEnabled={true}  // Enable by default
>
```

### Page Exclusions
- `/chat` - Already has AI integration
- `/auth/*` - Authentication pages
- `/admin/*` - Admin dashboard
- Custom pages as needed

### LocalStorage Keys
- `ai-chat-enabled`: Boolean for enable/disable
- `ai-chat-visible`: Boolean for show/hide

## 🎯 Context Awareness

### Auto-Detection
- **Course Pages**: `/courses/[slug]` → context_type: "course"
- **Exam Pages**: `/exams/[id]` → context_type: "exam"  
- **Other Pages**: → context_type: "general"

### Header Display
- **Course**: "Khóa học: [Tên khóa học]"
- **Exam**: "Đề thi: [Tên đề thi]"
- **General**: "Trợ lý học tập thông minh"

## 🔄 State Management

### Global State
```tsx
interface GlobalAIChatContextType {
  isEnabled: boolean;      // Master enable/disable
  setIsEnabled: (enabled: boolean) => void;
  isVisible: boolean;      // Temporary show/hide
  setIsVisible: (visible: boolean) => void;
}
```

### Local State (per chatbot instance)
- Chat messages
- Loading states
- Open/minimized state
- Current context

## 🚫 Limitations & Considerations

### Performance
- Messages không persist qua page refresh
- Max 50 messages per session
- LocalStorage cho settings only

### Browser Support
- Modern browsers với ES6+ support
- LocalStorage required cho settings
- CSS animations support recommended

### SEO Impact
- Minimal impact (client-side only)
- No server-side rendering needed
- Lazy loading ready

## 🔮 Future Enhancements

### Potential Features
- [ ] Message persistence across sessions
- [ ] Push notifications
- [ ] Voice input/output
- [ ] File upload support
- [ ] Multi-language support
- [ ] Analytics tracking
- [ ] Custom themes
- [ ] Keyboard shortcuts

### Integration Ideas
- [ ] Help desk integration
- [ ] User feedback collection
- [ ] Course recommendations
- [ ] Study reminders
- [ ] Progress tracking

---

**Kết quả**: Global AI Chatbot đã được implement hoàn chỉnh với UX tương tự các chatbot phổ biến, tích hợp mượt mà vào hệ thống và có thể control linh hoạt.