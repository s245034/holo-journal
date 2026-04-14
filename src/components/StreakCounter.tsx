import { useJournalStore } from '@/stores/journalStore';
import { getWeekDaysWithEntries } from '@/lib/dateUtils';
import { motion } from 'framer-motion';

export default function StreakCounter() {
  const stats = useJournalStore(s => s.stats);
  const entries = useJournalStore(s => s.entries);
  const weekDays = getWeekDaysWithEntries(entries);
  const weekProgress = weekDays / 7;

  return (
    <div className="card-surface p-4 flex items-center gap-4">
      <div className="flex items-center gap-2">
        <span className="text-2xl animate-streak-pulse">🔥</span>
        <div>
          <p className="text-xl font-bold text-foreground">{stats.currentStreak}日</p>
          <p className="text-[11px] text-muted-foreground">連続記録</p>
        </div>
      </div>

      <div className="h-10 w-px bg-border" />

      <div className="flex items-center gap-3">
        <div className="relative h-11 w-11">
          <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
            <motion.circle
              cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"
              strokeDasharray={`${weekProgress * 94.25} 94.25`}
              initial={{ strokeDasharray: '0 94.25' }}
              animate={{ strokeDasharray: `${weekProgress * 94.25} 94.25` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground">
            {weekDays}/7
          </span>
        </div>
        <div>
          <p className="text-xs font-semibold text-foreground">今週</p>
          <p className="text-[11px] text-muted-foreground">{stats.totalEntries} 件</p>
        </div>
      </div>
    </div>
  );
}
