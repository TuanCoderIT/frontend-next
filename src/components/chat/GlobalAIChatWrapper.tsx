"use client";

import { usePathname } from "next/navigation";
import GlobalAIChatbot from "./GlobalAIChatbot";
import { useGlobalAIChat } from "@/context/GlobalAIChatContext";

// Pages where chatbot should be hidden
const HIDDEN_PAGES = [
  "/chat", // Don't show on chat page since AI is already integrated there
  "/auth/login",
  "/auth/register", 
  "/auth/forgot-password",
  "/auth/reset-password",
  "/admin", // Don't show on admin pages
];

export default function GlobalAIChatWrapper() {
  const pathname = usePathname();
  const { isEnabled, isVisible } = useGlobalAIChat();

  // Check if current page should hide the chatbot
  const shouldHide = HIDDEN_PAGES.some(page => 
    pathname.startsWith(page)
  );

  // Don't render if disabled, not visible, or on hidden pages
  if (!isEnabled || !isVisible || shouldHide) {
    return null;
  }

  return <GlobalAIChatbot />;
}