import { useEffect, useState } from 'react';
import { TideChart } from './components/TideChart';
import { ReadingForm } from './components/ReadingForm';
import { ReadingList } from './components/ReadingList';
import { TargetRangeEditor } from './components/TargetRangeEditor';
import { HistoryView } from './HistoryView';
import { getReadings, addReading } from './store/readingsStore';
import { getTargets, saveTargets } from './store/targetsStore';
import { isSameDay } from './lib/dateUtils';
import type { Reading, TargetRange } from './types';
import { useAuth } from '../auth/AuthProvider';

const DEFAULT_TARGETS: TargetRange = { low: 70, high: 140 };

export function TrackView() {
  const { session } = useAuth();
  const userId = session!.user.id;

  const [readings, setReadings] = useState<Reading[]>([]);
  const [targets, setTargets] = useState<TargetRange>(DEFAULT_TARGETS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const now = new Date();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([getReadings(userId), getTargets(userId)])
      .then(([r, t]) => {
        if (cancelled) return;
        setReadings(r);
        setTargets(t);
        setError('');
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load your data.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const readingsToday = readings.filter((r) => isSameDay(r.timestamp, now));

  async function handleAddReading(value: number, mealType: Reading['mealType']) {
    try {
      const created = await addReading(userId, { value, mealType, timestamp: Date.now() });
      setReadings((prev) => [...prev, created]);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save that reading.');
    }
  }

  async function handleSaveTargets(next: TargetRange) {
    try {
      await saveTargets(userId, next);
      setTargets(next);
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save the target range.');
    }
  }

  if (loading) {
    return (
      <div className="card">
        <p className="sub">Loading your readings...</p>
      </div>
    );
  }

  if (showHistory) {
    return <HistoryView onBack={() => setShowHistory(false)} />;
  }

  return (
    <>
      {error && <div className="banner" role="status">{error}</div>}

      <div className="card">
        <h2>Today, {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h2>
        <p className="sub">Readings reset here each day. Everything you log stays saved underneath.</p>
        <TideChart readings={readingsToday} targets={targets} />
        <div className="legend">
          <span><span className="dot" style={{ background: '#3E7C74' }} />Fasting</span>
          <span><span className="dot" style={{ background: '#C9A66B' }} />Breakfast</span>
          <span><span className="dot" style={{ background: '#7C8CC4' }} />Lunch</span>
          <span><span className="dot" style={{ background: '#9B6B8C' }} />Dinner</span>
          <span>
            <span className="dot" style={{ background: '#3E7C74', opacity: 0.35 }} />
            Target {targets.low} to {targets.high} mg/dL
          </span>
        </div>
      </div>

      <div className="card">
        <h2>Log a reading</h2>
        <p className="sub">The day and time are captured automatically.</p>
        <ReadingForm onSubmit={handleAddReading} />
        <TargetRangeEditor targets={targets} onSave={handleSaveTargets} />
      </div>

      <div className="card">
        <h2>Today's readings</h2>
        <ReadingList readings={readingsToday} targets={targets} />
        <div style={{ marginTop: 16 }}>
          <button type="button" className="link" onClick={() => setShowHistory(true)}>
            View historical readings
          </button>
        </div>
      </div>
    </>
  );
}
