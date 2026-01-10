"use client";

import AIChatFloatingButton from "./AIChatFloatingButton";
import type { AIChatContext } from "@/types/ai-chat";

interface AIChatProviderProps {
  context?: AIChatContext;
  showFloatingButton?: boolean;
  children: React.ReactNode;
}

export default function AIChatProvider({ 
  context = { type: "general" }, 
  showFloatingButton = true,
  children 
}: AIChatProviderProps) {
  return (
    <>
      {children}
      {showFloatingButton && (
        <AIChatFloatingButton context={context} />
      )}
    </>
  );
}