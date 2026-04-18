import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useJournalStore } from '@/stores/journalStore';
import { Button } from '@/components/ui/button';
import { BookOpen, Sparkles, Flame } from 'lucide-react';

const slides = [
  {
    icon: BookOpen,
    title: 'Holo Journalへようこそ',
    desc: '毎日の振り返り、成長、マインドフルネスのためのあなた専用スペースです。',
  },
  {
    icon: Sparkles,
    title: 'すべての瞬間を記録',
    desc: '日記を書いて、ラベルで分類し、日々の気分を記録しましょう。',
  },
  {
    icon: Flame,
    title: '連続記録を積み上げよう',
    desc: '毎日書いて、連続記録を伸ばし、マイルストーンを達成しましょう。',
  },
];

export default function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const setOnboarded = useJournalStore(s => s.setOnboarded);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="w-full max-w-sm px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col items-center text-center gap-4"
          >
            <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center">
              {(() => {
                const Icon = slides[step].icon;
                return <Icon size={36} className="text-primary" />;
              })()}
            </div>
            <h1 className="text-2xl font-bold text-foreground">{slides[step].title}</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">{slides[step].desc}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-1.5 mt-8 mb-6">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === step ? 'w-6 bg-primary' : 'w-1.5 bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        <Button
          className="w-full rounded-xl h-12 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => {
            if (step < slides.length - 1) setStep(s => s + 1);
            else setOnboarded();
          }}
        >
          {step < slides.length - 1 ? '次へ' : 'はじめる'}
        </Button>
      </div>
    </div>
  );
}
