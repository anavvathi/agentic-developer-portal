import { Language } from '../../types';

export type SortKey = 'updated' | 'name' | 'stars';

interface SearchFilterProps {
  query: string;
  onQuery: (q: string) => void;
  language: Language | 'All';
  languages: (Language | 'All')[];
  onLanguage: (lang: Language | 'All') => void;
  sort: SortKey;
  onSort: (sort: SortKey) => void;
}

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'updated', label: 'Recently updated' },
  { key: 'name', label: 'Name' },
  { key: 'stars', label: 'Stars' },
];

export default function SearchFilter({
  query,
  onQuery,
  language,
  languages,
  onLanguage,
  sort,
  onSort,
}: SearchFilterProps) {
  return (
    <div className="search-filter">
      <div className="search-input-wrapper">
        <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M21 21L16 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Search repositories, topics, or descriptions…"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          aria-label="Search repositories"
        />
        {query && (
          <button
            className="search-clear"
            onClick={() => onQuery('')}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      <div className="filter-row">
        <div className="filter-group" role="group" aria-label="Filter by language">
          {languages.map((lang) => (
            <button
              key={lang}
              className={`filter-chip ${language === lang ? 'active' : ''}`}
              onClick={() => onLanguage(lang)}
            >
              {lang}
            </button>
          ))}
        </div>

        <div className="sort-group">
          <label htmlFor="sort-select" className="sort-label">Sort by</label>
          <select
            id="sort-select"
            className="sort-select"
            value={sort}
            onChange={(e) => onSort(e.target.value as SortKey)}
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
