import { useState } from 'react';
import { Repository } from '../../types';
import InsightsPanel from './InsightsPanel';
import LanguageBreakdown from './LanguageBreakdown';
import './RepositoryOverview.css';

interface RepositoryOverviewProps {
  repository: Repository;
  onRunAgent: () => void;
}

export default function RepositoryOverview({ repository, onRunAgent }: RepositoryOverviewProps) {
  const [copied, setCopied] = useState(false);

  const copyClone = async () => {
    try {
      await navigator.clipboard.writeText(repository.cloneUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard may be unavailable */
    }
  };

  return (
    <section className="repo-overview">
      <header className="overview-header">
        <div className="overview-header-info">
          <div className="overview-title-row">
            <h1 className="overview-title">{repository.name}</h1>
            <span className={`badge badge-${repository.visibility}`}>{repository.visibility}</span>
          </div>
          <p className="overview-description">{repository.description}</p>
          <div className="overview-topics">
            {repository.topics.map((t) => (
              <span key={t} className="topic-chip">#{t}</span>
            ))}
          </div>
          <div className="overview-clone">
            <code className="clone-url">{repository.cloneUrl}</code>
            <button className="btn btn-secondary clone-button" onClick={copyClone} aria-label="Copy clone URL">
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="overview-cta">
          <button className="btn btn-primary cta-run-agent" onClick={onRunAgent}>
            <span className="cta-spark" aria-hidden="true">✨</span>
            Run Agent Task
          </button>
          <p className="cta-hint">Dispatch an AI agent to operate on this repository</p>
        </div>
      </header>

      <div className="overview-bento">
        <div className="bento-card bento-languages">
          <h3 className="bento-title">Languages</h3>
          <LanguageBreakdown languages={repository.languages} />
        </div>

        <InsightsPanel repository={repository} />
      </div>
    </section>
  );
}
