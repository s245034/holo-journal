import { startOfWeek, endOfWeek, format, parseISO, isSameWeek } from 'date-fns';
import { JournalEntry } from '@/types/journal';

export interface WeekGroup {
  weekStart: Date;
  weekEnd: Date;
  label: string;
  entries: JournalEntry[];
}

export function groupEntriesByWeek(entries: JournalEntry[]): WeekGroup[] {
  const sorted = [...entries]
    .filter(e => !e.isDraft)
    .sort((a, b) => b.date.localeCompare(a.date));

  const groups: WeekGroup[] = [];

  for (const entry of sorted) {
    const entryDate = parseISO(entry.date);
    const ws = startOfWeek(entryDate, { weekStartsOn: 1 });
    const existing = groups.find(g => g.weekStart.getTime() === ws.getTime());
    if (existing) {
      existing.entries.push(entry);
    } else {
      const we = endOfWeek(entryDate, { weekStartsOn: 1 });
      groups.push({
        weekStart: ws,
        weekEnd: we,
        label: `${format(ws, 'MMM d')} – ${format(we, 'MMM d')}`,
        entries: [entry],
      });
    }
  }

  return groups.sort((a, b) => b.weekStart.getTime() - a.weekStart.getTime());
}

export function getWeekDaysWithEntries(entries: JournalEntry[]): number {
  const now = new Date();
  const thisWeekEntries = entries.filter(e =>
    !e.isDraft && isSameWeek(parseISO(e.date), now, { weekStartsOn: 1 })
  );
  return new Set(thisWeekEntries.map(e => e.date)).size;
}

export function getMonthHeatmapData(entries: JournalEntry[]): Record<string, number> {
  const counts: Record<string, number> = {};
  entries.filter(e => !e.isDraft).forEach(e => {
    counts[e.date] = (counts[e.date] || 0) + 1;
  });
  return counts;
}
