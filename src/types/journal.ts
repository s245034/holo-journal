export interface JournalEntry {
  id: string;
  title: string;
  body: string;
  mood: number; // 1-5
  date: string; // ISO date string YYYY-MM-DD
  time: string; // HH:mm
  labelIds: string[];
  createdAt: string;
  updatedAt: string;
  isDraft?: boolean;
}

export interface Label {
  id: string;
  title: string;
  color: string; // hex
  emoji?: string;
  createdAt: string;
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalEntries: number;
  milestones: number[]; // unlocked milestones
}

export const MOOD_EMOJIS = ['😞', '😐', '🙂', '😊', '🤩'] as const;

export const PRESET_COLORS = [
  '#5B5BD6', '#3B82F6', '#06B6D4', '#10B981', '#22C55E',
  '#EAB308', '#F59E0B', '#F97316', '#EF4444', '#EC4899',
  '#A855F7', '#8B5CF6',
] as const;

export const DEFAULT_LABELS: Omit<Label, 'id' | 'createdAt'>[] = [
  { title: '個人', color: '#5B5BD6', emoji: '💭' },
  { title: '仕事', color: '#3B82F6', emoji: '💼' },
  { title: '感謝', color: '#10B981', emoji: '🙏' },
  { title: 'アイデア', color: '#F59E0B', emoji: '💡' },
];
