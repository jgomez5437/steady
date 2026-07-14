import type { Reading, TargetRange } from '../types';
import { formatTime } from '../lib/dateUtils';
import { computeStatus } from '../lib/glucoseStatus';

const MEAL_META: Record<Reading['mealType'], { label: string; color: string }> = {
  fasting: { label: 'Fasting', color: '#3E7C74' },
  breakfast: { label: 'Breakfast', color: '#C9A66B' },
  lunch: { label: 'Lunch', color: '#7C8CC4' },
  dinner: { label: 'Dinner', color: '#9B6B8C' },
};

interface ReadingListProps {
  readings: Reading[];
  targets: TargetRange;
  emptyMessage?: string;
  showDate?: boolean;
}

export function ReadingList({
  readings,
  targets,
  emptyMessage = 'Nothing logged yet today.',
  showDate = false,
}: ReadingListProps) {
  const sorted = [...readings].sort((a, b) => b.timestamp - a.timestamp);

  if (!sorted.length) {
    return <p className="sub">{emptyMessage}</p>;
  }

  return (
    <ul className="reading-list">
      {sorted.map((r) => {
        const meta = MEAL_META[r.mealType];
        const status = computeStatus(r.value, targets);
        const timestamp = new Date(r.timestamp);
        return (
          <li key={r.id}>
            <span className="reading-time">
              {showDate && `${timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · `}
              {formatTime(timestamp)}
            </span>
            <span className="meal-pill">
              <span className="dot" style={{ background: meta.color }} />
              {meta.label}
            </span>
            <span className="reading-value">{r.value} mg/dL</span>
            <span className="status-tag" style={{ background: status.color }}>{status.label}</span>
          </li>
        );
      })}
    </ul>
  );
}
