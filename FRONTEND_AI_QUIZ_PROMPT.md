# Frontend Implementation Guide: AI Quiz Generation Feature

## 🎯 Overview
Implement AI Quiz Generation feature với 2 phương thức:
1. **Text Prompt** - Tạo quiz từ câu lệnh văn bản
2. **File Upload** - Tạo quiz từ file PDF/DOCX/TXT

## 📋 Requirements

### UI Components Cần Tạo:
1. **Quiz Generation Form** với 2 tabs/modes
2. **File Upload Component** với drag & drop
3. **Loading States** cho AI processing
4. **Success/Error Handling** với toast notifications
5. **Quiz Preview** component để xem kết quả

## 🔌 API Endpoints

### 1. Text Prompt Generation
```typescript
// POST /api/exams/ai-generate
interface TextPromptRequest {
  prompt: string;                    // Required: Câu lệnh tạo quiz
  number_of_questions?: number;      // Optional: 1-50, default: 5
}

interface QuizResponse {
  id: number;
  title: string;
  description: string;
  category_id: number;
  difficulty: string;
  duration: number;
  status: 'draft';
  is_ai_generated: true;
  questions: Question[];
}
```

### 2. File Upload Generation
```typescript
// POST /api/exams/ai-from-file
interface FileUploadRequest {
  file: File;                       // Required: PDF/DOCX/TXT, max 10MB
  number_of_questions?: number;     // Optional: 1-20, default: 5
}

// Response giống TextPromptRequest
```

## 💻 Implementation Guide

### 1. Main Quiz Generation Component

### 2. Text Prompt Form Component

### 3. File Upload Form Component

### 4. Quiz Preview Component

## 🔧 Utility Functions

```typescript
// utils/auth.ts
export function getAuthToken(): string {
  // Implement based on your auth system
  return localStorage.getItem('auth_token') || '';
}

// utils/file.ts
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileIcon(fileType: string): string {
  if (fileType.includes('pdf')) return '📄';
  if (fileType.includes('word')) return '📝';
  if (fileType.includes('text')) return '📃';
  return '📁';
}
```

## 📦 Required Dependencies

```bash
pnpm add react-dropzone
```

## 🎨 Styling Notes

- Sử dụng Tailwind CSS classes như trong examples
- Components sử dụng shadcn/ui pattern
- Responsive design với grid layouts
- Loading states với spinner animations
- Toast notifications cho feedback

## 🚨 Error Handling

```typescript
// Các lỗi cần handle:
const errorMessages = {
  'FILE_TOO_LARGE': 'File quá lớn (tối đa 10MB)',
  'INVALID_FILE_TYPE': 'Loại file không được hỗ trợ',
  'EMPTY_FILE': 'File trống hoặc không đọc được',
  'AI_FAILED': 'AI không thể tạo quiz từ nội dung này',
  'NETWORK_ERROR': 'Lỗi kết nối, vui lòng thử lại',
  'UNAUTHORIZED': 'Phiên đăng nhập hết hạn',
};
```
## ✅ Testing Checklist

- [ ] Upload file PDF/DOCX/TXT thành công
- [ ] Validate file size và type
- [ ] Text prompt generation hoạt động
- [ ] Loading states hiển thị đúng
- [ ] Error handling cho các trường hợp
- [ ] Quiz preview hiển thị đầy đủ thông tin
- [ ] Responsive trên mobile/tablet
- [ ] Toast notifications hoạt động

## 🔗 Integration Notes

1. **Authentication**: Thêm Bearer token vào headers
2. **Routing**: Tích hợp với Next.js App Router
3. **State Management**: Có thể dùng Zustand/Redux nếu cần
4. **File Storage**: Files được xử lý tạm thời, không lưu trữ lâu dài