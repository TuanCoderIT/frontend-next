import FlashcardPendingList from "@/components/admin/flashcards/FlashcardPendingList";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pending Flashcards | Admin",
  description: "Approve or reject pending flashcard sets",
};

export default function PendingFlashcardsPage() {
  return <FlashcardPendingList />;
}
