import { Home, PenLine, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const tabs = [
  { path: '/', icon: Home, label: 'ホーム' },
  { path: '/write', icon: PenLine, label: '書く' },
  { path: '/profile', icon: User, label: 'プロフィール' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-lg items-center justify-around px-4 pb-[env(safe-area-inset-bottom,0px)]" style={{ height: 'var(--nav-height)' }}>
        {tabs.map(tab => {
          const active = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center gap-1 px-4 py-2"
            >
              {active && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute -top-px left-2 right-2 h-0.5 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <tab.icon size={22} className={active ? 'text-primary' : 'text-muted-foreground'} />
              <span className={`text-[11px] font-medium ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
