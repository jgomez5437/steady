import { useState } from 'react';
import type { Reading, TargetRange } from '../types';
import { formatTime } from '../lib/dateUtils';
import { computeStatus } from '../lib/glucoseStatus';
import { ConfirmDialog } from '../../../shared/components/ConfirmDialog';

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
  onDelete?: (id: string) => void;
}

export function ReadingList({
  readings,
  targets,
  emptyMessage = 'Nothing logged yet today.',
  showDate = false,
  onDelete,
}: ReadingListProps) {
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const sorted = [...readings].sort((a, b) => b.timestamp - a.timestamp);
  const pendingReading = sorted.find((r) => r.id === pendingDeleteId) ?? null;

  if (!sorted.length) {
    return <p className="sub">{emptyMessage}</p>;
  }

  return (
    <>
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
              {onDelete && (
                <button
                  type="button"
                  className="reading-delete"
                  aria-label={`Delete ${r.value} mg/dL reading`}
                  onClick={() => setPendingDeleteId(r.id)}
                >
                  &times;
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {onDelete && (
        <ConfirmDialog
          open={pendingReading !== null}
          title="Delete this reading?"
          message={
            pendingReading
              ? `Remove the ${pendingReading.value} mg/dL reading from ${formatTime(new Date(pendingReading.timestamp))}? This can't be undone.`
              : ''
          }
          onConfirm={() => {
            if (pendingReading) onDelete(pendingReading.id);
            setPendingDeleteId(null);
          }}
          onCancel={() => setPendingDeleteId(null)}
        />
      )}
    </>
  );
}
