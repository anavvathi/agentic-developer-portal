import { LanguageBreakdown as LB } from '../../types';

interface LanguageBreakdownProps {
  languages: LB[];
}

export default function LanguageBreakdown({ languages }: LanguageBreakdownProps) {
  return (
    <div className="lang-breakdown">
      <div className="lang-bar" role="img" aria-label="Language distribution">
        {languages.map((l) => (
          <span
            key={l.language}
            className="lang-bar-segment"
            style={{ width: `${l.percentage}%`, backgroundColor: l.color }}
            title={`${l.language}: ${l.percentage}%`}
          />
        ))}
      </div>
      <ul className="lang-legend">
        {languages.map((l) => (
          <li key={l.language} className="lang-legend-item">
            <span className="lang-legend-dot" style={{ backgroundColor: l.color }} aria-hidden="true"></span>
            <span className="lang-legend-name">{l.language}</span>
            <span className="lang-legend-percent">{l.percentage}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
