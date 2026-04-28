import { useMemo, useState } from 'react';
import { Repository, Language } from '../../types';
import RepositoryCard from './RepositoryCard';
import SearchFilter, { SortKey } from './SearchFilter';
import './RepositoryList.css';

interface RepositoryListProps {
  repositories: Repository[];
  onSelect: (repo: Repository) => void;
}

export default function RepositoryList({ repositories, onSelect }: RepositoryListProps) {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState<Language | 'All'>('All');
  const [sort, setSort] = useState<SortKey>('updated');

  const languages = useMemo<(Language | 'All')[]>(() => {
    const set = new Set<Language>();
    repositories.forEach((r) => set.add(r.primaryLanguage));
    return ['All', ...Array.from(set).sort()];
  }, [repositories]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = repositories.filter((r) => {
      if (language !== 'All' && r.primaryLanguage !== language) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.topics.some((t) => t.toLowerCase().includes(q))
      );
    });

    switch (sort) {
      case 'name':
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'stars':
        list = [...list].sort((a, b) => b.stars - a.stars);
        break;
      case 'updated':
      default:
        // mock data is roughly already in recency order — preserve
        break;
    }
    return list;
  }, [repositories, query, language, sort]);

  const totalStars = repositories.reduce((sum, r) => sum + r.stars, 0);
  const avgHealth = Math.round(
    repositories.reduce((sum, r) => sum + r.healthScore, 0) / repositories.length
  );

  return (
    <section className="repo-list">
      <div className="repo-list-hero">
        <div>
          <h1 className="repo-list-title">
            Your <span className="gradient-text">repositories</span>
          </h1>
          <p className="repo-list-subtitle">
            Browse, monitor, and dispatch AI agents across your codebase.
          </p>
        </div>
        <div className="repo-list-stats">
          <div className="stat-pill">
            <span className="stat-value">{repositories.length}</span>
            <span className="stat-label">Repos</span>
          </div>
          <div className="stat-pill">
            <span className="stat-value">{totalStars.toLocaleString()}</span>
            <span className="stat-label">Total stars</span>
          </div>
          <div className="stat-pill">
            <span className="stat-value">{avgHealth}</span>
            <span className="stat-label">Avg health</span>
          </div>
        </div>
      </div>

      <SearchFilter
        query={query}
        onQuery={setQuery}
        language={language}
        languages={languages}
        onLanguage={setLanguage}
        sort={sort}
        onSort={setSort}
      />

      {filtered.length === 0 ? (
        <div className="repo-list-empty">
          <div className="empty-icon" aria-hidden="true">🔍</div>
          <h3>No repositories match your filters</h3>
          <p>Try adjusting your search or selecting a different language.</p>
        </div>
      ) : (
        <div className="repo-grid">
          {filtered.map((repo) => (
            <RepositoryCard key={repo.id} repository={repo} onClick={() => onSelect(repo)} />
          ))}
        </div>
      )}
    </section>
  );
}
