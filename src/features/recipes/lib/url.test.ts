import { describe, it, expect } from 'vitest';
import { hostnameOf, isValidUrl } from './url';

describe('hostnameOf', () => {
  it('extracts the hostname without a www prefix', () => {
    expect(hostnameOf('https://www.example.com/recipe/1')).toBe('example.com');
  });

  it('extracts the hostname when there is no www prefix', () => {
    expect(hostnameOf('https://cooking.example.com/page')).toBe('cooking.example.com');
  });

  it('returns the original string for an unparseable url', () => {
    expect(hostnameOf('not a url')).toBe('not a url');
  });
});

describe('isValidUrl', () => {
  it('accepts a well-formed url', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
  });

  it('rejects a malformed url', () => {
    expect(isValidUrl('example dot com')).toBe(false);
  });
});
