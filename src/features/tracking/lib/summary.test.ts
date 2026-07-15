import { describe, it, expect } from 'vitest';
import { computeSummary } from './summary';
import type { Reading } from '../types';

const targets = { low: 70, high: 140 };

function reading(id: string, value: number, timestamp: number): Reading {
  return { id, value, mealType: 'fasting', timestamp };
}

describe('computeSummary', () => {
  it('returns a zeroed summary for no readings', () => {
    expect(computeSummary([], targets)).toEqual({
      count: 0,
      average: null,
      lowCount: 0,
      highCount: 0,
      inRangeCount: 0,
      inRangePercent: null,
    });
  });

  it('averages values and buckets by status', () => {
    const readings = [
      reading('a', 60, 1),
      reading('b', 100, 2),
      reading('c', 150, 3),
      reading('d', 120, 4),
    ];
    const summary = computeSummary(readings, targets);
    expect(summary.count).toBe(4);
    expect(summary.average).toBe(107.5);
    expect(summary.lowCount).toBe(1);
    expect(summary.highCount).toBe(1);
    expect(summary.inRangeCount).toBe(2);
    expect(summary.inRangePercent).toBe(50);
  });
});
