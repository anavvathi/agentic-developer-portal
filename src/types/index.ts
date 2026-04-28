// ============================================================
// Agentic Developer Portal — Type Definitions
// ============================================================

export type Language =
  | 'TypeScript'
  | 'Python'
  | 'Go'
  | 'Rust'
  | 'HCL'
  | 'Dart'
  | 'JavaScript'
  | 'Shell'
  | 'CSS'
  | 'HTML'
  | 'Dockerfile'
  | 'YAML';

export interface LanguageBreakdown {
  language: Language;
  percentage: number;
  color: string;
}

export interface Contributor {
  name: string;
  avatar: string;
  commits: number;
}

export interface Repository {
  id: string;
  name: string;
  description: string;
  visibility: 'public' | 'private' | 'internal';
  primaryLanguage: Language;
  languages: LanguageBreakdown[];
  stars: number;
  forks: number;
  openIssues: number;
  openPRs: number;
  lastUpdated: string;
  lastDeploy: {
    status: 'success' | 'failure' | 'pending';
    timestamp: string;
    environment: string;
  };
  healthScore: number; // 0-100
  contributors: Contributor[];
  commitActivity: number[]; // last 12 weeks
  cloneUrl: string;
  defaultBranch: string;
  topics: string[];
}

export type AgentTaskType =
  | 'create-pr'
  | 'refactor'
  | 'run-tests'
  | 'security-scan'
  | 'dependency-upgrade'
  | 'code-review';

export interface AgentTaskDefinition {
  type: AgentTaskType;
  label: string;
  description: string;
  icon: string; // emoji
  estimatedDuration: string;
  color: string;
}

export type ExecutionStatus = 'idle' | 'pending' | 'running' | 'success' | 'failure';

export interface ExecutionStep {
  id: number;
  label: string;
  status: ExecutionStatus;
  startedAt?: number;
  completedAt?: number;
}

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'SUCCESS';

export interface LogEntry {
  id: number;
  timestamp: string;
  level: LogLevel;
  message: string;
  step?: number;
}

export interface AgentExecution {
  id: string;
  taskType: AgentTaskType;
  repositoryId: string;
  status: ExecutionStatus;
  steps: ExecutionStep[];
  logs: LogEntry[];
  startedAt?: number;
  completedAt?: number;
  duration?: number;
  tokenUsage?: number;
  model?: string;
}

export type ViewState = 'list' | 'overview' | 'execution';
