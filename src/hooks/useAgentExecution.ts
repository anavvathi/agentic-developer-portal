import { useState, useEffect, useCallback, useRef } from 'react';
import { LogEntry, LogLevel, ExecutionStatus, ExecutionStep, AgentTaskType } from '../types';
import { TASK_LOG_SEQUENCES } from '../data/mockData';

interface UseAgentExecutionReturn {
  status: ExecutionStatus;
  logs: LogEntry[];
  steps: ExecutionStep[];
  duration: number;
  tokenUsage: number;
  startExecution: (taskType: AgentTaskType) => void;
  retryExecution: () => void;
  resetExecution: () => void;
}

const STEP_DEFINITIONS: Record<AgentTaskType, string[]> = {
  'create-pr': ['Initialize', 'Analyze Repository', 'Generate Changes', 'Create Branch', 'Push & Create PR'],
  'refactor': ['Initialize', 'Scan Codebase', 'Identify Candidates', 'Apply Refactoring', 'Verify Tests'],
  'run-tests': ['Initialize', 'Collect Suites', 'Run Unit Tests', 'Run Integration Tests', 'Generate Report'],
  'security-scan': ['Initialize', 'Dependency Scan', 'Static Analysis', 'Secrets Detection', 'Generate Report'],
  'dependency-upgrade': ['Initialize', 'Analyze Manifest', 'Check Upgrades', 'Apply Upgrades', 'Verify Tests'],
  'code-review': ['Initialize', 'Fetch PR Diff', 'Analyze Quality', 'Check Coverage', 'Post Review'],
};

export function useAgentExecution(): UseAgentExecutionReturn {
  const [status, setStatus] = useState<ExecutionStatus>('idle');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [steps, setSteps] = useState<ExecutionStep[]>([]);
  const [duration, setDuration] = useState(0);
  const [tokenUsage, setTokenUsage] = useState(0);
  const [currentTaskType, setCurrentTaskType] = useState<AgentTaskType | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const durationRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const logIndexRef = useRef(0);
  const startTimeRef = useRef(0);

  const cleanup = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (durationRef.current) clearInterval(durationRef.current);
    intervalRef.current = null;
    durationRef.current = null;
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const runExecution = useCallback((taskType: AgentTaskType) => {
    cleanup();
    const logSequence = TASK_LOG_SEQUENCES[taskType] || [];
    const stepDefs = STEP_DEFINITIONS[taskType] || [];
    const shouldFail = taskType === 'security-scan';

    logIndexRef.current = 0;
    startTimeRef.current = Date.now();

    const initialSteps: ExecutionStep[] = stepDefs.map((label, i) => ({
      id: i,
      label,
      status: i === 0 ? 'running' : 'pending',
    }));

    setLogs([]);
    setSteps(initialSteps);
    setDuration(0);
    setTokenUsage(0);
    setStatus('pending');

    setTimeout(() => {
      setStatus('running');

      durationRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);

      intervalRef.current = setInterval(() => {
        const idx = logIndexRef.current;

        if (idx >= logSequence.length) {
          cleanup();
          setSteps((prev) =>
            prev.map((s) => ({
              ...s,
              status: 'success' as ExecutionStatus,
              completedAt: Date.now(),
            }))
          );
          setStatus(shouldFail ? 'failure' : 'success');
          return;
        }

        const logItem = logSequence[idx];
        const newLog: LogEntry = {
          id: idx,
          timestamp: new Date().toISOString().split('T')[1].split('.')[0],
          level: logItem.level as LogLevel,
          message: logItem.message,
          step: Math.min(Math.floor((idx / logSequence.length) * stepDefs.length), stepDefs.length - 1),
        };

        setLogs((prev) => [...prev, newLog]);
        setTokenUsage((prev) => prev + Math.floor(Math.random() * 200 + 50));

        const currentStepIdx = newLog.step ?? 0;
        setSteps((prev) =>
          prev.map((s, i) => {
            if (i < currentStepIdx) return { ...s, status: 'success' as ExecutionStatus, completedAt: Date.now() };
            if (i === currentStepIdx) return { ...s, status: 'running' as ExecutionStatus, startedAt: Date.now() };
            return s;
          })
        );

        logIndexRef.current += 1;
      }, Math.random() * 400 + 200);
    }, 1500);
  }, [cleanup]);

  const startExecution = useCallback(
    (taskType: AgentTaskType) => {
      setCurrentTaskType(taskType);
      runExecution(taskType);
    },
    [runExecution]
  );

  const retryExecution = useCallback(() => {
    if (currentTaskType) {
      runExecution(currentTaskType);
    }
  }, [currentTaskType, runExecution]);

  const resetExecution = useCallback(() => {
    cleanup();
    setStatus('idle');
    setLogs([]);
    setSteps([]);
    setDuration(0);
    setTokenUsage(0);
    setCurrentTaskType(null);
  }, [cleanup]);

  return {
    status,
    logs,
    steps,
    duration,
    tokenUsage,
    startExecution,
    retryExecution,
    resetExecution,
  };
}
