import { useState, useCallback } from 'react';
import { Repository, AgentTaskType, AgentTaskDefinition } from '../../types';
import { AGENT_TASKS } from '../../data/mockData';
import { useAgentExecution } from '../../hooks/useAgentExecution';
import TaskSelector from './TaskSelector';
import StreamingLogs from './StreamingLogs';
import StatusBadge from './StatusBadge';
import DetailsModal from './DetailsModal';
import './AgentExecution.css';

interface AgentExecutionProps {
  repository: Repository;
  onBack: () => void;
}

export default function AgentExecution({ repository, onBack }: AgentExecutionProps) {
  const [selectorOpen, setSelectorOpen] = useState(true);
  const [activeTask, setActiveTask] = useState<AgentTaskDefinition | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { status, logs, steps, duration, tokenUsage, startExecution, retryExecution, resetExecution } =
    useAgentExecution();

  const handleSelectTask = useCallback(
    (taskType: AgentTaskType) => {
      const task = AGENT_TASKS.find((t) => t.type === taskType) || null;
      setActiveTask(task);
      setSelectorOpen(false);
      startExecution(taskType);
    },
    [startExecution]
  );

  const handleSwitchTask = () => {
    resetExecution();
    setActiveTask(null);
    setSelectorOpen(true);
  };

  const formatDuration = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className="agent-execution">
      <div className="execution-topbar">
        <button className="btn btn-ghost" onClick={onBack} aria-label="Back to repository overview">
          ← Back to {repository.name}
        </button>
      </div>

      {selectorOpen ? (
        <TaskSelector
          tasks={AGENT_TASKS}
          repositoryName={repository.name}
          onSelect={handleSelectTask}
        />
      ) : (
        activeTask && (
          <div className="execution-grid">
            <header className="execution-header">
              <div className="execution-header-left">
                <div
                  className="execution-task-icon"
                  style={{
                    background: `linear-gradient(135deg, ${activeTask.color} 0%, ${activeTask.color}80 100%)`,
                  }}
                  aria-hidden="true"
                >
                  {activeTask.icon}
                </div>
                <div>
                  <h2 className="execution-task-title">{activeTask.label}</h2>
                  <p className="execution-task-sub">
                    on <strong>{repository.name}</strong> · {activeTask.estimatedDuration}
                  </p>
                </div>
              </div>
              <div className="execution-header-right">
                <StatusBadge status={status} />
                <button className="btn btn-secondary" onClick={() => setDetailsOpen(true)}>
                  Details
                </button>
                <button className="btn btn-ghost" onClick={handleSwitchTask}>
                  Switch task
                </button>
              </div>
            </header>

            <aside className="execution-side">
              <div className="execution-meta">
                <div className="meta-item">
                  <span className="meta-label">Duration</span>
                  <span className="meta-value">{formatDuration(duration)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Tokens</span>
                  <span className="meta-value">{tokenUsage.toLocaleString()}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Logs</span>
                  <span className="meta-value">{logs.length}</span>
                </div>
              </div>

              <div className="execution-steps">
                <h3 className="bento-title">Reasoning steps</h3>
                <ol className="step-list">
                  {steps.map((step) => (
                    <li key={step.id} className={`step-item step-${step.status}`}>
                      <span className="step-indicator" aria-hidden="true">
                        {step.status === 'success' && '✓'}
                        {step.status === 'failure' && '✗'}
                        {step.status === 'running' && <span className="step-spinner"></span>}
                        {step.status === 'pending' && step.id + 1}
                      </span>
                      <span className="step-label">{step.label}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {status === 'failure' && (
                <div className="failure-actions">
                  <button className="btn btn-primary" onClick={retryExecution}>
                    ↻ Retry execution
                  </button>
                  <p className="failure-hint">
                    Agent reported a failure. Review logs above for diagnosis, then retry.
                  </p>
                </div>
              )}

              {status === 'success' && (
                <div className="success-banner">
                  <div className="success-icon" aria-hidden="true">✓</div>
                  <div>
                    <div className="success-title">Task complete</div>
                    <div className="success-meta">
                      Finished in {formatDuration(duration)} · {tokenUsage.toLocaleString()} tokens
                    </div>
                  </div>
                </div>
              )}
            </aside>

            <div className="execution-logs-panel">
              <StreamingLogs logs={logs} status={status} />
            </div>
          </div>
        )
      )}

      {activeTask && (
        <DetailsModal
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          task={activeTask}
          repository={repository}
          status={status}
          duration={duration}
          tokenUsage={tokenUsage}
          logCount={logs.length}
          stepCount={steps.length}
        />
      )}
    </section>
  );
}
