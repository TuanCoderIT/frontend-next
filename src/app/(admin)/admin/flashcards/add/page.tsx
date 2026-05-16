import FlashcardForm from "@/components/admin/flashcards/FlashcardForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Flashcard Set | Admin",
  description: "Create a new flashcard set for users to learn",
};

export default function AddFlashcardSetPage() {
  return <FlashcardForm />;
}
