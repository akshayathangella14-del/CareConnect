import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock, Sparkles } from 'lucide-react';
import styles from './SearchBar.module.css';

const CATEGORIES = [
  'AC Repair',
  'Refrigerator Repair',
  'Plumbing',
  'Electrical',
  'Cleaning',
  'Painting',
  'Carpenter',
  'Pest Control',
];

export default function SearchBar({ open, onClose, expanded, onToggle }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [recent, setRecent] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('cc-recent-searches') || '[]');
    } catch {
      return [];
    }
  });

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES.filter((item) => item.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const commitSearch = (value) => {
    const next = value.trim();
    if (!next) return;
    const updated = [next, ...recent.filter((item) => item !== next)].slice(0, 5);
    setRecent(updated);
    localStorage.setItem('cc-recent-searches', JSON.stringify(updated));
    onClose();
    navigate(`/?q=${encodeURIComponent(next)}#services`);
  };

  if (expanded && !open) {
    return (
      <form
        className={styles.inline}
        onSubmit={(e) => {
          e.preventDefault();
          commitSearch(query);
        }}
      >
        <Search size={16} />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search AC, plumbing..."
          aria-label="Search services"
        />
        <button type="button" onClick={onToggle} aria-label="Close search">
          <X size={16} />
        </button>
      </form>
    );
  }

  if (!open) return null;

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.panel}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search services"
      >
        <form
          className={styles.field}
          onSubmit={(e) => {
            e.preventDefault();
            commitSearch(query || suggestions[0]);
          }}
        >
          <Search size={20} />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What does your home need today?"
            aria-label="Search services"
          />
          <button type="button" onClick={onClose} aria-label="Close search">
            <X size={18} />
          </button>
        </form>

        {recent.length > 0 && !query && (
          <div className={styles.group}>
            <p className={styles.label}><Clock size={14} /> Recent searches</p>
            {recent.map((item) => (
              <button key={item} type="button" className={styles.item} onClick={() => commitSearch(item)}>
                {item}
              </button>
            ))}
          </div>
        )}

        <div className={styles.group}>
          <p className={styles.label}><Sparkles size={14} /> Popular categories</p>
          {suggestions.map((item) => (
            <button key={item} type="button" className={styles.item} onClick={() => commitSearch(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
