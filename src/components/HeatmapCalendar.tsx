import { useMemo } from 'react';
import { useJournalStore } from '@/stores/journalStore';
import { getMonthHeatmapData } from '@/lib/dateUtils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, subMonths } from 'date-fns';

export default function HeatmapCalendar() {
  const entries = useJournalStore(s => s.entries);
  const heatmap = useMemo(() => getMonthHeatmapData(entries), [entries]);

  const months = useMemo(() => {
    const now = new Date();
    return [subMonths(now, 2), subMonths(now, 1), now];
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold text-foreground">Activity</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {months.map(month => {
          const start = startOfMonth(month);
          const end = endOfMonth(month);
          const days = eachDayOfInterval({ start, end });
          const startPad = (getDay(start) + 6) % 7; // Monday start

          return (
            <div key={format(month, 'yyyy-MM')} className="flex-shrink-0">
              <p className="text-[11px] font-medium text-muted-foreground mb-1.5">
                {format(month, 'MMMM')}
              </p>
              <div className="grid grid-cols-7 gap-[3px]">
                {Array.from({ length: startPad }).map((_, i) => (
                  <div key={`pad-${i}`} className="h-3 w-3" />
                ))}
                {days.map(day => {
                  const key = format(day, 'yyyy-MM-dd');
                  const count = heatmap[key] || 0;
                  let bg = 'bg-muted';
                  if (count === 1) bg = 'bg-primary/30';
                  else if (count === 2) bg = 'bg-primary/55';
                  else if (count >= 3) bg = 'bg-primary';

                  return (
                    <div
                      key={key}
                      className={`h-3 w-3 rounded-[2px] ${bg} transition-colors`}
                      title={`${key}: ${count} entries`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
