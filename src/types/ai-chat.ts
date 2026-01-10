export interface AIChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: string;
  contextUsed?: boolean;
}

export interface AIChatContext {
  type: "general" | "course" | "exam";
  id?: number;
  name?: string;
}

export interface AIChatState {
  messages: AIChatMessage[];
  isLoading: boolean;
  currentContext: AIChatContext;
}