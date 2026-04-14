import { useParams, useNavigate } from 'react-router-dom';
import { useJournalStore } from '@/stores/journalStore';
import { MOOD_EMOJIS } from '@/types/journal';
import LabelChip from '@/components/LabelChip';
import { format, parseISO } from 'date-fns';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function EntryDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { entries, labels, deleteEntry } = useJournalStore();

  const entry = entries.find(e => e.id === id);
  if (!entry) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Entry not found</p>
      </div>
    );
  }

  const entryLabels = labels.filter(l => entry.labelIds.includes(l.id));

  const handleDelete = () => {
    deleteEntry(entry.id);
    toast('Entry deleted', {
      action: {
        label: 'Undo',
        onClick: () => {
          // re-add (simplified - no perfect undo)
          useJournalStore.getState().addEntry({
            title: entry.title,
            body: entry.body,
            mood: entry.mood,
            date: entry.date,
            labelIds: entry.labelIds,
          });
        },
      },
    });
    navigate('/');
  };

  return (
    <div className="safe-bottom max-w-lg mx-auto min-h-screen">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button onClick={() => navigate('/')} className="p-1">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <div className="flex gap-2">
          <button onClick={() => navigate(`/write/${entry.id}`)} className="p-1">
            <Pencil size={18} className="text-muted-foreground" />
          </button>
          <button onClick={handleDelete} className="p-1">
            <Trash2 size={18} className="text-destructive" />
          </button>
        </div>
      </div>

      <div className="px-4 pt-6 space-y-4 animate-fade-in">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground font-medium">
            {format(parseISO(entry.date), 'EEEE, MMMM d, yyyy')}
          </span>
          <span className="text-2xl">{MOOD_EMOJIS[entry.mood - 1]}</span>
        </div>

        <h1 className="text-2xl font-bold text-foreground">{entry.title || 'Untitled'}</h1>

        {entryLabels.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {entryLabels.map(l => (
              <LabelChip key={l.id} label={l} size="md" />
            ))}
          </div>
        )}

        <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap pt-2">
          {entry.body}
        </div>
      </div>
    </div>
  );
}
