import { useEffect } from 'react';
import { AgentTaskDefinition, ExecutionStatus, Repository } from '../../types';

interface DetailsModalProps {
  open: boolean;
  onClose: () => void;
  task: AgentTaskDefinition;
  repository: Repository;
  status: ExecutionStatus;
  duration: number;
  tokenUsage: number;
  logCount: number;
  stepCount: number;
}

export default function DetailsModal({
  open,
  onClose,
  task,
  repository,
  status,
  duration,
  tokenUsage,
  logCount,
  stepCount,
}: DetailsModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const executionId = `exec_${task.type}_${Date.now().toString(36).slice(-6)}`;
  const formattedDuration = `${Math.floor(duration / 60)}m ${duration % 60}s`;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h2 id="details-title" className="modal-title">Execution details</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close details">×</button>
        </header>

        <div className="modal-body">
          <dl className="details-list">
            <div className="details-row">
              <dt>Execution ID</dt>
              <dd className="mono">{executionId}</dd>
            </div>
            <div className="details-row">
              <dt>Task</dt>
              <dd>{task.icon} {task.label}</dd>
            </div>
            <div className="details-row">
              <dt>Repository</dt>
              <dd className="mono">{repository.name}</dd>
            </div>
            <div className="details-row">
              <dt>Branch</dt>
              <dd className="mono">{repository.defaultBranch}</dd>
            </div>
            <div className="details-row">
              <dt>Status</dt>
              <dd className={`details-status status-${status}`}>{status}</dd>
            </div>
            <div className="details-row">
              <dt>Model</dt>
              <dd className="mono">claude-opus-4-7</dd>
            </div>
            <div className="details-row">
              <dt>Duration</dt>
              <dd>{formattedDuration}</dd>
            </div>
            <div className="details-row">
              <dt>Tokens used</dt>
              <dd>{tokenUsage.toLocaleString()}</dd>
            </div>
            <div className="details-row">
              <dt>Reasoning steps</dt>
              <dd>{stepCount}</dd>
            </div>
            <div className="details-row">
              <dt>Log entries</dt>
              <dd>{logCount}</dd>
            </div>
            <div className="details-row">
              <dt>Estimated cost</dt>
              <dd>${(tokenUsage * 0.000015).toFixed(4)}</dd>
            </div>
          </dl>

          <div className="details-section">
            <h3 className="details-section-title">Configuration</h3>
            <pre className="details-code">{`{
  "agent": "${task.type}",
  "repository": "${repository.name}",
  "branch": "${repository.defaultBranch}",
  "max_iterations": 12,
  "tools": ["read", "write", "shell", "search"],
  "temperature": 0.2
}`}</pre>
          </div>
        </div>

        <footer className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </footer>
      </div>
    </div>
  );
}
