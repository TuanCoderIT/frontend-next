import { axiosAPI } from "./axios";
import {
  Achievement,
  AchievementPayload,
} from "@/types/admin/achievement";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const unwrap = <T>(response: unknown): T => {
  if (isRecord(response) && "data" in response) {
    return response.data as T;
  }
  return response as T;
};

const unwrapList = <T>(response: unknown): T[] => {
  const unwrapped = unwrap<unknown>(response);
  if (Array.isArray(unwrapped)) return unwrapped;
  if (isRecord(unwrapped) && Array.isArray(unwrapped.data)) {
    return unwrapped.data as T[];
  }
  return [];
};

export const getAchievements = async (): Promise<Achievement[]> => {
  const { data } = await axiosAPI.get("/admin/achievements");
  return unwrapList<Achievement>(data);
};

export const getAchievementById = async (
  id: number,
): Promise<Achievement> => {
  const { data } = await axiosAPI.get(`/admin/achievements/${id}`);
  return unwrap<Achievement>(data);
};

export const createAchievement = async (
  payload: AchievementPayload,
): Promise<Achievement> => {
  const { data } = await axiosAPI.post("/admin/achievements", payload);
  return unwrap<Achievement>(data);
};

export const updateAchievement = async (
  id: number,
  payload: AchievementPayload,
): Promise<Achievement> => {
  const { data } = await axiosAPI.put(`/admin/achievements/${id}`, payload);
  return unwrap<Achievement>(data);
};

export const deleteAchievement = async (id: number): Promise<void> => {
  await axiosAPI.delete(`/admin/achievements/${id}`);
};
