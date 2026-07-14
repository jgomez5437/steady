import { lazy, Suspense, useState } from 'react';
import { Tabs, type TabKey } from './shared/components/Tabs';
import { TrackView } from './features/tracking/TrackView';
import { RecipesView } from './features/recipes/RecipesView';
import { AuthProvider, useAuth } from './features/auth/AuthProvider';
import { AuthForm } from './features/auth/components/AuthForm';
import { supabase } from './shared/api/supabaseClient';

// Lazy-loaded: pulls in jsPDF, which is heavy and only needed once someone opens this tab.
const ReportsView = lazy(() =>
  import('./features/reports/ReportsView').then((m) => ({ default: m.ReportsView })),
);

function Brand() {
  return (
    <div className="brand">
      <h1>Steady</h1>
      <span>track your glucose with clarity</span>
    </div>
  );
}

function AppShell() {
  const [tab, setTab] = useState<TabKey>('track');
  const [reportsVisited, setReportsVisited] = useState(false);
  const [reportsRefreshSignal, setReportsRefreshSignal] = useState(0);
  const { session, loading } = useAuth();

  function handleTabChange(next: TabKey) {
    setTab(next);
    if (next === 'reports') {
      setReportsVisited(true);
      setReportsRefreshSignal((count) => count + 1);
    }
  }

  if (loading) {
    return (
      <div className="wrap">
        <header className="top">
          <Brand />
        </header>
        <p className="sub">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="wrap">
        <header className="top">
          <Brand />
        </header>
        <AuthForm />
      </div>
    );
  }

  return (
    <div className="wrap">
      <header className="top">
        <Brand />
        <Tabs active={tab} onChange={handleTabChange} />
      </header>

      <div className="account-bar">
        <span>{session.user.email}</span>
        <button type="button" className="link" onClick={() => supabase.auth.signOut()}>
          Sign out
        </button>
      </div>

      <section id="view-track" className={`view ${tab === 'track' ? 'active' : ''}`}>
        <TrackView />
      </section>

      <section id="view-recipes" className={`view ${tab === 'recipes' ? 'active' : ''}`}>
        <RecipesView />
      </section>

      <section id="view-reports" className={`view ${tab === 'reports' ? 'active' : ''}`}>
        {reportsVisited && (
          <Suspense fallback={<div className="card"><p className="sub">Loading...</p></div>}>
            <ReportsView refreshSignal={reportsRefreshSignal} />
          </Suspense>
        )}
      </section>

      <footer>
        Steady stores your data securely in Supabase, tied to your account.
        <br />
        Reference ranges shown are general guidelines only, not medical advice.
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;
