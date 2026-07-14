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
}

export function ReadingList({ readings, targets }: ReadingListProps) {
  const sorted = [...readings].sort((a, b) => b.timestamp - a.timestamp);

  if (!sorted.length) {
    return <p className="sub">Nothing logged yet today.</p>;
  }

  return (
    <ul className="reading-list">
      {sorted.map((r) => {
        const meta = MEAL_META[r.mealType];
        const status = computeStatus(r.value, targets);
        return (
          <li key={r.id}>
            <span className="reading-time">{formatTime(new Date(r.timestamp))}</span>
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
