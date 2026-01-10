import type { ReactionType } from '@/types/public/chat-type';

export const REACTION_EMOJIS: Record<ReactionType, string> = {
  like: '👍',
  love: '❤️',
  haha: '😂',
  wow: '😮',
  sad: '😢',
  angry: '😠',
  thanks: '🙏',
};

export const REACTION_TYPES: ReactionType[] = [
  'like',
  'love',
  'haha',
  'wow',
  'sad',
  'angry',
  'thanks',
];