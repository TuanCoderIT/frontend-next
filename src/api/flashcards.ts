import { axiosAPI } from "./axios";
import {
  Flashcard,
  FlashcardPayload,
  FlashcardSet,
  FlashcardSetPayload,
  FlashcardSetStatus,
} from "@/types/public/flashcard";

/**
 * Laravel Resources usually wrap the response in a 'data' property.
 * This helper ensures we get the actual data regardless of wrapping.
 */
const unwrap = (response: any) => response.data || response;
const unwrapList = <T>(response: any): T[] => {
  const unwrapped = unwrap(response);
  if (Array.isArray(unwrapped)) return unwrapped;
  if (Array.isArray(unwrapped?.data)) return unwrapped.data;
  return [];
};

// Flashcard Set CRUD
export const getFlashcardSets = async (): Promise<FlashcardSet[]> => {
  const { data } = await axiosAPI.get("/flashcard-sets");
  return unwrapList<FlashcardSet>(data);
};

export const getFlashcardSetById = async (id: number): Promise<FlashcardSet> => {
  const { data } = await axiosAPI.get(`/flashcard-sets/${id}`);
  return unwrap(data);
};

export const createFlashcardSet = async (data: FlashcardSetPayload): Promise<FlashcardSet> => {
  const { data: responseData } = await axiosAPI.post("/flashcard-sets", data);
  return unwrap(responseData);
};

export const updateFlashcardSet = async (id: number, data: Partial<FlashcardSetPayload>): Promise<FlashcardSet> => {
  const { data: responseData } = await axiosAPI.put(`/flashcard-sets/${id}`, data);
  return unwrap(responseData);
};

export const deleteFlashcardSet = async (id: number): Promise<void> => {
  await axiosAPI.delete(`/flashcard-sets/${id}`);
};

export const submitFlashcardSet = async (id: number): Promise<FlashcardSet> => {
  const { data } = await axiosAPI.post(`/flashcard-sets/${id}/submit`);
  return unwrap(data);
};

// Flashcards (Individual)
export const createFlashcard = async (setId: number, data: FlashcardPayload): Promise<Flashcard> => {
  const { data: responseData } = await axiosAPI.post(`/flashcard-sets/${setId}/cards`, data);
  return unwrap(responseData);
};

export const updateFlashcard = async (cardId: number, data: FlashcardPayload): Promise<Flashcard> => {
  const { data: responseData } = await axiosAPI.put(`/flashcards/${cardId}`, data);
  return unwrap(responseData);
};

export const deleteFlashcard = async (cardId: number): Promise<void> => {
  await axiosAPI.delete(`/flashcards/${cardId}`);
};

// Admin Moderation
export const updateFlashcardSetStatus = async (
  id: number,
  status: FlashcardSetStatus,
  reviewNotes?: string
): Promise<FlashcardSet> => {
  const { data } = await axiosAPI.patch(`/flashcard-sets/${id}/status`, {
    status,
    reviewNotes,
  });
  return unwrap(data);
};

export const getPendingFlashcardSets = async (): Promise<FlashcardSet[]> => {
  const { data } = await axiosAPI.get("/admin/flashcard-sets/pending");
  return unwrapList<FlashcardSet>(data);
};

export const approveFlashcardSet = async (id: number): Promise<FlashcardSet> => {
  const { data } = await axiosAPI.post(`/admin/flashcard-sets/${id}/approve`);
  return unwrap(data);
};

export const rejectFlashcardSet = async (id: number, reason: string): Promise<FlashcardSet> => {
  const { data } = await axiosAPI.post(`/admin/flashcard-sets/${id}/reject`, { reason });
  return unwrap(data);
};

export const archiveFlashcardSet = async (id: number): Promise<FlashcardSet> => {
  const { data } = await axiosAPI.post(`/admin/flashcard-sets/${id}/archive`);
  return unwrap(data);
};
