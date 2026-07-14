import { describe, it, expect } from 'vitest';
import { isValidEmail, isValidPassword } from './validation';

describe('isValidEmail', () => {
  it('accepts a well-formed email', () => {
    expect(isValidEmail('person@example.com')).toBe(true);
  });

  it('rejects a string missing an @', () => {
    expect(isValidEmail('person.example.com')).toBe(false);
  });

  it('rejects a string missing a domain', () => {
    expect(isValidEmail('person@')).toBe(false);
  });

  it('rejects a string with spaces', () => {
    expect(isValidEmail('person @example.com')).toBe(false);
  });
});

describe('isValidPassword', () => {
  it('accepts a password of at least 6 characters', () => {
    expect(isValidPassword('abcdef')).toBe(true);
  });

  it('rejects a password shorter than 6 characters', () => {
    expect(isValidPassword('abc')).toBe(false);
  });
});
