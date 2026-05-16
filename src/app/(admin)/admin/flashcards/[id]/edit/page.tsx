"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FlashcardForm from "@/components/admin/flashcards/FlashcardForm";
import { FlashcardSet } from "@/types/flashcard";
import { getFlashcardSetById } from "@/api/flashcards";
import { DataLoading } from "@/components/common/LoadingScreen";

export default function EditFlashcardSetPage() {
  const { id } = useParams();
  const [initialData, setInitialData] = useState<FlashcardSet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFlashcardSetById(Number(id));
        setInitialData(data);
      } catch (error) {
        console.error("Failed to fetch flashcard set:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (loading) return <DataLoading text="Fetching flashcard set details..." />;
  if (!initialData) return <div className="text-center py-20 text-gray-500">Flashcard set not found.</div>;

  return <FlashcardForm initialData={initialData} isEdit />;
}
