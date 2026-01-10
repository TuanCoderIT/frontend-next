# AI Chatbot - Hướng Dẫn Sử Dụng

## Tổng Quan
AI Chatbot đã được tích hợp thành công vào hệ thống chat hiện có. Người dùng có thể chat với AI Assistant để hỏi đáp về nội dung học tập.

## Các Component Đã Tạo

### 1. API Layer
- `src/api/aiAssistant.ts` - API functions để gọi AI assistant endpoint
- `src/types/ai-chat.ts` - TypeScript types cho AI chat

### 2. Hooks
- `src/hooks/useAIChat.ts` - Hook quản lý state và logic AI chat
- `src/hooks/useAIChatContext.ts` - Hook detect context từ route hiện tại

### 3. Components
- `src/components/chat/AIChatMessage.tsx` - Component hiển thị tin nhắn AI
- `src/components/chat/AIChatInput.tsx` - Component input để gửi tin nhắn
- `src/components/chat/AIChatContextSelector.tsx` - Dropdown chọn context
- `src/components/chat/AIChatWindow.tsx` - Component chính AI chat window
- `src/components/chat/AIChatFloatingButton.tsx` - Floating button cho course/exam pages
- `src/components/chat/AIChatProvider.tsx` - Provider wrapper component

## Cách Sử Dụng

### 1. Trong Chat Page
AI Assistant đã được tích hợp vào `/chat` page:
- Hiển thị "🤖 AI Assistant" ở top của thread list
- Click vào sẽ mở AI chat interface
- Context tự động detect từ route hiện tại

### 2. Floating Button trong Course/Exam Pages

```tsx
import AIChatProvider from "@/components/chat/AIChatProvider";

// Trong course page
export default function CoursePage() {
  const courseId = 123;
  const courseTitle = "React Fundamentals";
  
  const aiContext = {
    type: "course" as const,
    id: courseId,
    name: courseTitle,
  };

  return (
    <AIChatProvider context={aiContext}>
      {/* Course content */}
      <div>Course content here...</div>
    </AIChatProvider>
  );
}
```

### 3. Manual Integration

```tsx
import { useAIChat } from "@/hooks/useAIChat";
import AIChatWindow from "@/components/chat/AIChatWindow";

export default function CustomPage() {
  const {
    messages,
    isLoading,
    currentContext,
    sendMessage,
    updateContext,
  } = useAIChat({ type: "general" });

  return (
    <div className="h-96">
      <AIChatWindow
        messages={messages}
        isLoading={isLoading}
        currentContext={currentContext}
        onSendMessage={sendMessage}
        onContextChange={updateContext}
      />
    </div>
  );
}
```

## Features

### ✅ Đã Implement
- [x] AI chat interface tích hợp vào chat sidebar
- [x] Context auto-detection (course/exam/general)
- [x] Context selector dropdown
- [x] Loading states và error handling
- [x] Floating button cho course/exam pages
- [x] Responsive design
- [x] Message history (max 50 messages)
- [x] Clean, readable code structure

### 🎯 Context Awareness
- **General**: Câu hỏi tổng quát về học tập
- **Course**: Tự động detect khi ở course page, gửi course_id
- **Exam**: Tự động detect khi ở exam page, gửi exam_id

### 🔧 Technical Features
- TypeScript support
- Error handling với retry
- Auto-scroll to bottom
- Debounced input
- Rate limiting ready
- Memory-only storage (clear on refresh)

## API Integration

### Request Format
```json
{
  "message": "Giải thích machine learning là gì?",
  "context_type": "course",
  "context_id": 123
}
```

### Response Format
```json
{
  "message": "Trả lời thành công",
  "data": {
    "response": "Machine learning là...",
    "context_used": true,
    "timestamp": "2024-01-09T10:30:00.000Z"
  }
}
```

## Styling
- Sử dụng Tailwind CSS
- Dark mode support
- Consistent với design system hiện tại
- Mobile responsive

## Performance
- Lazy loading components
- Optimized re-renders
- Memory management (max 50 messages)
- Efficient state updates

## Security
- Input validation
- XSS protection
- Rate limiting ready
- Error boundary protection

---

**Kết quả**: AI Chatbot đã được implement hoàn chỉnh theo requirements, tích hợp mượt mà vào hệ thống hiện có với clean code và UX tốt.