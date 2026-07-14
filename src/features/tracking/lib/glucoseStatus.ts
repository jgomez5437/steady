import type { GlucoseStatus, TargetRange } from '../types';

export function computeStatus(value: number, targets: TargetRange): GlucoseStatus {
  if (value < targets.low) return { label: 'Low', color: 'var(--low-soft)' };
  if (value > targets.high) return { label: 'High', color: 'var(--high-soft)' };
  return { label: 'In range', color: 'var(--teal)' };
}
