import { useState } from 'react';
import { useJournalStore } from '@/stores/journalStore';
import { PRESET_COLORS } from '@/types/journal';
import { Plus, Trash2, X, Check } from 'lucide-react';
import LabelChip from './LabelChip';
import EmojiPicker from './EmojiPicker';

export default function LabelManager() {
  const { labels, addLabel, updateLabel, deleteLabel } = useJournalStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState('');
  const [color, setColor] = useState<string>(PRESET_COLORS[0]);
  const [emoji, setEmoji] = useState('');

  const startEdit = (id: string) => {
    const l = labels.find(x => x.id === id);
    if (!l) return;
    setEditing(id);
    setTitle(l.title);
    setColor(l.color);
    setEmoji(l.emoji || '');
  };

  const save = () => {
    if (!title.trim()) return;
    if (editing) {
      updateLabel(editing, { title, color, emoji: emoji || undefined });
      setEditing(null);
    } else {
      addLabel({ title, color, emoji: emoji || undefined });
      setCreating(false);
    }
    setTitle('');
    setEmoji('');
  };

  const isOpen = creating || editing;

  return (
    <div className="card-surface p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">ラベル</h3>
        {!isOpen && (
          <button onClick={() => { setCreating(true); setTitle(''); setColor(PRESET_COLORS[0]); setEmoji(''); }}>
            <Plus size={18} className="text-primary" />
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {labels.map(l => (
          <div key={l.id} className="flex items-center gap-1">
            <LabelChip label={l} size="md" onClick={() => startEdit(l.id)} />
          </div>
        ))}
      </div>

      {isOpen && (
        <div className="space-y-3 pt-2 border-t border-border">
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
                className={`h-6 w-6 rounded-full transition-transform ${color === c ? 'scale-125 ring-2 ring-offset-2 ring-primary' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={save} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium">
              <Check size={14} /> 保存
            </button>
            <button
              onClick={() => { setEditing(null); setCreating(false); }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-xs font-medium"
            >
              <X size={14} /> キャンセル
            </button>
            {editing && (
              <button
                onClick={() => { deleteLabel(editing); setEditing(null); }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive text-xs font-medium ml-auto"
              >
                <Trash2 size={14} /> 削除
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
