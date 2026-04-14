import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence } from "framer-motion";
import BottomNav from "@/components/BottomNav";
import OnboardingFlow from "@/components/OnboardingFlow";
import { useJournalStore } from "@/stores/journalStore";
import HomePage from "@/pages/HomePage";
import WritePage from "@/pages/WritePage";
import ProfilePage from "@/pages/ProfilePage";
import EntryDetailPage from "@/pages/EntryDetailPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const location = useLocation();
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

const App = () => {
  const hasOnboarded = useJournalStore(s => s.hasOnboarded);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          {!hasOnboarded ? <OnboardingFlow /> : <AppRoutes />}
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
