import { useState, useCallback } from 'react';
import { Repository, ViewState } from './types';
import { REPOSITORIES } from './data/mockData';
import Header from './components/shared/Header';
import RepositoryList from './components/RepositoryList/RepositoryList';
import RepositoryOverview from './components/RepositoryOverview/RepositoryOverview';
import AgentExecution from './components/AgentExecution/AgentExecution';

export default function App() {
  const [view, setView] = useState<ViewState>('list');
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  const handleSelectRepo = useCallback((repo: Repository) => {
    setSelectedRepo(repo);
    setView('overview');
  }, []);

  const handleStartExecution = useCallback(() => {
    setView('execution');
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedRepo(null);
    setView('list');
  }, []);

  const handleBackToOverview = useCallback(() => {
    setView('overview');
  }, []);

  return (
    <div className="app">
      <Header
        view={view}
        repoName={selectedRepo?.name}
        onNavigateHome={handleBackToList}
        onNavigateOverview={selectedRepo ? handleBackToOverview : undefined}
      />
      <main className="app-main">
        {view === 'list' && (
          <RepositoryList repositories={REPOSITORIES} onSelect={handleSelectRepo} />
        )}
        {view === 'overview' && selectedRepo && (
          <RepositoryOverview repository={selectedRepo} onRunAgent={handleStartExecution} />
        )}
        {view === 'execution' && selectedRepo && (
          <AgentExecution repository={selectedRepo} onBack={handleBackToOverview} />
        )}
      </main>
    </div>
  );
}
