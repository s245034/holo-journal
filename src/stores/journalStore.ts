import { create } from 'zustand';
import { JournalEntry, Label, UserStats } from '@/types/journal';
import { format, differenceInCalendarDays, parseISO } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface JournalState {
  entries: JournalEntry[];
  labels: Label[];
  stats: UserStats;
  draft: Partial<JournalEntry> | null;
  hasOnboarded: boolean;
  searchQuery: string;
  loaded: boolean;
  userId: string | null;

  loadFromSupabase: (userId: string) => Promise<void>;
  clearLocal: () => void;

  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  addLabel: (label: Omit<Label, 'id' | 'createdAt'>) => Promise<string | null>;
  updateLabel: (id: string, updates: Partial<Label>) => Promise<void>;
  deleteLabel: (id: string) => Promise<void>;
  saveDraft: (draft: Partial<JournalEntry> | null) => void;
  setOnboarded: () => void;
  setSearchQuery: (q: string) => void;
  recalculateStats: () => void;
}

function calculateStreak(entries: JournalEntry[]): { current: number; longest: number } {
  if (entries.length === 0) return { current: 0, longest: 0 };
  const uniqueDates = [...new Set(entries.filter(e => !e.isDraft).map(e => e.date))].sort().reverse();
  if (uniqueDates.length === 0) return { current: 0, longest: 0 };

  const today = format(new Date(), 'yyyy-MM-dd');
  const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');

  let current = 0;
  if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
    current = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const diff = differenceInCalendarDays(parseISO(uniqueDates[i - 1]), parseISO(uniqueDates[i]));
      if (diff === 1) current++;
      else break;
    }
  }

  let longest = 1;
  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const diff = differenceInCalendarDays(parseISO(uniqueDates[i - 1]), parseISO(uniqueDates[i]));
    if (diff === 1) {
      streak++;
      longest = Math.max(longest, streak);
    } else {
      streak = 1;
    }
  }
  longest = Math.max(longest, current);
  return { current, longest };
}

const milestonesFor = (longest: number) => [7, 30, 100].filter(m => longest >= m);

const computeStats = (entries: JournalEntry[]): UserStats => {
  const { current, longest } = calculateStreak(entries);
  return {
    currentStreak: current,
    longestStreak: longest,
    totalEntries: entries.filter(e => !e.isDraft).length,
    milestones: milestonesFor(longest),
  };
};

// DB row -> domain
const rowToEntry = (r: any): JournalEntry => ({
  id: r.id,
  title: r.title,
  body: r.body,
  mood: r.mood,
  date: r.date,
  time: r.time ?? '',
  labelIds: r.label_ids ?? [],
  createdAt: r.created_at,
  updatedAt: r.updated_at,
  isDraft: r.is_draft,
});

const rowToLabel = (r: any): Label => ({
  id: r.id,
  title: r.title,
  color: r.color,
  emoji: r.emoji ?? undefined,
  createdAt: r.created_at,
});

export const useJournalStore = create<JournalState>()((set, get) => ({
  entries: [],
  labels: [],
  stats: { currentStreak: 0, longestStreak: 0, totalEntries: 0, milestones: [] },
  draft: null,
  hasOnboarded: true, // skip onboarding; auth gate replaces it
  searchQuery: '',
  loaded: false,
  userId: null,

  loadFromSupabase: async (userId) => {
    set({ userId, loaded: false });
    const [entriesRes, labelsRes] = await Promise.all([
      supabase.from('journal_entries').select('*').order('date', { ascending: false }),
      supabase.from('labels').select('*').order('created_at', { ascending: true }),
    ]);
    if (entriesRes.error) toast.error('日記の読み込みに失敗しました');
    if (labelsRes.error) toast.error('ラベルの読み込みに失敗しました');
    const entries = (entriesRes.data ?? []).map(rowToEntry);
    const labels = (labelsRes.data ?? []).map(rowToLabel);
    set({ entries, labels, stats: computeStats(entries), loaded: true });
  },

  clearLocal: () => set({
    entries: [],
    labels: [],
    stats: { currentStreak: 0, longestStreak: 0, totalEntries: 0, milestones: [] },
    draft: null,
    loaded: false,
    userId: null,
  }),

  addEntry: async (entry) => {
    const userId = get().userId;
    if (!userId) return;
    const { data, error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: userId,
        title: entry.title,
        body: entry.body,
        mood: entry.mood,
        date: entry.date,
        time: entry.time,
        label_ids: entry.labelIds,
        is_draft: entry.isDraft ?? false,
      })
      .select()
      .single();
    if (error || !data) {
      toast.error('保存に失敗しました');
      return;
    }
    const newEntry = rowToEntry(data);
    set(state => {
      const entries = [newEntry, ...state.entries];
      return { entries, draft: null, stats: computeStats(entries) };
    });
  },

  updateEntry: async (id, updates) => {
    const patch: any = {};
    if (updates.title !== undefined) patch.title = updates.title;
    if (updates.body !== undefined) patch.body = updates.body;
    if (updates.mood !== undefined) patch.mood = updates.mood;
    if (updates.date !== undefined) patch.date = updates.date;
    if (updates.time !== undefined) patch.time = updates.time;
    if (updates.labelIds !== undefined) patch.label_ids = updates.labelIds;
    if (updates.isDraft !== undefined) patch.is_draft = updates.isDraft;

    const { data, error } = await supabase
      .from('journal_entries')
      .update(patch)
      .eq('id', id)
      .select()
      .single();
    if (error || !data) {
      toast.error('更新に失敗しました');
      return;
    }
    const updated = rowToEntry(data);
    set(state => {
      const entries = state.entries.map(e => (e.id === id ? updated : e));
      return { entries, stats: computeStats(entries) };
    });
  },

  deleteEntry: async (id) => {
    const { error } = await supabase.from('journal_entries').delete().eq('id', id);
    if (error) {
      toast.error('削除に失敗しました');
      return;
    }
    set(state => {
      const entries = state.entries.filter(e => e.id !== id);
      return { entries, stats: computeStats(entries) };
    });
  },

  addLabel: async (label) => {
    const userId = get().userId;
    if (!userId) return null;
    const { data, error } = await supabase
      .from('labels')
      .insert({
        user_id: userId,
        title: label.title,
        color: label.color,
        emoji: label.emoji ?? null,
      })
      .select()
      .single();
    if (error || !data) {
      toast.error('ラベルの作成に失敗しました');
      return null;
    }
    const newLabel = rowToLabel(data);
    set(state => ({ labels: [...state.labels, newLabel] }));
    return newLabel.id;
  },

  updateLabel: async (id, updates) => {
    const patch: any = {};
    if (updates.title !== undefined) patch.title = updates.title;
    if (updates.color !== undefined) patch.color = updates.color;
    if (updates.emoji !== undefined) patch.emoji = updates.emoji;
    const { error } = await supabase.from('labels').update(patch).eq('id', id);
    if (error) {
      toast.error('ラベルの更新に失敗しました');
      return;
    }
    set(state => ({
      labels: state.labels.map(l => (l.id === id ? { ...l, ...updates } : l)),
    }));
  },

  deleteLabel: async (id) => {
    const { error } = await supabase.from('labels').delete().eq('id', id);
    if (error) {
      toast.error('ラベルの削除に失敗しました');
      return;
    }
    set(state => ({
      labels: state.labels.filter(l => l.id !== id),
      entries: state.entries.map(e => ({
        ...e,
        labelIds: e.labelIds.filter(lid => lid !== id),
      })),
    }));
  },

  saveDraft: (draft) => set({ draft }),
  setOnboarded: () => set({ hasOnboarded: true }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  recalculateStats: () => {
    const entries = get().entries;
    set({ stats: computeStats(entries) });
  },
}));
