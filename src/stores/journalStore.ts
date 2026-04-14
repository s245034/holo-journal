import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { JournalEntry, Label, UserStats, DEFAULT_LABELS } from '@/types/journal';
import { format, differenceInCalendarDays, parseISO, startOfDay } from 'date-fns';

const generateId = () => crypto.randomUUID();

interface JournalState {
  entries: JournalEntry[];
  labels: Label[];
  stats: UserStats;
  draft: Partial<JournalEntry> | null;
  hasOnboarded: boolean;
  searchQuery: string;

  // Actions
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  addLabel: (label: Omit<Label, 'id' | 'createdAt'>) => void;
  updateLabel: (id: string, updates: Partial<Label>) => void;
  deleteLabel: (id: string) => void;
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

function getMilestones(longestStreak: number): number[] {
  return [7, 30, 100].filter(m => longestStreak >= m);
}

const initLabels = (): Label[] =>
  DEFAULT_LABELS.map(l => ({
    ...l,
    id: generateId(),
    createdAt: new Date().toISOString(),
  }));

export const useJournalStore = create<JournalState>()(
  persist(
    (set, get) => ({
      entries: [],
      labels: initLabels(),
      stats: { currentStreak: 0, longestStreak: 0, totalEntries: 0, milestones: [] },
      draft: null,
      hasOnboarded: false,
      searchQuery: '',

      addEntry: (entry) => {
        const now = new Date().toISOString();
        const newEntry: JournalEntry = {
          ...entry,
          id: generateId(),
          createdAt: now,
          updatedAt: now,
        };
        set(state => {
          const entries = [newEntry, ...state.entries];
          const { current, longest } = calculateStreak(entries);
          return {
            entries,
            draft: null,
            stats: {
              currentStreak: current,
              longestStreak: longest,
              totalEntries: entries.filter(e => !e.isDraft).length,
              milestones: getMilestones(longest),
            },
          };
        });
      },

      updateEntry: (id, updates) => {
        set(state => {
          const entries = state.entries.map(e =>
            e.id === id ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e
          );
          return { entries };
        });
      },

      deleteEntry: (id) => {
        set(state => {
          const entries = state.entries.filter(e => e.id !== id);
          const { current, longest } = calculateStreak(entries);
          return {
            entries,
            stats: {
              currentStreak: current,
              longestStreak: longest,
              totalEntries: entries.filter(e => !e.isDraft).length,
              milestones: getMilestones(longest),
            },
          };
        });
      },

      addLabel: (label) => {
        set(state => ({
          labels: [...state.labels, { ...label, id: generateId(), createdAt: new Date().toISOString() }],
        }));
      },

      updateLabel: (id, updates) => {
        set(state => ({
          labels: state.labels.map(l => (l.id === id ? { ...l, ...updates } : l)),
        }));
      },

      deleteLabel: (id) => {
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
        const { current, longest } = calculateStreak(entries);
        set({
          stats: {
            currentStreak: current,
            longestStreak: longest,
            totalEntries: entries.filter(e => !e.isDraft).length,
            milestones: getMilestones(longest),
          },
        });
      },
    }),
    { name: 'holo-journal-storage' }
  )
);
