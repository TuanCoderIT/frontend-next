// src/types/public/flashcard.ts

export type FlashcardSetVisibility = 'private' | 'public';
export type FlashcardSetSourceType = 'manual' | 'quiz_wrong_answers' | 'ai_generated';
export type FlashcardSetStatus = 'draft' | 'published' | 'archived';

export interface FlashcardSet {
  id: number;
  title: string;
  description: string | null;
  visibility: FlashcardSetVisibility;
  sourceType: FlashcardSetSourceType;
  status: FlashcardSetStatus;
  category?: { id: number; name: string } | null;
  exam?: { id: number; title: string } | null;
  user?: { id: number; name: string } | null;
  cardCount: number;
  cards?: Flashcard[];
  createdAt: string;
  updatedAt: string;
}

export interface Flashcard {
  id: number;
  flashcardSetId: number;
  term: string;
  definition: string;
  explanation: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FlashcardSetFormData {
  title: string;
  description: string;
  visibility: FlashcardSetVisibility;
  sourceType: FlashcardSetSourceType;
  status: FlashcardSetStatus;
  categoryId: number | null;
  examId: number | null;
  cards: Array<Partial<Flashcard> & Pick<Flashcard, 'term' | 'definition'>>;
}

export type FlashcardSetPayload = Omit<FlashcardSetFormData, 'cards'>;
export type FlashcardPayload = Pick<Flashcard, 'term' | 'definition'> &
  Partial<Pick<Flashcard, 'explanation'>>;
