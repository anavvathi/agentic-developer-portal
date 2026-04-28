import { AgentTaskDefinition, AgentTaskType } from '../../types';

interface TaskSelectorProps {
  tasks: AgentTaskDefinition[];
  repositoryName: string;
  onSelect: (type: AgentTaskType) => void;
}

export default function TaskSelector({ tasks, repositoryName, onSelect }: TaskSelectorProps) {
  return (
    <div className="task-selector">
      <header className="task-selector-header">
        <h2 className="task-selector-title">
          Choose an <span className="gradient-text">agent task</span>
        </h2>
        <p className="task-selector-subtitle">
          Dispatch an autonomous AI agent to operate on <strong>{repositoryName}</strong>.
          Each task runs with full visibility into reasoning steps and live logs.
        </p>
      </header>

      <div className="task-grid">
        {tasks.map((task) => (
          <button
            key={task.type}
            className="task-card"
            onClick={() => onSelect(task.type)}
            style={{ '--task-color': task.color } as React.CSSProperties}
            aria-label={`Run ${task.label}`}
          >
            <div className="task-card-icon" aria-hidden="true">
              {task.icon}
            </div>
            <div className="task-card-body">
              <h3 className="task-card-label">{task.label}</h3>
              <p className="task-card-description">{task.description}</p>
            </div>
            <div className="task-card-footer">
              <span className="task-card-duration">⏱ {task.estimatedDuration}</span>
              <span className="task-card-cta">Run agent →</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
