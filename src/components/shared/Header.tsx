import { ViewState } from '../../types';
import './Header.css';

interface HeaderProps {
  view: ViewState;
  repoName?: string;
  onNavigateHome: () => void;
  onNavigateOverview?: () => void;
}

export default function Header({ view, repoName, onNavigateHome, onNavigateOverview }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-inner">
        <button className="header-brand" onClick={onNavigateHome} aria-label="Go to repository list">
          <div className="header-logo" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="header-brand-text">
            <span className="header-title">Agentic Portal</span>
            <span className="header-subtitle">AI-native developer platform</span>
          </div>
        </button>

        <nav className="header-breadcrumb" aria-label="Breadcrumb">
          <button
            className={`breadcrumb-item ${view === 'list' ? 'active' : ''}`}
            onClick={onNavigateHome}
          >
            Repositories
          </button>
          {repoName && (
            <>
              <span className="breadcrumb-separator" aria-hidden="true">/</span>
              <button
                className={`breadcrumb-item ${view === 'overview' ? 'active' : ''}`}
                onClick={onNavigateOverview}
                disabled={!onNavigateOverview || view === 'overview'}
              >
                {repoName}
              </button>
            </>
          )}
          {view === 'execution' && (
            <>
              <span className="breadcrumb-separator" aria-hidden="true">/</span>
              <span className="breadcrumb-item active">Agent Execution</span>
            </>
          )}
        </nav>

        <div className="header-actions">
          <div className="header-status">
            <span className="status-dot" aria-hidden="true"></span>
            <span>All systems operational</span>
          </div>
          <div className="header-avatar" title="Anvesh.Navvathi">AN</div>
        </div>
      </div>
    </header>
  );
}
