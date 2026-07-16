import { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { getReadings, deleteReading } from './store/readingsStore';
import { getTargets } from './store/targetsStore';
import type { Reading, TargetRange } from './types';
import { ReadingList } from './components/ReadingList';
import { DateRangeFields } from '../../shared/components/DateRangeFields';
import { filterByRange, parseDateInput, isValidRange, toDateInputValue } from '../../shared/lib/dateRange';
import { yesterdayRange, pastDaysRange } from './lib/quickRanges';
import { computeSummary } from './lib/summary';
import { useRefetchOnVisible } from '../../shared/lib/useRefetchOnVisible';

const DEFAULT_TARGETS: TargetRange = { low: 70, high: 140 };
const DEFAULT_RANGE_DAYS = 13;

interface HistoryViewProps {
  onBack: () => void;
}

export function HistoryView({ onBack }: HistoryViewProps) {
  const { session } = useAuth();
  const userId = session!.user.id;

  const [readings, setReadings] = useState<Reading[]>([]);
  const [targets, setTargets] = useState<TargetRange>(DEFAULT_TARGETS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const today = new Date();
  const defaultStart = new Date(today);
  defaultStart.setDate(today.getDate() - DEFAULT_RANGE_DAYS);
  const todayInput = toDateInputValue(today);

  const [startInput, setStartInput] = useState(toDateInputValue(defaultStart));
  const [endInput, setEndInput] = useState(todayInput);

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
        if (!cancelled) setError(e instanceof Error ? e.message : 'Could not load your readings.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  useRefetchOnVisible(() => {
    Promise.all([getReadings(userId), getTargets(userId)])
      .then(([r, t]) => {
        setReadings(r);
        setTargets(t);
        setError('');
      })
      .catch((e: unknown) => {
        setError(e instanceof Error ? e.message : 'Could not load your readings.');
      });
  });

  const start = parseDateInput(startInput);
  const end = parseDateInput(endInput);
  const rangeValid = isValidRange(start, end);
  const readingsInRange = rangeValid ? filterByRange(readings, { start: start!, end: end! }) : [];
  const summary = rangeValid ? computeSummary(readingsInRange, targets) : null;

  function applyQuickRange(range: { start: string; end: string }) {
    setStartInput(range.start);
    setEndInput(range.end);
  }

  async function handleDeleteReading(id: string) {
    try {
      await deleteReading(id);
      setReadings((prev) => prev.filter((r) => r.id !== id));
      setError('');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete that reading.');
    }
  }

  return (
    <div className="card">
      <h2>Historical readings</h2>
      <p className="sub">Choose a date range to see readings from previous days.</p>

      <form className="reading-form" onSubmit={(e) => e.preventDefault()}>
        <DateRangeFields
          start={startInput}
          end={endInput}
          maxDate={todayInput}
          onStartChange={setStartInput}
          onEndChange={setEndInput}
          startId="historyStart"
          endId="historyEnd"
        />
      </form>

      <div className="chip-row">
        <button type="button" className="chip" onClick={() => applyQuickRange(yesterdayRange(today))}>
          Yesterday
        </button>
        <button type="button" className="chip" onClick={() => applyQuickRange(pastDaysRange(today, 7))}>
          Past week
        </button>
        <button type="button" className="chip" onClick={() => applyQuickRange(pastDaysRange(today, 14))}>
          Past 2 weeks
        </button>
      </div>

      <div className="error-msg" role="alert">
        {!rangeValid ? 'Choose a start date on or before the end date.' : error}
      </div>

      {summary && summary.count > 0 && (
        <p className="sub">
          <strong>{summary.average} mg/dL</strong> average across {summary.count} reading
          {summary.count === 1 ? '' : 's'} ({summary.inRangePercent}% in range).
        </p>
      )}

      {loading ? (
        <p className="sub">Loading...</p>
      ) : (
        <ReadingList
          readings={readingsInRange}
          targets={targets}
          showDate
          emptyMessage="No readings fall in this date range yet."
          onDelete={handleDeleteReading}
        />
      )}

      <div style={{ marginTop: 16 }}>
        <button type="button" className="link" onClick={onBack}>
          Back to today
        </button>
      </div>
    </div>
  );
}
