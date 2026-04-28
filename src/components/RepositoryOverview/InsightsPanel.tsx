import { Repository } from '../../types';

interface InsightsPanelProps {
  repository: Repository;
}

export default function InsightsPanel({ repository }: InsightsPanelProps) {
  const { commitActivity, openIssues, openPRs, healthScore, contributors, lastDeploy, stars, forks } = repository;
  const maxCommit = Math.max(...commitActivity, 1);
  const totalCommits = commitActivity.reduce((s, n) => s + n, 0);
  const healthDashArray = (healthScore / 100) * 188.5; // 2*pi*30
  const healthClass =
    healthScore >= 90 ? 'health-excellent' : healthScore >= 75 ? 'health-good' : 'health-warning';

  return (
    <>
      <div className="bento-card bento-activity">
        <div className="bento-card-header">
          <h3 className="bento-title">Commit activity</h3>
          <span className="bento-subtitle">{totalCommits} commits · 12 weeks</span>
        </div>
        <div className="activity-chart" aria-label={`${totalCommits} commits over the last 12 weeks`}>
          {commitActivity.map((value, idx) => (
            <div key={idx} className="activity-bar-wrapper" title={`Week ${idx + 1}: ${value} commits`}>
              <div
                className="activity-bar"
                style={{ height: `${(value / maxCommit) * 100}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bento-card bento-health">
        <h3 className="bento-title">Health score</h3>
        <div className={`health-circle-large ${healthClass}`}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(148,163,184,0.12)" strokeWidth="8" />
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${healthDashArray * (314 / 188.5)} 314`}
              transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
          </svg>
          <div className="health-circle-content">
            <span className="health-circle-value">{healthScore}</span>
            <span className="health-circle-label">/ 100</span>
          </div>
        </div>
        <p className="health-hint">
          {healthScore >= 90 && 'Excellent — keep it up.'}
          {healthScore >= 75 && healthScore < 90 && 'Good shape, room to improve.'}
          {healthScore < 75 && 'Needs attention.'}
        </p>
      </div>

      <div className="bento-card bento-counts">
        <div className="count-item">
          <span className="count-icon" aria-hidden="true">⇄</span>
          <div>
            <div className="count-value">{openPRs}</div>
            <div className="count-label">Open PRs</div>
          </div>
        </div>
        <div className="count-divider" aria-hidden="true"></div>
        <div className="count-item">
          <span className="count-icon" aria-hidden="true">⊙</span>
          <div>
            <div className="count-value">{openIssues}</div>
            <div className="count-label">Open issues</div>
          </div>
        </div>
        <div className="count-divider" aria-hidden="true"></div>
        <div className="count-item">
          <span className="count-icon" aria-hidden="true">★</span>
          <div>
            <div className="count-value">{stars.toLocaleString()}</div>
            <div className="count-label">Stars</div>
          </div>
        </div>
        <div className="count-divider" aria-hidden="true"></div>
        <div className="count-item">
          <span className="count-icon" aria-hidden="true">⑂</span>
          <div>
            <div className="count-value">{forks}</div>
            <div className="count-label">Forks</div>
          </div>
        </div>
      </div>

      <div className="bento-card bento-contributors">
        <div className="bento-card-header">
          <h3 className="bento-title">Contributors</h3>
          <span className="bento-subtitle">{contributors.length} active</span>
        </div>
        <div className="contributor-stack">
          {contributors.slice(0, 5).map((c, i) => (
            <div
              key={c.name}
              className="contributor-avatar"
              style={{ zIndex: contributors.length - i }}
              title={`${c.name} · ${c.commits} commits`}
            >
              {c.avatar.slice(0, 2)}
            </div>
          ))}
          {contributors.length > 5 && (
            <div className="contributor-avatar contributor-more" title={`${contributors.length - 5} more`}>
              +{contributors.length - 5}
            </div>
          )}
        </div>
        <ul className="contributor-list">
          {contributors.slice(0, 3).map((c) => (
            <li key={c.name}>
              <span className="contributor-name">{c.name}</span>
              <span className="contributor-commits">{c.commits} commits</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bento-card bento-deploy">
        <h3 className="bento-title">Last deploy</h3>
        <div className={`deploy-status deploy-${lastDeploy.status}`}>
          <div className="deploy-status-icon">
            {lastDeploy.status === 'success' && '✓'}
            {lastDeploy.status === 'failure' && '✗'}
            {lastDeploy.status === 'pending' && '◐'}
          </div>
          <div>
            <div className="deploy-status-label">{lastDeploy.status}</div>
            <div className="deploy-status-meta">
              {lastDeploy.environment} · {lastDeploy.timestamp}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
