import { useEffect, useRef } from 'react';
import { LogEntry, ExecutionStatus } from '../../types';

interface StreamingLogsProps {
  logs: LogEntry[];
  status: ExecutionStatus;
}

export default function StreamingLogs({ logs, status }: StreamingLogsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !autoScrollRef.current) return;
    el.scrollTop = el.scrollHeight;
  }, [logs]);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    // re-enable auto-scroll only when user is near the bottom
    autoScrollRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
  };

  const isLive = status === 'running' || status === 'pending';

  return (
    <div className="streaming-logs">
      <div className="logs-header">
        <h3 className="bento-title">Live logs</h3>
        <div className="logs-header-meta">
          {isLive && (
            <span className="logs-live-indicator">
              <span className="logs-live-dot" aria-hidden="true"></span>
              Streaming
            </span>
          )}
          <span className="logs-count">{logs.length} entries</span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="logs-body"
        onScroll={handleScroll}
        role="log"
        aria-live="polite"
      >
        {logs.length === 0 && status === 'pending' && (
          <div className="logs-placeholder">
            <span className="logs-spinner" aria-hidden="true"></span>
            Initializing agent…
          </div>
        )}

        {logs.length === 0 && status === 'idle' && (
          <div className="logs-placeholder">No logs yet.</div>
        )}

        {logs.map((log) => (
          <div key={log.id} className={`log-line log-${log.level.toLowerCase()}`}>
            <span className="log-timestamp">{log.timestamp}</span>
            <span className="log-level-tag">{log.level}</span>
            <span className="log-message">{log.message}</span>
          </div>
        ))}

        {isLive && logs.length > 0 && (
          <div className="logs-cursor" aria-hidden="true">
            <span className="cursor-blink"></span>
          </div>
        )}
      </div>
    </div>
  );
}
