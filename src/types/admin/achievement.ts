export type AchievementRarity = "common" | "rare" | "epic" | "legendary";

export type AchievementType =
  | "general"
  | "quiz"
  | "flashcard"
  | "streak"
  | "xp"
  | "creator"
  | "community"
  | "leaderboard";

export interface Achievement {
  id: number;
  code: string;
  name: string;
  description?: string | null;
  icon?: string | null;
  type: AchievementType;
  rarity: AchievementRarity;
  target_value: number;
  xp_reward: number;
  token_reward: number;
  reward_title?: string | null;
  reward_trophy?: string | null;
  conditions?: Record<string, unknown> | null;
  is_active: boolean;
  user_achievements_count?: number;
  created_at: string;
  updated_at: string;
}

export interface AchievementFormData {
  code: string;
  name: string;
  description: string;
  icon: string;
  type: AchievementType;
  rarity: AchievementRarity;
  target_value: number;
  xp_reward: number;
  token_reward: number;
  reward_title: string;
  reward_trophy: string;
  conditions: string;
  is_active: boolean;
}

export interface AchievementPayload {
  code: string;
  name: string;
  description: string | null;
  icon: string | null;
  type: AchievementType;
  rarity: AchievementRarity;
  target_value: number;
  xp_reward: number;
  token_reward: number;
  reward_title: string | null;
  reward_trophy: string | null;
  conditions: Record<string, unknown> | null;
  is_active: boolean;
}

export interface AchievementFilters {
  search?: string;
  type?: string;
  rarity?: string;
  is_active?: string;
}
