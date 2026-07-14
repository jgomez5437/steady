import { describe, it, expect } from 'vitest';
import { defaultMealTypeFor } from './mealType';

describe('defaultMealTypeFor', () => {
  it('returns fasting in the early morning', () => {
    expect(defaultMealTypeFor(new Date(2026, 0, 1, 6, 0))).toBe('fasting');
  });

  it('returns breakfast mid-morning', () => {
    expect(defaultMealTypeFor(new Date(2026, 0, 1, 9, 0))).toBe('breakfast');
  });

  it('returns lunch midday', () => {
    expect(defaultMealTypeFor(new Date(2026, 0, 1, 12, 0))).toBe('lunch');
  });

  it('returns dinner in the evening', () => {
    expect(defaultMealTypeFor(new Date(2026, 0, 1, 18, 0))).toBe('dinner');
  });

  it('falls back to fasting overnight', () => {
    expect(defaultMealTypeFor(new Date(2026, 0, 1, 2, 0))).toBe('fasting');
  });
});
