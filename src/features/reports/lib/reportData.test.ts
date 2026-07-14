import { describe, it, expect } from 'vitest';
import {
  isWithinRange,
  filterReadingsByRange,
  computeSummary,
  parseDateInput,
  isValidRange,
  toDateInputValue,
} from './reportData';
import type { Reading } from '../../tracking/types';

const targets = { low: 70, high: 140 };

function reading(id: string, value: number, timestamp: number): Reading {
  return { id, value, mealType: 'fasting', timestamp };
}

describe('isWithinRange', () => {
  const range = { start: new Date(2026, 0, 5), end: new Date(2026, 0, 10) };

  it('includes a timestamp inside the range', () => {
    expect(isWithinRange(new Date(2026, 0, 7, 12).getTime(), range)).toBe(true);
  });

  it('includes the exact start and end days', () => {
    expect(isWithinRange(new Date(2026, 0, 5, 0, 0).getTime(), range)).toBe(true);
    expect(isWithinRange(new Date(2026, 0, 10, 23, 59).getTime(), range)).toBe(true);
  });

  it('excludes a timestamp before the range', () => {
    expect(isWithinRange(new Date(2026, 0, 4, 23, 59).getTime(), range)).toBe(false);
  });

  it('excludes a timestamp after the range', () => {
    expect(isWithinRange(new Date(2026, 0, 11, 0, 1).getTime(), range)).toBe(false);
  });
});

describe('filterReadingsByRange', () => {
  it('keeps only readings inside the range and sorts them ascending', () => {
    const range = { start: new Date(2026, 0, 5), end: new Date(2026, 0, 10) };
    const readings = [
      reading('c', 100, new Date(2026, 0, 8).getTime()),
      reading('a', 90, new Date(2026, 0, 1).getTime()),
      reading('b', 110, new Date(2026, 0, 6).getTime()),
    ];
    const result = filterReadingsByRange(readings, range);
    expect(result.map((r) => r.id)).toEqual(['b', 'c']);
  });
});

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

describe('parseDateInput', () => {
  it('parses a valid yyyy-mm-dd string', () => {
    const d = parseDateInput('2026-01-15');
    expect(d?.getFullYear()).toBe(2026);
    expect(d?.getMonth()).toBe(0);
    expect(d?.getDate()).toBe(15);
  });

  it('returns null for an empty string', () => {
    expect(parseDateInput('')).toBeNull();
  });

  it('returns null for an unparseable string', () => {
    expect(parseDateInput('not-a-date')).toBeNull();
  });
});

describe('isValidRange', () => {
  it('accepts a start on or before the end', () => {
    expect(isValidRange(new Date(2026, 0, 1), new Date(2026, 0, 5))).toBe(true);
    expect(isValidRange(new Date(2026, 0, 1), new Date(2026, 0, 1))).toBe(true);
  });

  it('rejects a start after the end', () => {
    expect(isValidRange(new Date(2026, 0, 5), new Date(2026, 0, 1))).toBe(false);
  });

  it('rejects missing dates', () => {
    expect(isValidRange(null, new Date())).toBe(false);
    expect(isValidRange(new Date(), null)).toBe(false);
  });
});

describe('toDateInputValue', () => {
  it('formats a date as yyyy-mm-dd', () => {
    expect(toDateInputValue(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('pads single-digit months and days', () => {
    expect(toDateInputValue(new Date(2026, 8, 9))).toBe('2026-09-09');
  });
});
