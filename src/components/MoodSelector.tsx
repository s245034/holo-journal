import { MOOD_EMOJIS } from '@/types/journal';
import { motion } from 'framer-motion';

interface MoodSelectorProps {
  value: number;
  onChange: (mood: number) => void;
}

export default function MoodSelector({ value, onChange }: MoodSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground mr-1">気分</span>
      {MOOD_EMOJIS.map((emoji, i) => {
        const mood = i + 1;
        const active = value === mood;
        return (
          <button key={mood} type="button" onClick={() => onChange(mood)} className="relative p-1">
            {active && (
              <motion.div
                layoutId="moodRing"
                className="absolute inset-0 rounded-full bg-primary/15"
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              />
            )}
            <span className={`text-xl transition-transform ${active ? 'scale-125' : 'grayscale opacity-50 hover:opacity-80'}`}>
              {emoji}
            </span>
          </button>
        );
      })}
    </div>
  );
}
