import type { Reading, TargetRange } from '../../tracking/types';
import { computeStatus } from '../../tracking/lib/glucoseStatus';

export interface DateRange {
  start: Date;
  end: Date;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function isWithinRange(timestamp: number, range: DateRange): boolean {
  return timestamp >= startOfDay(range.start).getTime() && timestamp <= endOfDay(range.end).getTime();
}

export function filterReadingsByRange(readings: Reading[], range: DateRange): Reading[] {
  return readings.filter((r) => isWithinRange(r.timestamp, range)).sort((a, b) => a.timestamp - b.timestamp);
}

export interface ReportSummary {
  count: number;
  average: number | null;
  lowCount: number;
  highCount: number;
  inRangeCount: number;
  inRangePercent: number | null;
}

export function computeSummary(readings: Reading[], targets: TargetRange): ReportSummary {
  if (!readings.length) {
    return { count: 0, average: null, lowCount: 0, highCount: 0, inRangeCount: 0, inRangePercent: null };
  }

  let sum = 0;
  let lowCount = 0;
  let highCount = 0;
  let inRangeCount = 0;

  for (const r of readings) {
    sum += r.value;
    const label = computeStatus(r.value, targets).label;
    if (label === 'Low') lowCount++;
    else if (label === 'High') highCount++;
    else inRangeCount++;
  }

  return {
    count: readings.length,
    average: Math.round((sum / readings.length) * 10) / 10,
    lowCount,
    highCount,
    inRangeCount,
    inRangePercent: Math.round((inRangeCount / readings.length) * 1000) / 10,
  };
}

export function parseDateInput(value: string): Date | null {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function isValidRange(start: Date | null, end: Date | null): boolean {
  return start !== null && end !== null && start.getTime() <= end.getTime();
}

export function isValidPatientDetails(name: string, dob: Date | null): boolean {
  return name.trim().length > 0 && dob !== null;
}

export function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
