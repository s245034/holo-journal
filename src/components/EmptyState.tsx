import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function EmptyState() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center animate-fade-up">
      <div className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
        <BookOpen size={40} className="text-primary" />
      </div>
      <h2 className="text-xl font-bold text-foreground mb-2">日記がまだありません</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-[260px]">
        最初のエントリーを書いて、あなたの日々を記録しましょう。
      </p>
      <Button
        onClick={() => navigate('/write')}
        className="rounded-xl h-11 px-8 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
      >
        最初のエントリーを書く
      </Button>
    </div>
  );
}
