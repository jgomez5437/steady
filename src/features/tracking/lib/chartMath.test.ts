import { describe, it, expect } from 'vitest';
import { xForHour, yForValue, smoothPath } from './chartMath';

describe('xForHour', () => {
  it('maps hour 0 to the left padding', () => {
    expect(xForHour(0, 46, 18, 600)).toBe(46);
  });

  it('maps hour 24 to the right edge', () => {
    expect(xForHour(24, 46, 18, 600)).toBe(600 - 18);
  });

  it('maps hour 12 to the horizontal midpoint of the plot area', () => {
    const x = xForHour(12, 46, 18, 600);
    expect(x).toBeCloseTo(46 + (600 - 46 - 18) / 2);
  });
});

describe('yForValue', () => {
  const chartMin = 40;
  const chartMax = 300;
  const padT = 18;
  const padB = 30;
  const height = 220;

  it('maps the chart max to the top padding', () => {
    expect(yForValue(chartMax, chartMin, chartMax, padT, padB, height)).toBe(padT);
  });

  it('maps the chart min to the bottom edge', () => {
    expect(yForValue(chartMin, chartMin, chartMax, padT, padB, height)).toBe(height - padB);
  });

  it('clamps values above the chart max', () => {
    expect(yForValue(1000, chartMin, chartMax, padT, padB, height)).toBe(padT);
  });

  it('clamps values below the chart min', () => {
    expect(yForValue(-50, chartMin, chartMax, padT, padB, height)).toBe(height - padB);
  });
});

describe('smoothPath', () => {
  it('returns an empty string for a single point', () => {
    expect(smoothPath([{ x: 0, y: 0 }])).toBe('');
  });

  it('draws a straight line for two points', () => {
    expect(smoothPath([{ x: 0, y: 0 }, { x: 10, y: 10 }])).toBe('M 0 0 L 10 10');
  });

  it('starts the path at the first point for three or more points', () => {
    const path = smoothPath([{ x: 0, y: 0 }, { x: 5, y: 5 }, { x: 10, y: 0 }]);
    expect(path.startsWith('M 0 0')).toBe(true);
    expect(path).toContain('C');
  });
});
