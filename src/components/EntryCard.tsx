import { JournalEntry, MOOD_EMOJIS } from '@/types/journal';
import { useJournalStore } from '@/stores/journalStore';
import LabelChip from './LabelChip';
import { format, parseISO } from 'date-fns';
import { ja } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface EntryCardProps {
  entry: JournalEntry;
  onClick: () => void;
}

export default function EntryCard({ entry, onClick }: EntryCardProps) {
  const labels = useJournalStore(s => s.labels);
  const entryLabels = labels.filter(l => entry.labelIds.includes(l.id));

  return (
    <motion.button
      onClick={onClick}
      className="card-surface p-4 text-left w-[240px] flex-shrink-0 flex flex-col gap-2 hover:shadow-lg transition-shadow"
      whileTap={{ scale: 0.97 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {format(parseISO(entry.date), 'M/d（EEE）', { locale: ja })}
          {entry.time && <span className="ml-1">{entry.time}</span>}
        </span>
        <span className="text-lg">{MOOD_EMOJIS[entry.mood - 1]}</span>
      </div>
      <h3 className="font-semibold text-sm text-foreground line-clamp-1">{entry.title || '無題'}</h3>
      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{entry.body}</p>
      {entryLabels.length > 0 && (
        <div className="flex gap-1 flex-wrap mt-auto pt-1">
          {entryLabels.slice(0, 3).map(l => (
            <LabelChip key={l.id} label={l} />
          ))}
        </div>
      )}
    </motion.button>
  );
}
