import { useJournalStore } from '@/stores/journalStore';
import StreakCounter from '@/components/StreakCounter';
import HeatmapCalendar from '@/components/HeatmapCalendar';
import LabelManager from '@/components/LabelManager';
import { Trophy } from 'lucide-react';

const MILESTONE_LABELS: Record<number, string> = {
  7: '🥉 1 Week',
  30: '🥈 1 Month',
  100: '🥇 100 Days',
};

export default function ProfilePage() {
  const stats = useJournalStore(s => s.stats);

  return (
    <div className="safe-bottom px-4 pt-4 pb-4 space-y-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-extrabold text-foreground">Profile</h1>

      <StreakCounter />

      {/* Milestones */}
      <div className="card-surface p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-primary" />
          <h3 className="text-sm font-bold text-foreground">Milestones</h3>
        </div>
        <div className="flex gap-3">
          {[7, 30, 100].map(m => {
            const unlocked = stats.milestones.includes(m);
            return (
              <div
                key={m}
                className={`flex-1 card-surface p-3 text-center transition ${
                  unlocked ? '' : 'opacity-30 grayscale'
                }`}
              >
                <p className="text-lg">{MILESTONE_LABELS[m].split(' ')[0]}</p>
                <p className="text-[11px] font-medium text-muted-foreground mt-1">
                  {MILESTONE_LABELS[m].split(' ').slice(1).join(' ')}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <HeatmapCalendar />

      <LabelManager />

      {/* Stats */}
      <div className="card-surface p-4 space-y-2">
        <h3 className="text-sm font-bold text-foreground">Stats</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xl font-bold text-foreground">{stats.totalEntries}</p>
            <p className="text-[11px] text-muted-foreground">Total</p>
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{stats.currentStreak}</p>
            <p className="text-[11px] text-muted-foreground">Current</p>
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{stats.longestStreak}</p>
            <p className="text-[11px] text-muted-foreground">Longest</p>
          </div>
        </div>
      </div>
    </div>
  );
}
