import { useRouter } from "next/navigation";
import { useMemo } from "react";
import type { AIChatContext } from "@/types/public/ai-chat";

interface UseAIChatContextProps {
  courseId?: number;
  courseTitle?: string;
  examId?: number;
  examTitle?: string;
}

export const useAIChatContext = ({
  courseId,
  courseTitle,
  examId,
  examTitle,
}: UseAIChatContextProps = {}): AIChatContext => {
  const router = useRouter();

  return useMemo(() => {
    // Check if we're on a course page
    if (typeof window !== "undefined" && window.location.pathname.includes('/courses/') && courseId) {
      return {
        type: "course",
        id: courseId,
        name: courseTitle,
      };
    }

    // Check if we're on an exam page
    if (typeof window !== "undefined" && window.location.pathname.includes('/exams/') && examId) {
      return {
        type: "exam",
        id: examId,
        name: examTitle,
      };
    }

    // Default to general context
    return { type: "general" };
  }, [courseId, courseTitle, examId, examTitle]);
};