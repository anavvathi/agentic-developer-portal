import { Repository } from '../../types';

interface RepositoryCardProps {
  repository: Repository;
  onClick: () => void;
}

export default function RepositoryCard({ repository, onClick }: RepositoryCardProps) {
  const { name, description, primaryLanguage, languages, stars, openPRs, openIssues, lastUpdated, visibility, healthScore, lastDeploy } = repository;
  const langColor = languages.find((l) => l.language === primaryLanguage)?.color ?? '#888';

  const healthClass =
    healthScore >= 90 ? 'health-excellent' : healthScore >= 75 ? 'health-good' : 'health-warning';

  const deployClass = `deploy-${lastDeploy.status}`;

  return (
    <button
      className="repo-card"
      onClick={onClick}
      aria-label={`Open ${name}`}
    >
      <div className="repo-card-top">
        <div className="repo-card-name-block">
          <h3 className="repo-card-name">{name}</h3>
          <span className={`badge badge-${visibility}`}>{visibility}</span>
        </div>
        <div className={`health-ring ${healthClass}`} aria-label={`Health score ${healthScore}`}>
          <svg width="44" height="44" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(148,163,184,0.15)" strokeWidth="3" />
            <circle
              cx="22"
              cy="22"
              r="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${(healthScore / 100) * 113} 113`}
              strokeLinecap="round"
              transform="rotate(-90 22 22)"
            />
          </svg>
          <span className="health-value">{healthScore}</span>
        </div>
      </div>

      <p className="repo-card-description">{description}</p>

      <div className="repo-card-language-bar" aria-hidden="true">
        {languages.map((l) => (
          <span
            key={l.language}
            className="repo-card-language-segment"
            style={{ width: `${l.percentage}%`, backgroundColor: l.color }}
            title={`${l.language} ${l.percentage}%`}
          />
        ))}
      </div>

      <div className="repo-card-meta">
        <span className="repo-card-meta-item">
          <span className="lang-dot" style={{ backgroundColor: langColor }} aria-hidden="true"></span>
          {primaryLanguage}
        </span>
        <span className="repo-card-meta-item" title="Stars">
          ★ {stars.toLocaleString()}
        </span>
        <span className="repo-card-meta-item" title="Open PRs">
          ⇄ {openPRs}
        </span>
        <span className="repo-card-meta-item" title="Open Issues">
          ⊙ {openIssues}
        </span>
      </div>

      <div className="repo-card-footer">
        <span className={`deploy-pill ${deployClass}`}>
          <span className="deploy-dot" aria-hidden="true"></span>
          {lastDeploy.status} · {lastDeploy.environment}
        </span>
        <span className="repo-card-updated">Updated {lastUpdated}</span>
      </div>
    </button>
  );
}
