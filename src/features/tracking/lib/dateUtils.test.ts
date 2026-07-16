import { describe, it, expect } from 'vitest';
import { isSameDay, formatTime, formatCompactTime } from './dateUtils';

describe('isSameDay', () => {
  it('returns true for timestamps on the same calendar day', () => {
    const reference = new Date(2026, 5, 15, 8, 0);
    const timestamp = new Date(2026, 5, 15, 22, 30).getTime();
    expect(isSameDay(timestamp, reference)).toBe(true);
  });

  it('returns false for timestamps on a different day', () => {
    const reference = new Date(2026, 5, 15, 8, 0);
    const timestamp = new Date(2026, 5, 14, 23, 59).getTime();
    expect(isSameDay(timestamp, reference)).toBe(false);
  });

  it('returns false across month boundaries even if the day-of-month matches', () => {
    const reference = new Date(2026, 5, 15);
    const timestamp = new Date(2026, 6, 15).getTime();
    expect(isSameDay(timestamp, reference)).toBe(false);
  });
});

describe('formatTime', () => {
  it('formats a time as a 12-hour clock string', () => {
    const date = new Date(2026, 0, 1, 9, 5);
    expect(formatTime(date)).toMatch(/^\d{1,2}:\d{2}\s?[AP]M$/i);
  });
});

describe('formatCompactTime', () => {
  it('omits minutes when exactly on the hour', () => {
    const date = new Date(2026, 0, 1, 8, 0);
    expect(formatCompactTime(date)).toMatch(/^8\s?AM$/i);
  });

  it('includes minutes when not on the hour', () => {
    const date = new Date(2026, 0, 1, 9, 4);
    expect(formatCompactTime(date)).toMatch(/^9:04\s?AM$/i);
  });
});
