import { useJournalStore } from '@/stores/journalStore';
import StreakCounter from '@/components/StreakCounter';
import HeatmapCalendar from '@/components/HeatmapCalendar';
import LabelManager from '@/components/LabelManager';
import { Trophy, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const MILESTONE_LABELS: Record<number, string> = {
  7: '🥉 1週間',
  30: '🥈 1ヶ月',
  100: '🥇 100日',
};

export default function ProfilePage() {
  const stats = useJournalStore(s => s.stats);
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    toast.success('ログアウトしました');
  };

  return (
    <div className="safe-bottom px-4 pt-4 pb-4 space-y-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">プロフィール</h1>
          {user?.email && <p className="text-xs text-muted-foreground mt-1">{user.email}</p>}
        </div>
        <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-1">
          <LogOut size={16} /> ログアウト
        </Button>
      </div>

      <StreakCounter />

      {/* Milestones */}
      <div className="card-surface p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-primary" />
          <h3 className="text-sm font-bold text-foreground">マイルストーン</h3>
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
        <h3 className="text-sm font-bold text-foreground">統計</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xl font-bold text-foreground">{stats.totalEntries}</p>
            <p className="text-[11px] text-muted-foreground">合計</p>
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{stats.currentStreak}</p>
            <p className="text-[11px] text-muted-foreground">現在の連続</p>
          </div>
          <div>
            <p className="text-xl font-bold text-foreground">{stats.longestStreak}</p>
            <p className="text-[11px] text-muted-foreground">最長連続</p>
          </div>
        </div>
      </div>
    </div>
  );
}
