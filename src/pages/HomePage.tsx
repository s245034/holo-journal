import { useMemo } from 'react';
import { useJournalStore } from '@/stores/journalStore';
import { groupEntriesByWeek } from '@/lib/dateUtils';
import StreakCounter from '@/components/StreakCounter';
import SearchBar from '@/components/SearchBar';
import WeekSection from '@/components/WeekSection';
import EmptyState from '@/components/EmptyState';
import LabelChip from '@/components/LabelChip';
import { useState } from 'react';

export default function HomePage() {
  const entries = useJournalStore(s => s.entries);
  const labels = useJournalStore(s => s.labels);
  const searchQuery = useJournalStore(s => s.searchQuery);
  const [filterLabel, setFilterLabel] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = entries.filter(e => !e.isDraft);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        e => e.title.toLowerCase().includes(q) || e.body.toLowerCase().includes(q)
      );
    }
    if (filterLabel) {
      result = result.filter(e => e.labelIds.includes(filterLabel));
    }
    return result;
  }, [entries, searchQuery, filterLabel]);

  const weeks = useMemo(() => groupEntriesByWeek(filtered), [filtered]);

  return (
    <div className="safe-bottom px-4 pt-4 pb-4 space-y-5 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-foreground">Holo Journal</h1>
        <span className="text-xs text-muted-foreground font-medium">✨</span>
      </div>

      <StreakCounter />
      <SearchBar />

      {/* Label filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setFilterLabel(null)}
          className={`text-xs px-3 py-1 rounded-full font-medium transition whitespace-nowrap flex-shrink-0 ${
            !filterLabel ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          }`}
        >
          すべて
        </button>
        {labels.map(l => (
          <LabelChip
            key={l.id}
            label={l}
            size="md"
            selected={filterLabel === l.id}
            onClick={() => setFilterLabel(filterLabel === l.id ? null : l.id)}
          />
        ))}
      </div>

      {weeks.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-4">
          {weeks.map(week => (
            <WeekSection key={week.label} week={week} />
          ))}
        </div>
      )}
    </div>
  );
}
