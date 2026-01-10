import { useCallback, useRef } from 'react';
import { chatApi } from '@/api/chat';

export const useTyping = (threadId: number | null) => {
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTypingTimeRef = useRef<number>(0);

  const handleTyping = useCallback(() => {
    if (!threadId) return;

    const now = Date.now();
    // Chỉ gửi typing event mỗi 2 giây
    if (now - lastTypingTimeRef.current < 2000) {
      return;
    }

    lastTypingTimeRef.current = now;
    chatApi.sendTyping(threadId).catch(console.error);

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  }, [threadId]);

  return { handleTyping };
};