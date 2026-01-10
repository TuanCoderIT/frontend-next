export const errorMessages = {
  'FILE_TOO_LARGE': 'File quá lớn (tối đa 10MB)',
  'INVALID_FILE_TYPE': 'Loại file không được hỗ trợ',
  'EMPTY_FILE': 'File trống hoặc không đọc được',
  'AI_FAILED': 'AI không thể tạo quiz từ nội dung này',
  'NETWORK_ERROR': 'Lỗi kết nối, vui lòng thử lại',
  'UNAUTHORIZED': 'Phiên đăng nhập hết hạn',
  'PROMPT_TOO_SHORT': 'Mô tả quá ngắn, vui lòng cung cấp thêm thông tin',
  'PROMPT_TOO_LONG': 'Mô tả quá dài, vui lòng rút gọn',
  'INVALID_QUESTION_COUNT': 'Số lượng câu hỏi không hợp lệ',
  'SERVER_ERROR': 'Lỗi máy chủ, vui lòng thử lại sau',
  'QUOTA_EXCEEDED': 'Đã vượt quá giới hạn tạo quiz hôm nay',
} as const;

export function getErrorMessage(error: any): string {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.data?.error) {
    const errorCode = error.response.data.error;
    return errorMessages[errorCode as keyof typeof errorMessages] || errorCode;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'Có lỗi không xác định xảy ra';
}