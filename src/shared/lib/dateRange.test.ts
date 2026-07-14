import { describe, it, expect } from 'vitest';
import { isWithinRange, filterByRange, parseDateInput, isValidRange, toDateInputValue } from './dateRange';

interface Item {
  id: string;
  timestamp: number;
}

function item(id: string, timestamp: number): Item {
  return { id, timestamp };
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

describe('filterByRange', () => {
  it('keeps only items inside the range and sorts them ascending', () => {
    const range = { start: new Date(2026, 0, 5), end: new Date(2026, 0, 10) };
    const items = [
      item('c', new Date(2026, 0, 8).getTime()),
      item('a', new Date(2026, 0, 1).getTime()),
      item('b', new Date(2026, 0, 6).getTime()),
    ];
    const result = filterByRange(items, range);
    expect(result.map((r) => r.id)).toEqual(['b', 'c']);
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
