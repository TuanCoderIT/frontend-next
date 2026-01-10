import { axiosAPI } from "./axios";
import type {
  ChatThread,
  ChatMessage,
  PaginatedResponse,
  CreateDirectThreadRequest,
  SendMessageRequest,
  ReactMessageRequest,
  MessagesQueryParams
} from "@/types/public/chat-type";

export const chatApi = {
  getThreads: async (): Promise<ChatThread[]> => {
    const { data } = await axiosAPI.get("/chat/threads");
    return data;
  },

  // Lấy group thread (nếu backend có endpoint này)
  getGroupThread: (groupId: number) =>
    axiosAPI.get<ChatThread>(`/chat/threads/group/${groupId}`),

  createDirectThread: async (userId: number): Promise<ChatThread> => {
    const payload: CreateDirectThreadRequest = {
      user_id: userId,
    };
    const { data } = await axiosAPI.post("/chat/threads/direct", payload);
    return data;
  },

  getMessages: async (
    threadId: number,
    params?: MessagesQueryParams
  ): Promise<PaginatedResponse<ChatMessage>> => {
    const { data } = await axiosAPI.get(
      `/chat/threads/${threadId}/messages`,
      { params }
    );
    return data;
  },

  sendMessage: async (
    threadId: number,
    payload: SendMessageRequest
  ): Promise<ChatMessage> => {
    const { data } = await axiosAPI.post(
      `/chat/threads/${threadId}/messages`,
      payload
    );
    return data;
  },

  markAsRead: async (threadId: number): Promise<void> => {
    await axiosAPI.post(`/chat/threads/${threadId}/read`);
  },

  sendTyping: async (threadId: number): Promise<void> => {
    await axiosAPI.post(`/chat/threads/${threadId}/typing`);
  },

  reactToMessage: async (
    messageId: number,
    reactionType: string
  ): Promise<void> => {
    const payload: ReactMessageRequest = {
      reaction_type: reactionType,
    };
    await axiosAPI.post(`/chat/messages/${messageId}/react`, payload);
  },

  removeReaction: async (messageId: number): Promise<void> => {
    await axiosAPI.delete(`/chat/messages/${messageId}/react`);
  },
};
