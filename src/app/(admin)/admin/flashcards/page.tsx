import FlashcardManagement from "@/components/admin/flashcards/FlashcardManagement";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flashcards Management | Admin",
  description: "Manage and review flashcard sets",
};

export default function AdminFlashcardsPage() {
  return <FlashcardManagement />;
}
