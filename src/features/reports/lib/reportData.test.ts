import { describe, it, expect } from 'vitest';
import { isValidPatientDetails, parseStoredPatientProfile, groupReadingsByDay, formatSlashDate } from './reportData';
import type { Reading } from '../../tracking/types';

function reading(id: string, value: number, timestamp: number, mealType: Reading['mealType'] = 'fasting'): Reading {
  return { id, value, mealType, timestamp };
}

describe('isValidPatientDetails', () => {
  it('accepts a non-empty name with a parsed dob', () => {
    expect(isValidPatientDetails('Jamie Rivera', new Date(1990, 0, 1))).toBe(true);
  });

  it('rejects a blank or whitespace-only name', () => {
    expect(isValidPatientDetails('', new Date(1990, 0, 1))).toBe(false);
    expect(isValidPatientDetails('   ', new Date(1990, 0, 1))).toBe(false);
  });

  it('rejects a missing dob', () => {
    expect(isValidPatientDetails('Jamie Rivera', null)).toBe(false);
  });
});

describe('parseStoredPatientProfile', () => {
  it('accepts a well-formed profile object', () => {
    expect(parseStoredPatientProfile({ name: 'Jamie Rivera', dob: '1990-01-01' })).toEqual({
      name: 'Jamie Rivera',
      dob: '1990-01-01',
    });
  });

  it('rejects null', () => {
    expect(parseStoredPatientProfile(null)).toBeNull();
  });

  it('rejects non-object values', () => {
    expect(parseStoredPatientProfile('not an object')).toBeNull();
    expect(parseStoredPatientProfile(42)).toBeNull();
    expect(parseStoredPatientProfile(undefined)).toBeNull();
  });

  it('rejects an object missing name or dob', () => {
    expect(parseStoredPatientProfile({ name: 'Jamie Rivera' })).toBeNull();
    expect(parseStoredPatientProfile({ dob: '1990-01-01' })).toBeNull();
  });

  it('rejects an object with mistyped fields', () => {
    expect(parseStoredPatientProfile({ name: 42, dob: '1990-01-01' })).toBeNull();
    expect(parseStoredPatientProfile({ name: 'Jamie Rivera', dob: 1990 })).toBeNull();
  });
});

describe('groupReadingsByDay', () => {
  it('groups readings that fall on the same calendar day', () => {
    const day1 = [
      reading('a', 86, new Date(2026, 6, 15, 8, 0).getTime(), 'fasting'),
      reading('b', 98, new Date(2026, 6, 15, 9, 4).getTime(), 'breakfast'),
    ];
    const day2 = [reading('c', 101, new Date(2026, 6, 16, 16, 1).getTime(), 'dinner')];

    const groups = groupReadingsByDay([...day1, ...day2]);

    expect(groups).toHaveLength(2);
    expect(groups[0].dayKey).toBe('2026-07-15');
    expect(groups[0].readings.map((r) => r.id)).toEqual(['a', 'b']);
    expect(groups[1].dayKey).toBe('2026-07-16');
    expect(groups[1].readings.map((r) => r.id)).toEqual(['c']);
  });

  it('sorts days ascending and readings within a day ascending, regardless of input order', () => {
    const readings = [
      reading('late', 94, new Date(2026, 6, 15, 13, 25).getTime()),
      reading('day2', 101, new Date(2026, 6, 16, 16, 1).getTime()),
      reading('early', 86, new Date(2026, 6, 15, 8, 0).getTime()),
    ];

    const groups = groupReadingsByDay(readings);

    expect(groups.map((g) => g.dayKey)).toEqual(['2026-07-15', '2026-07-16']);
    expect(groups[0].readings.map((r) => r.id)).toEqual(['early', 'late']);
  });

  it('returns an empty array for no readings', () => {
    expect(groupReadingsByDay([])).toEqual([]);
  });
});

describe('formatSlashDate', () => {
  it('formats a date as mm/dd/yyyy with zero-padding', () => {
    expect(formatSlashDate(new Date(2026, 6, 15))).toBe('07/15/2026');
  });

  it('pads single-digit months and days', () => {
    expect(formatSlashDate(new Date(2026, 0, 5))).toBe('01/05/2026');
  });
});
