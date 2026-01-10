"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface GlobalAIChatContextType {
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

const GlobalAIChatContext = createContext<GlobalAIChatContextType | undefined>(undefined);

interface GlobalAIChatProviderProps {
  children: ReactNode;
  defaultEnabled?: boolean;
}

export function GlobalAIChatProvider({ 
  children, 
  defaultEnabled = true 
}: GlobalAIChatProviderProps) {
  const [isEnabled, setIsEnabledState] = useState(defaultEnabled);
  const [isVisible, setIsVisibleState] = useState(true);

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEnabled = localStorage.getItem("ai-chat-enabled");
      const savedVisible = localStorage.getItem("ai-chat-visible");
      
      if (savedEnabled !== null) {
        setIsEnabledState(JSON.parse(savedEnabled));
      }
      if (savedVisible !== null) {
        setIsVisibleState(JSON.parse(savedVisible));
      }
    }
  }, []);

  // Save to localStorage when settings change
  const setIsEnabled = (enabled: boolean) => {
    setIsEnabledState(enabled);
    if (typeof window !== "undefined") {
      localStorage.setItem("ai-chat-enabled", JSON.stringify(enabled));
    }
  };

  const setIsVisible = (visible: boolean) => {
    setIsVisibleState(visible);
    if (typeof window !== "undefined") {
      localStorage.setItem("ai-chat-visible", JSON.stringify(visible));
    }
  };

  return (
    <GlobalAIChatContext.Provider 
      value={{ 
        isEnabled, 
        setIsEnabled, 
        isVisible, 
        setIsVisible 
      }}
    >
      {children}
    </GlobalAIChatContext.Provider>
  );
}

export function useGlobalAIChat() {
  const context = useContext(GlobalAIChatContext);
  if (context === undefined) {
    throw new Error("useGlobalAIChat must be used within a GlobalAIChatProvider");
  }
  return context;
}