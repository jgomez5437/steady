export function isValidPatientDetails(name: string, dob: Date | null): boolean {
  return name.trim().length > 0 && dob !== null;
}

export interface SavedPatientProfile {
  name: string;
  dob: string;
}

export function parseStoredPatientProfile(value: unknown): SavedPatientProfile | null {
  if (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as Record<string, unknown>).name === 'string' &&
    typeof (value as Record<string, unknown>).dob === 'string'
  ) {
    const { name, dob } = value as { name: string; dob: string };
    return { name, dob };
  }
  return null;
}
