import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useJournalStore } from '@/stores/journalStore';
import MoodSelector from '@/components/MoodSelector';
import LabelChip from '@/components/LabelChip';
import InlineLabelCreator from '@/components/InlineLabelCreator';
import { format } from 'date-fns';
import { ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function WritePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { entries, labels, addEntry, updateEntry, saveDraft, draft } = useJournalStore();

  const existingEntry = id ? entries.find(e => e.id === id) : null;

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [mood, setMood] = useState(3);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  useEffect(() => {
    if (existingEntry) {
      setTitle(existingEntry.title);
      setBody(existingEntry.body);
      setMood(existingEntry.mood);
      setDate(existingEntry.date);
      setTime(existingEntry.time || format(new Date(), 'HH:mm'));
      setSelectedLabels(existingEntry.labelIds);
    } else if (draft && !id) {
      setTitle(draft.title || '');
      setBody(draft.body || '');
      setMood(draft.mood || 3);
      setDate(draft.date || format(new Date(), 'yyyy-MM-dd'));
      setTime(draft.time || format(new Date(), 'HH:mm'));
      setSelectedLabels(draft.labelIds || []);
    }
  }, [existingEntry, draft, id]);

  // Auto-save draft
  useEffect(() => {
    if (id) return;
    const timer = setTimeout(() => {
      if (title || body) {
        saveDraft({ title, body, mood, date, time, labelIds: selectedLabels });
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [title, body, mood, date, time, selectedLabels, saveDraft, id]);

  const toggleLabel = useCallback((labelId: string) => {
    setSelectedLabels(prev =>
      prev.includes(labelId) ? prev.filter(l => l !== labelId) : [...prev, labelId]
    );
  }, []);

  const handleLabelCreated = useCallback((labelId: string) => {
    setSelectedLabels(prev => [...prev, labelId]);
  }, []);

  const handleSave = () => {
    if (!title.trim() && !body.trim()) {
      toast.error('何か書いてください！');
      return;
    }
    if (existingEntry) {
      updateEntry(existingEntry.id, { title, body, mood, date, time, labelIds: selectedLabels });
      toast.success('更新しました');
    } else {
      addEntry({ title, body, mood, date, time, labelIds: selectedLabels, isDraft: false });
      toast.success('保存しました！🎉');
    }
    navigate('/');
  };

  return (
    <div className="safe-bottom max-w-lg mx-auto flex flex-col min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <span className="text-xs text-muted-foreground font-medium">
          {id ? '日記を編集' : '新しい日記'}
        </span>
        <button onClick={handleSave} className="p-1">
          <Check size={20} className="text-primary" />
        </button>
      </div>

      <div className="flex-1 px-4 pt-4 space-y-4 overflow-y-auto">
        {/* Date & Time */}
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="text-xs text-muted-foreground bg-transparent focus:outline-none font-medium"
          />
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
            className="text-xs text-muted-foreground bg-transparent focus:outline-none font-medium"
          />
        </div>

        {/* Title */}
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="タイトル"
          className="w-full text-2xl font-bold text-foreground bg-transparent focus:outline-none placeholder:text-muted-foreground/40"
        />

        {/* Body */}
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="今日の気持ちを書いてみましょう..."
          className="w-full flex-1 min-h-[40vh] text-sm leading-relaxed text-foreground bg-transparent focus:outline-none placeholder:text-muted-foreground/40 resize-none"
        />

        {/* Mood */}
        <MoodSelector value={mood} onChange={setMood} />

        {/* Labels */}
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2">ラベル</p>
          <div className="flex flex-wrap gap-2">
            {labels.map(l => (
              <LabelChip
                key={l.id}
                label={l}
                size="md"
                selected={selectedLabels.includes(l.id)}
                onClick={() => toggleLabel(l.id)}
              />
            ))}
            <InlineLabelCreator onCreated={handleLabelCreated} />
          </div>
        </div>
      </div>
    </div>
  );
}
