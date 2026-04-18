import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface Props {
  mode: 'login' | 'signup';
}

export default function AuthPage({ mode }: Props) {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (session) navigate('/', { replace: true });
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('メールアドレスとパスワードを入力してください');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        toast.success('登録しました！');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('ログインしました');
      }
    } catch (err: any) {
      const msg = err?.message ?? 'エラーが発生しました';
      if (msg.includes('Invalid login')) toast.error('メールアドレスまたはパスワードが違います');
      else if (msg.includes('already registered')) toast.error('既に登録済みです。ログインしてください');
      else toast.error(msg);
    } finally {
      setBusy(false);
    }
  };

  const isSignup = mode === 'signup';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-foreground">Holo Journal</h1>
          <p className="text-sm text-muted-foreground">
            {isSignup ? '新規登録してはじめましょう' : 'おかえりなさい'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 card-surface p-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">メールアドレス</label>
            <Input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">パスワード</label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              minLength={6}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={busy}>
            {busy ? '処理中...' : isSignup ? '新規登録' : 'ログイン'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {isSignup ? 'すでにアカウントをお持ちですか？ ' : 'アカウントをお持ちでない方は '}
          <Link
            to={isSignup ? '/auth/login' : '/auth/signup'}
            className="text-primary font-medium hover:underline"
          >
            {isSignup ? 'ログイン' : '新規登録'}
          </Link>
        </p>
      </div>
    </div>
  );
}
