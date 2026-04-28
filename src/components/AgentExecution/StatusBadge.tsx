import { ExecutionStatus } from '../../types';

interface StatusBadgeProps {
  status: ExecutionStatus;
}

const STATUS_CONFIG: Record<ExecutionStatus, { label: string; icon: string }> = {
  idle: { label: 'Idle', icon: '○' },
  pending: { label: 'Queued', icon: '◔' },
  running: { label: 'Running', icon: '◐' },
  success: { label: 'Success', icon: '✓' },
  failure: { label: 'Failed', icon: '✗' },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`status-badge status-${status}`} role="status">
      <span className="status-badge-icon" aria-hidden="true">
        {cfg.icon}
      </span>
      <span className="status-badge-label">{cfg.label}</span>
    </span>
  );
}
