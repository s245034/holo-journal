import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import BottomNav from "@/components/BottomNav";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
import { useJournalStore } from "@/stores/journalStore";
import HomePage from "@/pages/HomePage";
import WritePage from "@/pages/WritePage";
import ProfilePage from "@/pages/ProfilePage";
import EntryDetailPage from "@/pages/EntryDetailPage";
import AuthPage from "@/pages/AuthPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedApp() {
  const location = useLocation();
  const { user, loading } = useAuth();
  const loadFromSupabase = useJournalStore(s => s.loadFromSupabase);
  const clearLocal = useJournalStore(s => s.clearLocal);
  const userId = useJournalStore(s => s.userId);

  useEffect(() => {
    if (user && user.id !== userId) {
      loadFromSupabase(user.id);
    } else if (!user && userId) {
      clearLocal();
    }
  }, [user, userId, loadFromSupabase, clearLocal]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">読み込み中...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  const hideNav = location.pathname.startsWith('/write') || location.pathname.startsWith('/entry/');

  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/write" element={<WritePage />} />
        <Route path="/write/:id" element={<WritePage />} />
        <Route path="/entry/:id" element={<EntryDetailPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideNav && <BottomNav />}
    </>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/auth/login" element={<AuthPage mode="login" />} />
      <Route path="/auth/signup" element={<AuthPage mode="signup" />} />
      <Route path="/*" element={<ProtectedApp />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
