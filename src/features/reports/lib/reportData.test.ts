import { describe, it, expect } from 'vitest';
import { isValidPatientDetails } from './reportData';

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
