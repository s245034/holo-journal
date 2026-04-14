import { Search, X } from 'lucide-react';
import { useJournalStore } from '@/stores/journalStore';

export default function SearchBar() {
  const query = useJournalStore(s => s.searchQuery);
  const setQuery = useJournalStore(s => s.setSearchQuery);

  return (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="エントリーを検索..."
        className="w-full h-10 rounded-xl bg-muted/60 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
      />
      {query && (
        <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
          <X size={14} className="text-muted-foreground" />
        </button>
      )}
    </div>
  );
}
