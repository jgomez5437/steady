import { describe, it, expect } from 'vitest';
import { isValidPatientDetails, parseStoredPatientProfile } from './reportData';

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
