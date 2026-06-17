"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import FlashcardDetail from "@/components/admin/flashcards/FlashcardDetail";
import { FlashcardSet } from "@/types/public/flashcard";
import { getFlashcardSetById } from "@/api/flashcards";
import { DataLoading } from "@/components/common/LoadingScreen";

export default function FlashcardSetDetailPage() {
  const { id } = useParams();
  const [data, setData] = useState<FlashcardSet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getFlashcardSetById(Number(id));
        setData(result);
      } catch (error) {
        console.error("Failed to fetch flashcard set:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (loading) return <DataLoading text="Loading flashcard set details..." />;
  if (!data)
    return (
      <div className="text-center py-20 text-gray-500">
        Flashcard set not found.
      </div>
    );

  return <FlashcardDetail flashcardSet={data} />;
}
