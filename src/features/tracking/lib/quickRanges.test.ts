import { describe, it, expect } from 'vitest';
import { yesterdayRange, pastDaysRange } from './quickRanges';

describe('yesterdayRange', () => {
  it('returns a single-day range for the day before today', () => {
    const today = new Date(2026, 6, 15);
    expect(yesterdayRange(today)).toEqual({ start: '2026-07-14', end: '2026-07-14' });
  });

  it('rolls back across a month boundary', () => {
    const today = new Date(2026, 6, 1);
    expect(yesterdayRange(today)).toEqual({ start: '2026-06-30', end: '2026-06-30' });
  });
});

describe('pastDaysRange', () => {
  it('starts exactly 7 days back (same weekday as today) for a week', () => {
    const today = new Date(2026, 6, 15);
    expect(pastDaysRange(today, 7)).toEqual({ start: '2026-07-08', end: '2026-07-15' });
  });

  it('starts exactly 14 days back (same weekday as today) for two weeks', () => {
    const today = new Date(2026, 6, 15);
    expect(pastDaysRange(today, 14)).toEqual({ start: '2026-07-01', end: '2026-07-15' });
  });

  it('rolls back across a year boundary', () => {
    const today = new Date(2026, 0, 3);
    expect(pastDaysRange(today, 7)).toEqual({ start: '2025-12-27', end: '2026-01-03' });
  });
});
