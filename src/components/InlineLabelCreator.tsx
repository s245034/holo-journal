import { useState } from 'react';
import { useJournalStore } from '@/stores/journalStore';
import { PRESET_COLORS } from '@/types/journal';
import { Plus, X, Check } from 'lucide-react';
import EmojiPicker from './EmojiPicker';

interface InlineLabelCreatorProps {
  onCreated?: (labelId: string) => void;
}

export default function InlineLabelCreator({ onCreated }: InlineLabelCreatorProps) {
  const { addLabel } = useJournalStore();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [color, setColor] = useState<string>(PRESET_COLORS[0]);
  const [emoji, setEmoji] = useState('');

  const save = async () => {
    if (!title.trim()) return;
    const newId = await addLabel({ title, color, emoji: emoji || undefined });
    if (newId && onCreated) onCreated(newId);
    setTitle('');
    setEmoji('');
    setColor(PRESET_COLORS[0]);
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        type="button"
        className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition"
      >
        <Plus size={14} /> 新規ラベル
      </button>
    );
  }

  return (
    <div className="card-surface p-3 space-y-3 w-full">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-foreground">新しいラベル</span>
        <button onClick={() => setOpen(false)} type="button">
          <X size={16} className="text-muted-foreground" />
        </button>
      </div>

      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="ラベル名"
        className="w-full h-9 rounded-lg bg-muted px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
      />

      <EmojiPicker value={emoji} onChange={setEmoji} />

      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map(c => (
          <button
            key={c}
            onClick={() => setColor(c)}
            type="button"
            className={`h-6 w-6 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-offset-2 ring-primary' : ''}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      <button
        onClick={save}
        type="button"
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium"
      >
        <Check size={14} /> 作成
      </button>
    </div>
  );
}
