import { useState } from 'react';
import { WeekGroup } from '@/lib/dateUtils';
import EntryCard from './EntryCard';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface WeekSectionProps {
  week: WeekGroup;
}

export default function WeekSection({ week }: WeekSectionProps) {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between px-1 py-2"
      >
        <div>
          <h2 className="text-sm font-bold text-foreground">{week.label}</h2>
          <p className="text-xs text-muted-foreground">{week.entries.length} {week.entries.length === 1 ? 'entry' : 'entries'}</p>
        </div>
        <ChevronDown
          size={18}
          className={`text-muted-foreground transition-transform ${open ? '' : '-rotate-90'}`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex gap-3 overflow-x-auto pb-3 pt-1 px-1 -mx-1 scrollbar-hide">
              {week.entries.map(entry => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  onClick={() => navigate(`/entry/${entry.id}`)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
