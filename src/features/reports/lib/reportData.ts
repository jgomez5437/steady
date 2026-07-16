import type { Reading } from '../../tracking/types';
import { toDateInputValue } from '../../../shared/lib/dateRange';

export function isValidPatientDetails(name: string, dob: Date | null): boolean {
  return name.trim().length > 0 && dob !== null;
}

export interface ReadingsByDay {
  dayKey: string;
  timestamp: number;
  readings: Reading[];
}

export function groupReadingsByDay(readings: Reading[]): ReadingsByDay[] {
  const groups = new Map<string, Reading[]>();

  for (const r of readings) {
    const key = toDateInputValue(new Date(r.timestamp));
    const bucket = groups.get(key);
    if (bucket) {
      bucket.push(r);
    } else {
      groups.set(key, [r]);
    }
  }

  return Array.from(groups.entries())
    .map(([dayKey, dayReadings]) => {
      const sorted = [...dayReadings].sort((a, b) => a.timestamp - b.timestamp);
      const dayStart = new Date(sorted[0].timestamp);
      dayStart.setHours(0, 0, 0, 0);
      return { dayKey, timestamp: dayStart.getTime(), readings: sorted };
    })
    .sort((a, b) => a.timestamp - b.timestamp);
}

export function formatSlashDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}/${day}/${date.getFullYear()}`;
}

export interface SavedPatientProfile {
  name: string;
  dob: string;
}

export function parseStoredPatientProfile(value: unknown): SavedPatientProfile | null {
  if (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Record<string, unknown>).name === 'string' &&
    typeof (value as Record<string, unknown>).dob === 'string'
  ) {
    const { name, dob } = value as { name: string; dob: string };
    return { name, dob };
  }
  return null;
}
