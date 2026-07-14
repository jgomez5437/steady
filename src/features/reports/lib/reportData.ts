import type { Reading, TargetRange } from '../../tracking/types';
import { computeStatus } from '../../tracking/lib/glucoseStatus';

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

export function isValidPatientDetails(name: string, dob: Date | null): boolean {
  return name.trim().length > 0 && dob !== null;
}
