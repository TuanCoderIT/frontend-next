import { axiosAPI } from "./axios";

export interface AIChatRequest {
  message: string;
  context_type?: "course" | "exam" | "general";
  context_id?: number;
}

export interface AIChatResponse {
  response: string;
  context_used: boolean;
  timestamp: string;
}

export interface AIChatApiResponse {
  message: string;
  data: AIChatResponse;
}

export const aiAssistantApi = {
  sendMessage: async (payload: AIChatRequest): Promise<AIChatResponse> => {
    const { data } = await axiosAPI.post<AIChatApiResponse>(
      "/chat/ai-assistant",
      payload
    );
    return data.data;
  },
};