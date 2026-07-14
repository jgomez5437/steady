import { describe, it, expect } from 'vitest';
import { computeStatus } from './glucoseStatus';

const targets = { low: 70, high: 140 };

describe('computeStatus', () => {
  it('flags values below the low target', () => {
    expect(computeStatus(65, targets).label).toBe('Low');
  });

  it('flags values above the high target', () => {
    expect(computeStatus(150, targets).label).toBe('High');
  });

  it('treats values within range as in range', () => {
    expect(computeStatus(100, targets).label).toBe('In range');
  });

  it('treats the boundary values as in range', () => {
    expect(computeStatus(70, targets).label).toBe('In range');
    expect(computeStatus(140, targets).label).toBe('In range');
  });
});
