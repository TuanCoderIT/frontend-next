import { useState, useCallback } from "react";
import { aiAssistantApi } from "@/api/aiAssistant";
import type { AIChatMessage, AIChatContext, AIChatState } from "@/types/ai-chat";

const MAX_MESSAGES = 50;

export const useAIChat = (initialContext: AIChatContext = { type: "general" }) => {
  const [state, setState] = useState<AIChatState>({
    messages: [],
    isLoading: false,
    currentContext: initialContext,
  });

  const updateContext = useCallback((context: AIChatContext) => {
    setState(prev => ({ ...prev, currentContext: context }));
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    if (!message.trim() || state.isLoading) return;

    const userMessage: AIChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: message.trim(),
      timestamp: new Date().toISOString(),
    };

    // Add user message
    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage].slice(-MAX_MESSAGES),
      isLoading: true,
    }));

    try {
      const response = await aiAssistantApi.sendMessage({
        message: message.trim(),
        context_type: state.currentContext.type,
        context_id: state.currentContext.id,
      });

      const aiMessage: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response.response,
        timestamp: response.timestamp,
        contextUsed: response.context_used,
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage].slice(-MAX_MESSAGES),
        isLoading: false,
      }));
    } catch (error) {
      console.error("AI chat error:", error);
      
      const errorMessage: AIChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: "Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.",
        timestamp: new Date().toISOString(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage].slice(-MAX_MESSAGES),
        isLoading: false,
      }));
    }
  }, [state.isLoading, state.currentContext]);

  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, messages: [] }));
  }, []);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    currentContext: state.currentContext,
    sendMessage,
    updateContext,
    clearMessages,
  };
};